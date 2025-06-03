from openai import OpenAI
from config import OPENAI_API_KEY

client = OpenAI()

def ai_message(
    user_message,
    age=None,
    salary=None,
    family=None,
    savings=None,
    month_summary=None,
    year_summary=None
):
    prompt = "あなたはユーザーの年齢、年収、家族構成、貯蓄状況、目標、そして家計の収支状況を踏まえた親切な金融アドバイザーです。"

    if age:
        prompt += f"\nユーザーの年齢は {age} 歳です。"
    if salary:
        prompt += f"\nユーザーの年収は {salary} 万円です。"
    if family:
        prompt += f"\n家族構成は {family} です。"
    if savings is not None:
        prompt += f"\n現在の貯蓄額は {savings:,} 円です。"
    if month_summary:
        prompt += f"\n最新の月次収支サマリー: {month_summary}"
    if year_summary:
        prompt += f"\n最新の年次収支サマリー: {year_summary}"

    if user_message:
        prompt += f"\n質問: {user_message}"

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "あなたは親切な金融アドバイザーです。"},
            {"role": "user", "content": prompt}
        ],
        max_tokens=500,
        temperature=0.7,
    )
    return response.choices[0].message.content.strip()
