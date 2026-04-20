'use client';
import { useState } from 'react';
import { BRAND, FONT_SANS } from '@/lib/brand';
import { Icon, ICONS } from '@/components/ui/Icon';

interface QuestionsModalProps { questions: string[]; onClose: () => void; }

export function QuestionsModal({ questions, onClose }: QuestionsModalProps) {
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
    <div onClick={onClose} style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.45)',
      display:'flex', alignItems:'center', justifyContent:'center',
      zIndex:100, padding:24,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background:'#fff', borderRadius:20, width:'100%', maxWidth:560,
        boxShadow:'0 24px 64px rgba(0,0,0,0.18)', overflow:'hidden',
      }}>
        {/* Header */}
        <div style={{ padding:'20px 24px 16px', borderBottom:`1px solid ${BRAND.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontWeight:800, fontSize:16, color:BRAND.ink800 }}>担当者への質問リスト</div>
            <div style={{ fontSize:12, color:BRAND.ink400, marginTop:2 }}>{questions.length}件 · コピーして担当者に送付してください</div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:`1px solid ${BRAND.border}`, borderRadius:8, padding:'6px 10px', cursor:'pointer', color:BRAND.ink400, fontFamily:FONT_SANS }}>
            ✕
          </button>
        </div>

        {/* List */}
        <div style={{ maxHeight:380, overflowY:'auto' }}>
          {questions.map((q, i) => (
            <div key={i} style={{
              display:'flex', alignItems:'flex-start', gap:12, padding:'14px 24px',
              borderBottom: i < questions.length - 1 ? `1px solid ${BRAND.border}` : 0,
            }}>
              <div style={{
                width:22, height:22, borderRadius:999, background:BRAND.info.bg, color:BRAND.info.fg,
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                fontSize:11, fontWeight:800, marginTop:1,
              }}>{i + 1}</div>
              <div style={{ flex:1, fontSize:14, color:BRAND.ink800, lineHeight:1.6 }}>{q}</div>
              <button onClick={() => copyOne(q, i)} style={{
                flexShrink:0, background:'none',
                border:`1px solid ${copied === i ? BRAND.ok.fg : BRAND.border}`,
                borderRadius:7, padding:'4px 12px', cursor:'pointer',
                fontSize:12, color: copied === i ? BRAND.ok.fg : BRAND.ink500,
                fontFamily:FONT_SANS, fontWeight:600, display:'flex', alignItems:'center', gap:4,
              }}>
                <Icon d={copied === i ? ICONS.check : ICONS.clip} size={12} stroke={copied === i ? BRAND.ok.fg : BRAND.ink500} sw={2}/>
                {copied === i ? '済' : 'コピー'}
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding:'16px 24px', borderTop:`1px solid ${BRAND.border}` }}>
          <button onClick={copyAll} style={{
            width:'100%', padding:'13px', border:'none', borderRadius:12, cursor:'pointer',
            background: copied === -1 ? BRAND.ok.fg : BRAND.navy,
            color:'#fff', fontFamily:FONT_SANS, fontWeight:700, fontSize:15,
            display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition:'all .2s',
          }}>
            <Icon d={copied === -1 ? ICONS.check : ICONS.clip} size={16} stroke="#fff" sw={2}/>
            {copied === -1 ? 'コピーしました！' : `全${questions.length}件をまとめてコピー`}
          </button>
        </div>
      </div>
    </div>
  );
}
