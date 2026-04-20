'use client';
import { useState, useRef } from 'react';
import { BRAND, FONT_SANS, FONT_DISP } from '@/lib/brand';
import { Icon, ICONS } from '@/components/ui/Icon';

interface TopScreenProps { onStart: (file: File) => void; }

export function TopScreen({ onStart }: TopScreenProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

  return (
    <div style={{ minHeight:'100dvh', display:'flex', flexDirection:'column', background:'#F8FAFB', fontFamily:FONT_SANS }}>

      {/* Header */}
      <div style={{ borderBottom:`1px solid ${BRAND.border}`, background:'#fff', padding:'0 48px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontFamily:FONT_DISP, fontSize:18, fontWeight:900, color:BRAND.navyD, letterSpacing:'-.01em' }}>
            重説チェッカー
          </div>
          <div style={{ fontSize:13, color:BRAND.ink400 }}>
            AIによる重要事項説明書解析システム
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'48px 24px' }}>
        <div style={{ width:'100%', maxWidth:680 }}>

          {/* Hero */}
          <div style={{ textAlign:'center', marginBottom:48 }}>
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
              重要事項説明書を<br/>AIで分かりやすく解説
            </h1>
            <p style={{ fontSize:16, color:BRAND.ink500, lineHeight:1.7, margin:0 }}>
              PDFをアップロードするだけで、リスク・注意点・確認事項を整理します。<br/>
              お客様への説明をより透明に、より丁寧に。
            </p>
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
            onClick={() => selectedFile && onStart(selectedFile)}
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
            {selectedFile ? `「${selectedFile.name}」を解析する` : 'PDFを選択してください'}
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
