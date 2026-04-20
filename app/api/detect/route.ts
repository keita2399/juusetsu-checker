import { NextRequest, NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';

const model = new ChatGoogleGenerativeAI({
  model: 'gemini-2.5-flash',
  apiKey: process.env.GEMINI_API_KEY!,
});

const DETECT_PROMPT = `
このPDFの書類の種類を判定してください。

以下のいずれかに該当する場合、対応するdocTypeを返してください：
- juusetsu: 重要事項説明書（売買・賃貸契約前の法定書類）
- chinshaku: 賃貸借契約書（賃貸借に関する契約書）
- touki: 登記簿謄本・登記事項証明書
- joto: 売買契約書・不動産売買に関する書類（譲渡所得計算用）
- fudosan_shotoku: 収支内訳書・賃貸収支に関する書類（不動産所得用）
- other: 上記以外

必ず以下のJSON形式のみを返してください（説明文は不要）：
{
  "docType": "juusetsu",
  "docName": "書類から読み取れる物件名または書類名（不明な場合は書類種別名）"
}
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

    const message = new HumanMessage({
      content: [
        { type: 'media', mimeType: 'application/pdf', data: base64 },
        { type: 'text', text: DETECT_PROMPT },
      ],
    });

    const response = await model.invoke([message]);
    const text = (typeof response.content === 'string' ? response.content : '').trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: '判定できませんでした' }, { status: 500 });
    }

    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('detect error:', msg);
    return NextResponse.json({ error: `判定中にエラーが発生しました: ${msg}` }, { status: 500 });
  }
}
