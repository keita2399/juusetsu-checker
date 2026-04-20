export type RiskItem  = { id: string; title: string; summary: string; detail: string; question?: string };
export type WatchItem = { id: string; title: string; summary: string; question?: string };

export type AnalyzeResult = {
  doc: string;
  date: string;
  risks: RiskItem[];
  watches: WatchItem[];
  oks: string[];
  questions: string[];
};

export const MOCK_RESULTS: AnalyzeResult = {
  doc: 'グランドメゾン新宿 301号室',
  date: '2026.04.19',
  risks: [
    { id:'r1', title:'解約時に家賃2か月分の違約金', summary:'2年未満で解約すると ¥368,000 の支払いが必要です。', detail:'短期解約違約金', question:'短期解約違約金の計算方法と、免除・減額の可能性はありますか？' },
    { id:'r2', title:'更新料が毎年発生', summary:'一般的な2年ごとではなく、毎年1か月分の更新料が必要です。', detail:'契約更新条項', question:'更新料を2年ごとに変更、または廃止する交渉は可能ですか？' },
    { id:'r3', title:'原状回復の範囲が広い', summary:'通常の経年劣化も借主負担になっています。', detail:'原状回復特約', question:'「通常使用による劣化」の具体的な範囲を書面で確認できますか？' },
  ],
  watches: [
    { id:'w1', title:'ペット飼育は要相談', summary:'現状不可。書面での許可が必要です。', question:'ペット飼育許可の条件と、許可された場合の書面手続きを教えてください。' },
    { id:'w2', title:'駐車場は別契約', summary:'月額¥33,000が別途発生します。', question:'駐車場契約は本契約と同時解約できますか？また空きがない場合の手続きは？' },
  ],
  oks: ['敷金・礼金', '家賃の支払い方法', '鍵の引渡し', '火災保険の範囲'],
  questions: [
    '更新料は何年ごとに、いくら必要ですか？',
    '違約金の計算方法を具体的に教えてください',
    '原状回復の「通常使用」の範囲はどこまでですか？',
    'ペット飼育の許可条件を教えてください',
  ],
};
