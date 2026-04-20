'use client';
import { useState, useRef } from 'react';
import { BRAND, FONT_SANS, FONT_DISP } from '@/lib/brand';
import { Icon, ICONS } from '@/components/ui/Icon';

export type DocType = 'auto' | 'juusetsu' | 'chinshaku' | 'touki' | 'joto' | 'fudosan_shotoku';

const DOC_TYPES: { value: DocType; label: string; desc: string }[] = [
  { value: 'auto',            label: '自動判定',         desc: 'AIが書類の種類を自動で判別' },
  { value: 'juusetsu',        label: '重要事項説明書',   desc: '売買・賃貸契約前の法定書類' },
  { value: 'chinshaku',       label: '賃貸借契約書',     desc: '特約・退去費用・禁止事項を確認' },
  { value: 'touki',           label: '登記簿謄本',       desc: '権利関係・抵当権・差押えを確認' },
  { value: 'joto',            label: '譲渡所得計算',     desc: '売買契約書から譲渡所得を自動計算' },
  { value: 'fudosan_shotoku', label: '不動産所得申告',   desc: '賃貸収支から必要経費・所得を整理' },
];

interface TopScreenProps { onStart: (file: File, docType: DocType) => void; }

export function TopScreen({ onStart }: TopScreenProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<DocType>('auto');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.type === 'application/pdf') setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const selectedDoc = DOC_TYPES.find(d => d.value === docType)!;

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
              PDFをアップロードするだけで、リスク・注意点・確認事項を整理します。<br/>
              お客様への説明をより透明に、より丁寧に。
            </p>
          </div>

          {/* Doc type selector */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:24 }}>
            {DOC_TYPES.map(d => (
              <button key={d.value} onClick={() => setDocType(d.value)} style={{
                flex:1, padding:'12px 8px', border:`2px solid ${docType === d.value ? BRAND.navy : BRAND.border}`,
                borderRadius:12, background: docType === d.value ? BRAND.info.bg : '#fff',
                cursor:'pointer', fontFamily:FONT_SANS, transition:'all .15s',
              }}>
                <div style={{ fontSize:13, fontWeight:800, color: docType === d.value ? BRAND.navy : BRAND.ink700, marginBottom:3 }}>
                  {d.label}
                </div>
                <div style={{ fontSize:11, color: docType === d.value ? BRAND.info.fg : BRAND.ink400, lineHeight:1.4 }}>
                  {d.desc}
                </div>
              </button>
            ))}
          </div>

          {/* Dropzone */}
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragging ? BRAND.navy : selectedFile ? BRAND.ok.fg : BRAND.border}`,
              borderRadius: 20,
              padding: '48px 32px',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragging ? BRAND.info.bg : selectedFile ? BRAND.ok.bg : '#fff',
              transition: 'all .2s',
            }}
          >
            <input ref={inputRef} type="file" accept="application/pdf" style={{ display:'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

            {selectedFile ? (
              <>
                <div style={{ width:64, height:64, borderRadius:16, background:BRAND.ok.fg, margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon d={ICONS.check} size={32} stroke="#fff" sw={2.5}/>
                </div>
                <div style={{ fontSize:18, fontWeight:700, color:BRAND.ok.strong, marginBottom:6 }}>
                  {selectedFile.name}
                </div>
                <div style={{ fontSize:14, color:BRAND.ink400 }}>
                  {(selectedFile.size / 1024).toFixed(0)} KB · クリックで変更
                </div>
              </>
            ) : (
              <>
                <div style={{ width:64, height:64, borderRadius:16, background:BRAND.info.bg, margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon d={ICONS.upload} size={32} stroke={BRAND.navy} sw={1.7}/>
                </div>
                <div style={{ fontSize:18, fontWeight:700, color:BRAND.ink800, marginBottom:8 }}>
                  PDFをドラッグ＆ドロップ
                </div>
                <div style={{ fontSize:14, color:BRAND.ink400 }}>
                  またはクリックしてファイルを選択 · 最大 20MB
                </div>
              </>
            )}
          </div>

          {/* CTA */}
          <button
            onClick={() => selectedFile && onStart(selectedFile, docType)}
            disabled={!selectedFile}
            style={{
              width:'100%', marginTop:16, padding:'18px', border:'none', borderRadius:14,
              background: selectedFile ? BRAND.navy : BRAND.border,
              color: selectedFile ? '#fff' : BRAND.ink400,
              fontFamily:FONT_SANS, fontWeight:700, fontSize:17, cursor: selectedFile ? 'pointer' : 'default',
              transition:'all .2s',
              display:'flex', alignItems:'center', justifyContent:'center', gap:10,
            }}
          >
            <Icon d={ICONS.sparkle} size={20} stroke={selectedFile ? '#fff' : BRAND.ink400} sw={1.8}/>
            {selectedFile ? `「${selectedDoc.label}」を解析する` : 'PDFを選択してください'}
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
