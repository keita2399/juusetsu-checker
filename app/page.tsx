'use client';
import { useState, useRef } from 'react';
import { TopScreen, DocType, DOC_LABELS } from '@/components/screens/TopScreen';
import { AnalyzingScreen } from '@/components/screens/AnalyzingScreen';
import { ResultScreen } from '@/components/screens/ResultScreen';
import { AnalyzeResult, MOCK_RESULTS } from '@/lib/mockData';

type Screen = 'top' | 'analyzing' | 'result';

export default function Home() {
  const [screen, setScreen] = useState<Screen>('top');
  const [result, setResult] = useState<AnalyzeResult>(MOCK_RESULTS);
  const [error, setError] = useState<string | null>(null);
  const animDone = useRef(false);
  const apiDone = useRef(false);

  const tryShowResult = () => {
    if (animDone.current && apiDone.current) setScreen('result');
  };

  const handleStart = async (file: File, docType: DocType) => {
    setError(null);
    animDone.current = false;
    apiDone.current = false;
    setScreen('analyzing');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('docType', docType);

      const res = await fetch('/api/analyze', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || '解析失敗');

      const today = new Date().toLocaleDateString('ja-JP', { year:'numeric', month:'2-digit', day:'2-digit' }).replace(/\//g, '.');
      setResult({ ...data, date: today, docLabel: DOC_LABELS[docType] });
      apiDone.current = true;
      tryShowResult();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '解析中にエラーが発生しました');
      setScreen('top');
    }
  };

  return (
    <main style={{ minHeight: '100dvh' }}>
      {error && (
        <div style={{ background:'#FDECEC', color:'#B4343A', padding:'12px 16px', fontSize:13, textAlign:'center' }}>
          {error}
        </div>
      )}
      {screen === 'top' && <TopScreen onStart={handleStart} />}
      {screen === 'analyzing' && (
        <AnalyzingScreen onDone={() => { animDone.current = true; tryShowResult(); }} />
      )}
      {screen === 'result' && (
        <ResultScreen result={result} onBack={() => setScreen('top')} />
      )}
    </main>
  );
}
