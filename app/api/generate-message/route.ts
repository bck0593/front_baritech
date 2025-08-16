import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { mealStatus, mealTime, mealMemo, excretionStatus, excretionTime, excretionMemo } = await request.json()

    const prompt = `
保育園での愛犬の今日の記録を基に、保護者向けの温かく親しみやすいメッセージを生成してください。

【今日の記録】
食事：
- 状態: ${mealStatus || "記録なし"}
- 時間: ${mealTime || "記録なし"}
- メモ: ${mealMemo || "記録なし"}

排泄：
- 状態: ${excretionStatus || "記録なし"}
- 時間: ${excretionTime || "記録なし"}
- メモ: ${excretionMemo || "記録なし"}

【メッセージ作成のポイント】
- 保護者が安心できるような温かい表現を使用
- 愛犬の様子を具体的に伝える
- 200文字程度で簡潔に
- 敬語を使用し、丁寧な文体で
- 愛犬の名前は「○○ちゃん」として記載
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
    })

    return NextResponse.json({ message: text })
  } catch (error) {
    console.error("AI生成エラー:", error)
    return NextResponse.json({ error: "メッセージの生成に失敗しました" }, { status: 500 })
  }
}
