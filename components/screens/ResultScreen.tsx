'use client';
import { useState } from 'react';
import { BRAND, FONT_SANS, FONT_DISP, FONT_NUM } from '@/lib/brand';
import { Icon, ICONS } from '@/components/ui/Icon';
import { AnalyzeResult, RiskItem, WatchItem } from '@/lib/mockData';
import { QuestionsModal } from '@/components/screens/QuestionsModal';
import { PrintLayout } from '@/components/screens/PrintLayout';

interface ResultScreenProps { result: AnalyzeResult; onBack: () => void; }

type SelectedItem = { item: RiskItem | WatchItem; kind: 'risk' | 'watch' } | null;

export function ResultScreen({ result: d, onBack }: ResultScreenProps) {
  const [selected, setSelected] = useState<SelectedItem>({ item: d.risks[0], kind: 'risk' });
  const [showQuestions, setShowQuestions] = useState(false);
  const [copied, setCopied] = useState(false);

  const select = (item: RiskItem | WatchItem, kind: 'risk' | 'watch') =>
    setSelected({ item, kind });

  const handleCopy = () => {
    if (!selected) return;
    const q = selected.item.question ?? 'この項目について、詳しく説明していただけますか？';
    navigator.clipboard.writeText(q).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const isRisk = selected?.kind === 'risk';

  return (
    <div style={{ minHeight:'100dvh', display:'flex', flexDirection:'column', background:'#F8FAFB', fontFamily:FONT_SANS }} className="no-print-root">

      {/* Header */}
      <div style={{ borderBottom:`1px solid ${BRAND.border}`, background:'#fff', padding:'0 32px', flexShrink:0 }}>
        <div className="result-header-inner">
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <button onClick={onBack} style={{
              background:'none', border:`1px solid ${BRAND.border}`, borderRadius:8,
              padding:'6px 12px', cursor:'pointer', color:BRAND.ink500, fontSize:13,
              fontFamily:FONT_SANS, display:'flex', alignItems:'center', gap:6,
            }}>
              <Icon d={ICONS.chevL} size={14} stroke={BRAND.ink500}/>
              戻る
            </button>
            <div>
              <div style={{ fontFamily:FONT_DISP, fontSize:17, fontWeight:800, color:BRAND.ink800 }}>{d.doc}</div>
              <div style={{ fontSize:12, color:BRAND.ink400 }}>重要事項説明書 · {d.date}</div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display:'flex', gap:24 }}>
            {[
              { k:'risk' as const, n:d.risks.length, l:'再考' },
              { k:'watch' as const, n:d.watches.length, l:'注意' },
              { k:'ok' as const, n:d.oks.length, l:'OK' },
              { k:'info' as const, n:d.questions.length, l:'質問' },
            ].map(s => (
              <div key={s.k} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:FONT_NUM, fontSize:22, fontWeight:800, color:BRAND[s.k].fg }}>{s.n}</div>
                <div style={{ fontSize:11, color:BRAND.ink400, fontWeight:600 }}>{s.l}</div>
              </div>
            ))}
          </div>

          <button onClick={() => window.print()} style={{
            background:'#fff', border:`1px solid ${BRAND.border}`, borderRadius:10,
            padding:'10px 20px', cursor:'pointer', color:BRAND.ink600,
            fontFamily:FONT_SANS, fontWeight:700, fontSize:14,
            display:'flex', alignItems:'center', gap:8, marginRight:8,
          }}>
            🖨 印刷
          </button>
          <button onClick={() => setShowQuestions(true)} style={{
            background:BRAND.navy, border:'none', borderRadius:10,
            padding:'10px 20px', cursor:'pointer', color:'#fff',
            fontFamily:FONT_SANS, fontWeight:700, fontSize:14,
            display:'flex', alignItems:'center', gap:8,
          }}>
            <Icon d={ICONS.chat} size={16} stroke="#fff" sw={1.8}/>
            担当者への質問 ({d.questions.length})
          </button>
        </div>
      </div>

      {/* 2-column body */}
      <div className="result-body">

        {/* Left: item list */}
        <div className="result-list">

          {/* Risks */}
          <div style={{ padding:'0 16px 8px', fontSize:11, fontWeight:700, color:BRAND.ink400, letterSpacing:'.06em' }}>
            再考を推奨 · {d.risks.length}件
          </div>
          {d.risks.map(item => (
            <ItemRow key={item.id} item={item} kind="risk"
              active={selected?.item.id === item.id}
              onClick={() => select(item, 'risk')} />
          ))}

          {/* Watches */}
          {d.watches.length > 0 && (
            <>
              <div style={{ padding:'16px 16px 8px', fontSize:11, fontWeight:700, color:BRAND.ink400, letterSpacing:'.06em', borderTop:`1px solid ${BRAND.border}`, marginTop:8 }}>
                注意 · {d.watches.length}件
              </div>
              {d.watches.map(item => (
                <ItemRow key={item.id} item={item} kind="watch"
                  active={selected?.item.id === item.id}
                  onClick={() => select(item, 'watch')} />
              ))}
            </>
          )}

          {/* OKs */}
          {d.oks.length > 0 && (
            <>
              <div style={{ padding:'16px 16px 8px', fontSize:11, fontWeight:700, color:BRAND.ink400, letterSpacing:'.06em', borderTop:`1px solid ${BRAND.border}`, marginTop:8 }}>
                問題なし · {d.oks.length}件
              </div>
              {d.oks.map((ok, i) => (
                <div key={i} style={{ padding:'10px 16px', display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:8, height:8, borderRadius:999, background:BRAND.ok.fg, flexShrink:0 }}/>
                  <div style={{ fontSize:13, color:BRAND.ink600 }}>{ok}</div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Right: detail panel */}
        <div className="result-detail">
          {selected ? (
            <div style={{ maxWidth:680 }}>

              {/* Kind badge + title */}
              <div style={{ marginBottom:24 }}>
                <div style={{
                  display:'inline-flex', alignItems:'center', gap:6,
                  background: isRisk ? BRAND.risk.bg : BRAND.watch.bg,
                  border:`1px solid ${isRisk ? BRAND.risk.bd : BRAND.border}`,
                  borderRadius:999, padding:'4px 14px', marginBottom:14,
                }}>
                  <div style={{ width:7, height:7, borderRadius:999, background: isRisk ? BRAND.risk.fg : BRAND.watch.fg }}/>
                  <span style={{ fontSize:12, fontWeight:700, color: isRisk ? BRAND.risk.fg : BRAND.watch.fg }}>
                    {isRisk ? `再考を推奨 · ${(selected.item as RiskItem).detail}` : '注意'}
                  </span>
                </div>
                <div style={{ fontFamily:FONT_DISP, fontSize:28, fontWeight:800, color:BRAND.ink800, lineHeight:1.3 }}>
                  {selected.item.title}
                </div>
              </div>

              {/* Explanation */}
              <div style={{ background:'#fff', border:`1px solid ${BRAND.border}`, borderRadius:16, padding:'24px', marginBottom:20 }}>
                <div style={{ fontSize:12, fontWeight:700, color:BRAND.ink400, letterSpacing:'.05em', marginBottom:12 }}>
                  あなたにとって何が問題か
                </div>
                <p style={{ margin:0, fontSize:16, color:BRAND.ink700, lineHeight:1.85 }}>
                  {selected.item.summary}
                </p>
              </div>

              {/* Question */}
              <div style={{
                background: isRisk ? BRAND.risk.bg : BRAND.watch.bg,
                border:`1px solid ${isRisk ? BRAND.risk.bd : BRAND.border}`,
                borderRadius:16, padding:'24px',
              }}>
                <div style={{ fontSize:12, fontWeight:700, color: isRisk ? BRAND.risk.fg : BRAND.watch.fg, letterSpacing:'.05em', marginBottom:12 }}>
                  担当者にこう聞いてみましょう
                </div>
                <p style={{ margin:'0 0 16px', fontSize:15, color:BRAND.ink800, lineHeight:1.8, fontWeight:500 }}>
                  「{selected.item.question ?? 'この項目について、詳しく説明していただけますか？また、条件の変更は可能でしょうか？'}」
                </p>
                <button onClick={handleCopy} style={{
                  background: copied ? BRAND.ok.fg : '#fff',
                  border:`1px solid ${copied ? BRAND.ok.fg : BRAND.border}`,
                  borderRadius:8, padding:'8px 18px', cursor:'pointer',
                  fontFamily:FONT_SANS, fontWeight:700, fontSize:13,
                  color: copied ? '#fff' : BRAND.ink600,
                  display:'flex', alignItems:'center', gap:6, transition:'all .2s',
                }}>
                  <Icon d={copied ? ICONS.check : ICONS.clip} size={14} stroke={copied ? '#fff' : BRAND.ink600} sw={2}/>
                  {copied ? 'コピーしました' : '質問をコピー'}
                </button>
              </div>

            </div>
          ) : (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', color:BRAND.ink400 }}>
              左のリストから項目を選択してください
            </div>
          )}
        </div>
      </div>

      {showQuestions && (
        <QuestionsModal questions={d.questions} onClose={() => setShowQuestions(false)} />
      )}

      <PrintLayout result={d} />
    </div>
  );
}

function ItemRow({ item, kind, active, onClick }: {
  item: RiskItem | WatchItem; kind: 'risk' | 'watch'; active: boolean; onClick: () => void;
}) {
  const color = BRAND[kind];
  return (
    <div onClick={onClick} style={{
      padding:'12px 16px', cursor:'pointer', display:'flex', alignItems:'flex-start', gap:10,
      background: active ? (kind === 'risk' ? BRAND.risk.bg : BRAND.watch.bg) : 'transparent',
      borderLeft: active ? `3px solid ${color.fg}` : '3px solid transparent',
      transition:'all .15s',
    }}>
      <div style={{ width:8, height:8, borderRadius:999, background:color.fg, flexShrink:0, marginTop:5 }}/>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:14, fontWeight:700, color:BRAND.ink800, lineHeight:1.4 }}>{item.title}</div>
        <div style={{ fontSize:12, color:BRAND.ink500, marginTop:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {item.summary}
        </div>
      </div>
    </div>
  );
}
