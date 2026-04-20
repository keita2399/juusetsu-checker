'use client';
import { useState } from 'react';
import { BRAND, FONT_SANS, FONT_DISP } from '@/lib/brand';
import { Icon, ICONS } from '@/components/ui/Icon';
import { Button, AppBar, IconBtn } from '@/components/ui/primitives';
import { RiskItem, WatchItem } from '@/lib/mockData';

interface DetailScreenProps { item: RiskItem | WatchItem; kind: 'risk' | 'watch'; onBack: () => void; }

export function DetailScreen({ item, kind, onBack }: DetailScreenProps) {
  const [copied, setCopied] = useState(false);

  const question = item.question ?? 'この項目について、詳しく説明していただけますか？また、条件の変更は可能でしょうか？';
  const isRisk = kind === 'risk';

  const handleCopy = () => {
    navigator.clipboard.writeText(question).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div style={{ minHeight:'100dvh', display:'flex', flexDirection:'column', background:BRAND.bg, fontFamily:FONT_SANS }}>
      <AppBar title="項目の詳細" leading={<IconBtn icon="chevL" onClick={onBack}/>}/>

      <div style={{ flex:1, padding:'24px 20px 120px', display:'flex', flexDirection:'column', gap:16 }}>

        {/* Kind badge + title */}
        <div>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:6,
            background: isRisk ? BRAND.risk.bg : BRAND.watch.bg,
            border:`1px solid ${isRisk ? BRAND.risk.bd : BRAND.border}`,
            borderRadius:999, padding:'4px 12px', marginBottom:12,
          }}>
            <div style={{ width:7, height:7, borderRadius:999, background: isRisk ? BRAND.risk.fg : BRAND.watch.fg }}/>
            <span style={{ fontSize:12, fontWeight:700, color: isRisk ? BRAND.risk.fg : BRAND.watch.fg }}>
              {isRisk ? '再考を推奨' : '注意'}{isRisk && ` · ${(item as RiskItem).detail}`}
            </span>
          </div>
          <div style={{ fontFamily:FONT_DISP, fontSize:24, fontWeight:800, color:BRAND.ink800, lineHeight:1.35 }}>
            {item.title}
          </div>
        </div>

        {/* Explanation */}
        <div style={{
          background:'#fff', border:`1px solid ${BRAND.border}`, borderRadius:14, padding:'18px 18px',
        }}>
          <div style={{ fontSize:12, fontWeight:700, color:BRAND.ink400, letterSpacing:'.04em', marginBottom:10 }}>
            あなたにとって何が問題か
          </div>
          <p style={{ margin:0, fontSize:16, color:BRAND.ink700, lineHeight:1.8 }}>
            {item.summary}
          </p>
        </div>

        {/* Question */}
        <div style={{
          background: isRisk ? BRAND.risk.bg : BRAND.watch.bg,
          border:`1px solid ${isRisk ? BRAND.risk.bd : BRAND.border}`,
          borderRadius:14, padding:'18px 18px',
        }}>
          <div style={{ fontSize:12, fontWeight:700, color: isRisk ? BRAND.risk.fg : BRAND.watch.fg, letterSpacing:'.04em', marginBottom:10 }}>
            担当者にこう聞いてみましょう
          </div>
          <p style={{ margin:0, fontSize:15, color:BRAND.ink800, lineHeight:1.75, fontWeight:500 }}>
            「{question}」
          </p>
        </div>

      </div>

      {/* Footer */}
      <div style={{
        position:'sticky', bottom:0, background:'rgba(250,251,252,0.92)',
        backdropFilter:'blur(10px)', borderTop:`1px solid ${BRAND.border}`,
        padding:'12px 20px 24px', display:'flex', gap:10,
      }}>
        <Button variant="secondary" size="lg" onClick={onBack}
          leading={<Icon d={ICONS.chevL} size={16} stroke={BRAND.navy}/>}>戻る</Button>
        <Button variant="primary" size="lg" fullWidth onClick={handleCopy}
          leading={<Icon d={copied ? ICONS.check : ICONS.chat} size={18} stroke="#fff" sw={1.8}/>}>
          {copied ? '質問をコピーしました' : '質問をコピー'}
        </Button>
      </div>
    </div>
  );
}
