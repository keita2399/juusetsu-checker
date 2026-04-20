'use client';
import { useState } from 'react';
import { BRAND, FONT_SANS, FONT_DISP } from '@/lib/brand';
import { Icon, ICONS } from '@/components/ui/Icon';
import { AppBar, IconBtn } from '@/components/ui/primitives';

interface QuestionsScreenProps { questions: string[]; onBack: () => void; }

export function QuestionsScreen({ questions, onBack }: QuestionsScreenProps) {
  const [copied, setCopied] = useState<number | null>(null);

  const copyOne = (text: string, idx: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(idx);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  const copyAll = () => {
    const text = questions.map((q, i) => `${i + 1}. ${q}`).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(-1);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  return (
    <div style={{ minHeight:'100dvh', display:'flex', flexDirection:'column', background:BRAND.bg, fontFamily:FONT_SANS }}>
      <AppBar title="担当者への質問リスト" subtitle={`${questions.length}件`}
        leading={<IconBtn icon="chevL" onClick={onBack}/>}/>

      <div style={{ flex:1, padding:'16px 20px 120px' }}>
        <div style={{ fontSize:13, color:BRAND.ink500, lineHeight:1.6, marginBottom:16 }}>
          以下の質問をコピーして、担当者に送信または口頭で確認してください。
        </div>

        <div style={{ background:'#fff', border:`1px solid ${BRAND.border}`, borderRadius:12, overflow:'hidden' }}>
          {questions.map((q, i) => (
            <div key={i} style={{
              display:'flex', alignItems:'flex-start', gap:12, padding:'14px 16px',
              borderBottom: i < questions.length - 1 ? `1px solid ${BRAND.border}` : 0,
            }}>
              <div style={{
                width:22, height:22, borderRadius:999, background:BRAND.info.bg,
                color:BRAND.info.fg, display:'flex', alignItems:'center', justifyContent:'center',
                flexShrink:0, fontSize:11, fontWeight:800, marginTop:1,
              }}>{i + 1}</div>
              <div style={{ flex:1, fontSize:14, color:BRAND.ink800, lineHeight:1.6 }}>{q}</div>
              <button onClick={() => copyOne(q, i)} style={{
                flexShrink:0, background:'none', border:`1px solid ${BRAND.border}`,
                borderRadius:7, padding:'4px 10px', cursor:'pointer',
                fontSize:12, color: copied === i ? BRAND.ok.fg : BRAND.ink500,
                fontFamily:FONT_SANS, fontWeight:600, display:'flex', alignItems:'center', gap:4,
              }}>
                <Icon d={copied === i ? ICONS.check : ICONS.clip} size={12}
                  stroke={copied === i ? BRAND.ok.fg : BRAND.ink500} sw={2}/>
                {copied === i ? 'コピー済' : 'コピー'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        position:'sticky', bottom:0, background:'rgba(250,251,252,0.92)',
        backdropFilter:'blur(10px)', borderTop:`1px solid ${BRAND.border}`,
        padding:'12px 20px 24px',
      }}>
        <button onClick={copyAll} style={{
          width:'100%', padding:'15px', border:'none', borderRadius:14, cursor:'pointer',
          background: copied === -1 ? BRAND.ok.fg : BRAND.navy,
          color:'#fff', fontFamily:FONT_SANS, fontWeight:700, fontSize:16,
          display:'flex', alignItems:'center', justifyContent:'center', gap:8,
        }}>
          <Icon d={copied === -1 ? ICONS.check : ICONS.clip} size={18} stroke="#fff" sw={2}/>
          {copied === -1 ? 'コピーしました！' : `全${questions.length}件をまとめてコピー`}
        </button>
      </div>
    </div>
  );
}
