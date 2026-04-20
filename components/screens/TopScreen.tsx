'use client';
import { useState, useRef } from 'react';
import { BRAND, FONT_SANS, FONT_DISP } from '@/lib/brand';
import { Icon, ICONS } from '@/components/ui/Icon';

export type DocType = 'auto' | 'juusetsu' | 'chinshaku' | 'touki' | 'joto' | 'fudosan_shotoku';

const DOC_LABELS: Record<DocType, string> = {
  auto:            '自動判定',
  juusetsu:        '重要事項説明書',
  chinshaku:       '賃貸借契約書',
  touki:           '登記簿謄本',
  joto:            '不動産売買契約書',
  fudosan_shotoku: '収支内訳書',
};

type DetectState =
  | { status: 'idle' }
  | { status: 'detecting' }
  | { status: 'done'; docType: DocType; docName: string }
  | { status: 'error'; message: string };

interface TopScreenProps { onStart: (file: File, docType: DocType) => void; }

export function TopScreen({ onStart }: TopScreenProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [detect, setDetect] = useState<DetectState>({ status: 'idle' });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf') return;
    setSelectedFile(file);
    setDetect({ status: 'detecting' });

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/detect', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '判定失敗');
      setDetect({ status: 'done', docType: data.docType as DocType, docName: data.docName });
    } catch (err) {
      setDetect({ status: 'error', message: err instanceof Error ? err.message : '書類の判定に失敗しました' });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChangeFile = () => {
    setSelectedFile(null);
    setDetect({ status: 'idle' });
    setTimeout(() => inputRef.current?.click(), 0);
  };

  const canStart = detect.status === 'done';
  const detected = detect.status === 'done' ? detect : null;

  return (
    <div style={{ minHeight:'100dvh', display:'flex', flexDirection:'column', background:'#F8FAFB', fontFamily:FONT_SANS }}>

      {/* Header */}
      <div style={{ borderBottom:`1px solid ${BRAND.border}`, background:'#fff', padding:'0 48px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontFamily:FONT_DISP, fontSize:18, fontWeight:900, color:BRAND.navyD, letterSpacing:'-.01em' }}>
            不動産書類チェッカー
          </div>
          <div style={{ fontSize:13, color:BRAND.ink400 }}>
            AIによる不動産書類解析システム
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'48px 24px' }}>
        <div style={{ width:'100%', maxWidth:680 }}>

          {/* Hero */}
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:6, padding:'5px 14px',
              background:BRAND.info.bg, color:BRAND.info.fg,
              borderRadius:999, fontSize:13, fontWeight:700, marginBottom:20,
            }}>
              <Icon d={ICONS.sparkle} size={14} stroke={BRAND.info.fg} sw={2}/>
              Gemini 2.5 Flash による高精度解析
            </div>
            <h1 style={{
              fontFamily:FONT_DISP, fontSize:40, fontWeight:900, lineHeight:1.2,
              color:BRAND.ink800, margin:'0 0 16px', letterSpacing:'-0.02em',
            }}>
              不動産書類を<br/>AIで分かりやすく解説
            </h1>
            <p style={{ fontSize:16, color:BRAND.ink500, lineHeight:1.7, margin:0 }}>
              PDFをアップロードするだけで、書類の種類を自動判定します。<br/>
              リスク・注意点・確認事項を一覧でお届けします。
            </p>
          </div>

          {/* Dropzone */}
          {!selectedFile ? (
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragging ? BRAND.navy : BRAND.border}`,
                borderRadius: 20,
                padding: '64px 32px',
                textAlign: 'center',
                cursor: 'pointer',
                background: dragging ? BRAND.info.bg : '#fff',
                transition: 'all .2s',
              }}
            >
              <input ref={inputRef} type="file" accept="application/pdf" style={{ display:'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              <div style={{ width:64, height:64, borderRadius:16, background:BRAND.info.bg, margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon d={ICONS.upload} size={32} stroke={BRAND.navy} sw={1.7}/>
              </div>
              <div style={{ fontSize:18, fontWeight:700, color:BRAND.ink800, marginBottom:8 }}>
                PDFをドラッグ＆ドロップ
              </div>
              <div style={{ fontSize:14, color:BRAND.ink400 }}>
                またはクリックしてファイルを選択 · 最大 20MB
              </div>
            </div>
          ) : (
            <div style={{ border:`1px solid ${BRAND.border}`, borderRadius:20, background:'#fff', overflow:'hidden' }}>

              {/* File row */}
              <div style={{ padding:'20px 24px', display:'flex', alignItems:'center', gap:16, borderBottom:`1px solid ${BRAND.border}` }}>
                <div style={{ width:44, height:44, borderRadius:10, background:BRAND.info.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon d={ICONS.upload} size={22} stroke={BRAND.navy} sw={1.7}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:BRAND.ink800, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {selectedFile.name}
                  </div>
                  <div style={{ fontSize:12, color:BRAND.ink400, marginTop:2 }}>
                    {(selectedFile.size / 1024).toFixed(0)} KB
                  </div>
                </div>
                <button onClick={handleChangeFile} style={{
                  background:'none', border:`1px solid ${BRAND.border}`, borderRadius:8,
                  padding:'6px 12px', cursor:'pointer', color:BRAND.ink500, fontSize:12,
                  fontFamily:FONT_SANS, flexShrink:0,
                }}>
                  変更
                </button>
              </div>

              {/* Detection result */}
              <div style={{ padding:'24px' }}>
                {detect.status === 'detecting' && (
                  <div style={{ display:'flex', alignItems:'center', gap:12, color:BRAND.ink500, fontSize:14 }}>
                    <span style={{ display:'inline-block', width:18, height:18, border:`2px solid ${BRAND.navy}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/>
                    書類の種類を確認しています...
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  </div>
                )}

                {detect.status === 'done' && (
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:36, height:36, borderRadius:999, background:BRAND.ok.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Icon d={ICONS.check} size={18} stroke={BRAND.ok.fg} sw={2.5}/>
                    </div>
                    <div>
                      <div style={{ fontSize:12, color:BRAND.ink400, marginBottom:2 }}>書類の種類を判定しました</div>
                      <div style={{ fontSize:17, fontWeight:800, color:BRAND.ink800 }}>
                        {DOC_LABELS[detect.docType] ?? detect.docType}
                        {detect.docName && (
                          <span style={{ fontSize:13, fontWeight:500, color:BRAND.ink500, marginLeft:10 }}>
                            {detect.docName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {detect.status === 'error' && (
                  <div style={{ display:'flex', alignItems:'center', gap:10, color:BRAND.risk.fg, fontSize:13 }}>
                    <Icon d={ICONS.sparkle} size={16} stroke={BRAND.risk.fg} sw={2}/>
                    {detect.message}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={() => detected && onStart(selectedFile!, detected.docType)}
            disabled={!canStart}
            style={{
              width:'100%', marginTop:16, padding:'18px', border:'none', borderRadius:14,
              background: canStart ? BRAND.navy : BRAND.border,
              color: canStart ? '#fff' : BRAND.ink400,
              fontFamily:FONT_SANS, fontWeight:700, fontSize:17, cursor: canStart ? 'pointer' : 'default',
              transition:'all .2s',
              display:'flex', alignItems:'center', justifyContent:'center', gap:10,
            }}
          >
            <Icon d={ICONS.sparkle} size={20} stroke={canStart ? '#fff' : BRAND.ink400} sw={1.8}/>
            {canStart
              ? `「${DOC_LABELS[detected!.docType]}」を解析する`
              : selectedFile ? '書類を確認中...' : 'PDFを選択してください'}
          </button>

          {/* Privacy */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, marginTop:16, color:BRAND.ink400, fontSize:12 }}>
            <Icon d={ICONS.lock} size={14} stroke={BRAND.ink400} sw={1.7}/>
            アップロードされたファイルは解析後すぐに削除されます。社外に保存されません。
          </div>

        </div>
      </div>
    </div>
  );
}
