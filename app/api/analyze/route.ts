import { NextRequest, NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';

const model = new ChatGoogleGenerativeAI({
  model: 'gemini-2.5-flash',
  apiKey: process.env.GEMINI_API_KEY!,
});

const JSON_SCHEMA = `
必ず以下のJSON形式のみを返してください（説明文は不要）：

{
  "doc": "物件名または書類名",
  "risks": [
    {
      "id": "r1",
      "title": "15文字以内のタイトル",
      "summary": "60文字以内の説明。借主・買主にとって何が問題か。",
      "detail": "条項名",
      "question": "担当者に直接聞ける具体的な質問文（40文字以内）"
    }
  ],
  "watches": [
    {
      "id": "w1",
      "title": "15文字以内のタイトル",
      "summary": "60文字以内の説明。",
      "question": "担当者に直接聞ける具体的な質問文（40文字以内）"
    }
  ],
  "oks": ["問題ない項目1", "問題ない項目2"],
  "questions": [
    "担当者に確認すべき質問1",
    "担当者に確認すべき質問2"
  ]
}

risks: 再考・交渉すべき重大なリスク（最大5件）
watches: 気になる点・注意すべき点（最大5件）
oks: 一般的な範囲で問題ない項目（最大6件）
questions: 担当者に確認すべき具体的な質問（最大5件）
`;

const JSON_SCHEMA_TAX = `
必ず以下のJSON形式のみを返してください（説明文は不要）：

{
  "doc": "物件名または書類名",
  "calculation": [
    { "label": "項目名", "value": "金額または値（不明な場合は「書類に記載なし」）" }
  ],
  "risks": [
    {
      "id": "r1",
      "title": "15文字以内のタイトル",
      "summary": "60文字以内の説明。申告者にとって何が問題か。",
      "detail": "根拠条文・項目名",
      "question": "税理士や担当者に直接聞ける具体的な質問文（40文字以内）"
    }
  ],
  "watches": [
    {
      "id": "w1",
      "title": "15文字以内のタイトル",
      "summary": "60文字以内の説明。",
      "question": "税理士や担当者に直接聞ける具体的な質問文（40文字以内）"
    }
  ],
  "oks": ["確認済みの項目1", "確認済みの項目2"],
  "questions": [
    "税理士・担当者に確認すべき質問1",
    "税理士・担当者に確認すべき質問2"
  ]
}

calculation: 書類から読み取れる数値・計算結果（最大10件）
risks: 申告上のリスク・不利な点・注意すべき重大事項（最大5件）
watches: 確認が必要な点・書類が不足している可能性がある点（最大5件）
oks: 問題なく確認できた項目（最大6件）
questions: 税理士や担当者に確認すべき具体的な質問（最大5件）
`;

const COMMON_RULES = `
ルール：
- 専門用語を使わず、一般の方が理解できる平易な日本語で書く
- 「借主・買主にとって何が問題か」という視点で説明する
- 「詐欺」「違法」など断定的な表現は避ける
- 物件名が分かれば doc に入れる（不明なら書類種別名）
`;

const PROMPTS: Record<string, string> = {
  juusetsu: `
あなたは不動産の重要事項説明書を一般の方に分かりやすく解説する専門家です。
添付されたPDFの重要事項説明書を読んで、以下のJSON形式で返してください。
${COMMON_RULES}
重点的に確認すべき項目：
- 建物・土地の法的制限（用途地域・建ぺい率・容積率）
- 設備・インフラの状況（上下水道・ガス）
- 手付金・解約条件・違約金
- 近隣の嫌悪施設・騒音リスク
- 修繕積立金・管理費の状況（マンションの場合）
${JSON_SCHEMA}
`,

  chinshaku: `
あなたは賃貸借契約書を一般の方に分かりやすく解説する専門家です。
添付されたPDFの賃貸借契約書を読んで、以下のJSON形式で返してください。
${COMMON_RULES}
重点的に確認すべき項目：
- 特約事項（退去時原状回復・クリーニング費用負担）
- 敷金の返還条件・差し引き項目
- 更新料・更新手数料・自動更新条項
- 解約予告期間（何ヶ月前までに通知が必要か）
- 禁止事項（ペット・楽器・転貸・民泊等）
- 家賃改定条項・賃料値上げの可能性
- 保証会社の費用・条件
${JSON_SCHEMA}
`,

  touki: `
あなたは不動産登記簿謄本（登記事項証明書）を一般の方に分かりやすく解説する専門家です。
添付されたPDFの登記簿謄本を読んで、以下のJSON形式で返してください。
${COMMON_RULES}
重点的に確認すべき項目：
- 抵当権・根抵当権の設定状況（金融機関名・債権額）
- 差押え・仮差押え・仮処分の有無
- 仮登記（所有権移転仮登記等）の有無
- 所有者の一致確認（売主・貸主と登記名義人が一致しているか）
- 地役権・地上権・賃借権の設定
- 建物の床面積・構造・築年月の確認
- 土地の地目・面積の確認
${JSON_SCHEMA}
`,

  auto: `
あなたは不動産書類を一般の方に分かりやすく解説する専門家です。
添付されたPDFを読んで、まず書類の種類を判定してください。

判定できる書類の種類：
- 重要事項説明書（売買・賃貸契約前の法定書類）
- 賃貸借契約書（特約・退去費用・禁止事項を含む）
- 登記簿謄本・登記事項証明書（権利関係・抵当権等）
- 売買契約書・不動産売買に関する書類（取得費・譲渡価額等）
- 収支内訳書・賃貸収支に関する書類（不動産所得・経費等）
- その他の不動産関連書類

判定した書類の種類に応じて、以下の視点で解析してください：
- 重要事項説明書：法的制限・設備・手付金・修繕積立金
- 賃貸借契約書：特約・退去費用・更新料・解約予告・禁止事項
- 登記簿謄本：抵当権・差押・仮登記・所有者の一致確認
- 売買契約書：取得費・譲渡価額・譲渡費用・譲渡所得計算・税額試算
- 収支内訳書：収入・必要経費・減価償却・不動産所得計算
${COMMON_RULES}
書類の種類が売買契約書または収支内訳書の場合は、calculationフィールドを含む以下のJSON形式で返してください：
${JSON_SCHEMA_TAX}

それ以外の書類の場合は以下のJSON形式で返してください：
${JSON_SCHEMA}
`,

  joto: `
あなたは不動産の譲渡所得計算を一般の方に分かりやすく解説する税務専門家です。
添付されたPDF（売買契約書・重要事項説明書等）を読んで、以下のJSON形式で返してください。
${COMMON_RULES}
calculationに含めるべき計算項目：
- 譲渡価額（売却金額）
- 取得費（購入価格・取得時の諸費用）
- 譲渡費用（仲介手数料・印紙代等）
- 譲渡所得＝譲渡価額－取得費－譲渡費用
- 所有期間（長期／短期の判定）
- 概算税額（長期：20.315%、短期：39.63%）
- 3000万円特別控除の適用可否（居住用財産の場合）
重点的に確認すべき項目：
- 取得費が不明な場合は概算取得費（譲渡価額の5%）
- 相続・贈与による取得の場合の取得費の引き継ぎ
- 買換え特例・軽減税率の適用可否
- 損益通算・繰越控除の可否
${JSON_SCHEMA_TAX}
`,

  fudosan_shotoku: `
あなたは不動産所得の確定申告を一般の方に分かりやすく解説する税務専門家です。
添付されたPDF（賃貸借契約書・収支明細・領収書等）を読んで、以下のJSON形式で返してください。
${COMMON_RULES}
calculationに含めるべき計算項目：
- 総収入金額（家賃・礼金・更新料・共益費等）
- 必要経費合計
  - 減価償却費（建物・設備）
  - 管理費・管理委託料
  - 修繕費
  - 固定資産税・都市計画税
  - ローン利息（元本は不可）
  - 損害保険料（火災保険等）
  - その他経費
- 不動産所得＝総収入金額－必要経費
- 青色申告特別控除（65万円または10万円）の適用可否
重点的に確認すべき項目：
- 減価償却の計算方法（法定耐用年数・残存価値）
- 白色申告と青色申告の違い・メリット
- 修繕費と資本的支出の区分
- 赤字の場合の損益通算（給与所得との相殺）
${JSON_SCHEMA_TAX}
`,
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const docType = (formData.get('docType') as string) || 'juusetsu';

    if (!file) {
      return NextResponse.json({ error: 'ファイルが見つかりません' }, { status: 400 });
    }

    const prompt = PROMPTS[docType] ?? PROMPTS.juusetsu;

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');

    const message = new HumanMessage({
      content: [
        { type: 'media', mimeType: 'application/pdf', data: base64 },
        { type: 'text', text: prompt },
      ],
    });

    const response = await model.invoke([message]);
    const text = (typeof response.content === 'string' ? response.content : '').trim();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'AIの応答を解析できませんでした' }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('analyze error:', msg);
    return NextResponse.json({ error: `解析中にエラーが発生しました: ${msg}` }, { status: 500 });
  }
}
