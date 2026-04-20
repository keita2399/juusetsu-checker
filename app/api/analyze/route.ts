import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const PROMPT = `
あなたは不動産の重要事項説明書を一般の方に分かりやすく解説する専門家です。
添付されたPDFの重要事項説明書を読んで、以下のJSON形式で返してください。

ルール：
- 専門用語を使わず、一般の方が理解できる平易な日本語で書く
- 「借主・買主にとって何が問題か」という視点で説明する
- 「詐欺」「違法」など断定的な表現は避ける
- 物件名が分かれば doc に入れる（不明なら「重要事項説明書」）

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

risks: 契約前に再考・交渉すべき重大なリスク（最大5件）
watches: 気になる点・注意すべき点（最大5件）
oks: 一般的な範囲で問題ない項目（最大6件）
questions: 担当者に確認すべき具体的な質問（最大5件）
`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'ファイルが見つかりません' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { mimeType: 'application/pdf', data: base64 } },
            { text: PROMPT },
          ],
        },
      ],
    });

    const text = (result.text ?? '').trim();
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
