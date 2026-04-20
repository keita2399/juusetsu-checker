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
