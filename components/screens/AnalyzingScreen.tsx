'use client';
import React, { useEffect, useState } from 'react';
import { BRAND, FONT_SANS, FONT_DISP, FONT_NUM } from '@/lib/brand';
import { Icon, ICONS } from '@/components/ui/Icon';

interface AnalyzingScreenProps { onDone: () => void; }

const STEPS = [
  '書類を読み込んでいます',
  '専門用語を平易な言葉に変換中',
  '押さえておくべき点を整理しています',
  'あなたへの注意点をまとめています',
];

export function AnalyzingScreen({ onDone }: AnalyzingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress(p => {
        const np = Math.min(100, p + 1.6);
        if (np >= 100) setTimeout(onDone, 600);
        return np;
      });
    }, 50);
    return () => clearInterval(id);
  }, [onDone]);

  useEffect(() => {
    setStep(Math.min(STEPS.length - 1, Math.floor(progress / 25)));
  }, [progress]);

  return (
    <div style={{
      minHeight:'100dvh', display:'flex', flexDirection:'column',
      background:'#FAFBFC', fontFamily:FONT_SANS, color:BRAND.ink700,
      padding:'60px 24px 32px',
    }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'16px 0 40px' }}>
        <div style={{ fontFamily:FONT_DISP, fontSize:22, fontWeight:900, color:BRAND.navyD }}>重説チェッカー</div>
      </div>

      {/* Document illustration */}
      <div style={{ display:'flex', justifyContent:'center', marginTop:20 }}>
        <div style={{
          width:180, height:220, background:'#fff', borderRadius:12,
          border:`1px solid ${BRAND.border}`, boxShadow:'0 16px 32px rgba(15,42,59,0.1)',
          padding:'22px 18px', position:'relative', overflow:'hidden',
        }}>
          <div style={{ height:10, background:BRAND.navy, width:'60%', borderRadius:3, marginBottom:12 }}/>
          {[0,1,2,3,4,5,6].map(i => (
            <div key={i} style={{
              height:6, background: i === step ? BRAND.gold : BRAND.border,
              width: `${55 + (i*7)%45}%`, borderRadius:2, marginBottom:10,
              opacity: i <= step * 2 + 1 ? 1 : 0.35,
              transition:'all .3s',
            }}/>
          ))}
          <div style={{
            position:'absolute', left:0, right:0, height:30,
            top: `${20 + (progress * 1.5) % 180}px`,
            background:'linear-gradient(180deg, rgba(43,95,127,0) 0%, rgba(43,95,127,0.18) 50%, rgba(43,95,127,0) 100%)',
            pointerEvents:'none',
          }}/>
        </div>
      </div>

      {/* Status */}
      <div style={{ textAlign:'center', marginTop:36 }}>
        <h2 style={{ fontFamily:FONT_DISP, fontSize:22, fontWeight:700, color:BRAND.ink800, margin:0, lineHeight:1.4 }}>
          書類を確認しています
        </h2>
        <div style={{ fontSize:14, color:BRAND.ink500, marginTop:8, lineHeight:1.6, minHeight:44 }}>
          {STEPS[step]}...
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginTop:28, padding:'0 4px' }}>
        <div style={{ height:6, background:BRAND.soft, borderRadius:999, overflow:'hidden' }}>
          <div style={{
            width:`${progress}%`, height:'100%',
            background:`linear-gradient(90deg, ${BRAND.navy} 0%, ${BRAND.navyD} 100%)`,
            borderRadius:999, transition:'width .1s linear',
          }}/>
        </div>
        <div style={{
          display:'flex', justifyContent:'space-between', marginTop:8,
          fontFamily:FONT_NUM, fontSize:12, color:BRAND.ink400,
        }}>
          <span>解析中</span>
          <span style={{ fontVariantNumeric:'tabular-nums' }}>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Step list */}
      <div style={{ marginTop:32 }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{
            display:'flex', alignItems:'center', gap:12, padding:'10px 4px',
            opacity: i <= step ? 1 : 0.4, transition:'opacity .3s',
          }}>
            <div style={{
              width:22, height:22, borderRadius:999, flexShrink:0,
              background: i < step ? BRAND.sage : i === step ? BRAND.navy : BRAND.border,
              color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              {i < step ? (
                <Icon d={ICONS.check} size={12} stroke="#fff" sw={3}/>
              ) : i === step ? (
                <div style={{ width:8, height:8, borderRadius:999, background:'#fff', animation:'pulse 1.2s ease-in-out infinite' }}/>
              ) : (
                <span style={{ fontSize:11, fontFamily:FONT_NUM, color:BRAND.ink400 }}>{i+1}</span>
              )}
            </div>
            <div style={{ fontSize:14, color: i <= step ? BRAND.ink700 : BRAND.ink400 }}>{s}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
