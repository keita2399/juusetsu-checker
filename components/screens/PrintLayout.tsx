'use client';
import { AnalyzeResult } from '@/lib/mockData';

interface PrintLayoutProps { result: AnalyzeResult; }

export function PrintLayout({ result: d }: PrintLayoutProps) {
  return (
    <div className="print-only" style={{ fontFamily:'Noto Sans JP, sans-serif', color:'#111', padding:'12mm 16mm' }}>

      {/* Header */}
      <div style={{ borderBottom:'2px solid #0F2A3B', paddingBottom:10, marginBottom:20 }}>
        <div style={{ fontSize:11, color:'#666', marginBottom:4 }}>重要事項説明書 チェックポイント</div>
        <div style={{ fontSize:20, fontWeight:900, color:'#0F2A3B' }}>{d.doc}</div>
        <div style={{ fontSize:11, color:'#666', marginTop:4 }}>解析日: {d.date}</div>
      </div>

      {/* Risks */}
      <div style={{ marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
          <div style={{ background:'#B4343A', color:'#fff', borderRadius:4, padding:'2px 10px', fontSize:12, fontWeight:700 }}>
            ⚠ 再考を推奨 · {d.risks.length}件
          </div>
          <div style={{ fontSize:11, color:'#666' }}>契約前に担当者へ必ず確認してください</div>
        </div>
        {d.risks.map((r, i) => (
          <div key={r.id} style={{ marginBottom:12, paddingLeft:12, borderLeft:'3px solid #B4343A' }}>
            <div style={{ fontSize:15, fontWeight:800, color:'#111', marginBottom:3 }}>
              {i + 1}. {r.title}
            </div>
            <div style={{ fontSize:12, color:'#444', lineHeight:1.6 }}>{r.summary}</div>
          </div>
        ))}
      </div>

      {/* Watches */}
      {d.watches.length > 0 && (
        <div style={{ marginBottom:20, paddingTop:16, borderTop:'1px solid #ddd' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
            <div style={{ background:'#B45309', color:'#fff', borderRadius:4, padding:'2px 10px', fontSize:12, fontWeight:700 }}>
              注意 · {d.watches.length}件
            </div>
          </div>
          {d.watches.map((w, i) => (
            <div key={w.id} style={{ marginBottom:8, paddingLeft:12, borderLeft:'3px solid #B45309' }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#111', marginBottom:2 }}>· {w.title}</div>
              <div style={{ fontSize:11, color:'#555', lineHeight:1.5 }}>{w.summary}</div>
            </div>
          ))}
        </div>
      )}

      {/* OKs */}
      {d.oks.length > 0 && (
        <div style={{ paddingTop:16, borderTop:'1px solid #ddd' }}>
          <div style={{ fontSize:12, fontWeight:700, color:'#15803D', marginBottom:8 }}>
            ✓ 一般的な範囲で問題ない項目
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'4px 16px' }}>
            {d.oks.map((ok, i) => (
              <div key={i} style={{ fontSize:11, color:'#555' }}>· {ok}</div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop:24, paddingTop:10, borderTop:'1px solid #ddd', fontSize:10, color:'#999', textAlign:'center' }}>
        このレポートは重説チェッカーにより自動生成されました。正式な法律文書ではありません。必ず担当者に直接ご確認ください。
      </div>
    </div>
  );
}
