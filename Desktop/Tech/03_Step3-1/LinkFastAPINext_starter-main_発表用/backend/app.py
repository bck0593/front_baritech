from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import sqlite3
import pandas as pd
import os

# OpenAIクライアント初期化（環境変数OPENAI_API_KEY必須）
client = OpenAI()

# FastAPI初期化
app = FastAPI()

# CORS設定（Next.jsのlocalhost:3000からのアクセス許可）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 必要に応じて変更
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# ====================
# データスキーマ定義
# ====================
class EchoMessage(BaseModel):
    message: str | None = None

class AiMessage(BaseModel):
    message: str | None = None

class CountMessage(BaseModel):
    message: str | None = None

class AgeMessage(BaseModel):
    message: str | None = None

class SalaryMessage(BaseModel):
    message: str | None = None

class FamilyMessage(BaseModel):
    message: str | None = None

# ====================
# ユーザー情報を保存（簡易的にグローバル変数）
# ====================
user_age = None
user_salary = None
user_family = None

# ====================
# 年齢・年収・家族構成のエンドポイント
# ====================
@app.post("/api/age")
def set_age(message: AgeMessage):
    global user_age
    user_age = message.message if message.message else "未設定"
    return {"message": f"age: {user_age}"}

@app.post("/api/salary")
def set_salary(message: SalaryMessage):
    global user_salary
    user_salary = message.message if message.message else "未設定"
    return {"message": f"salary: {user_salary}"}

@app.post("/api/family")
def set_family(message: FamilyMessage):
    global user_family
    user_family = message.message if message.message else "未設定"
    return {"message": f"family: {user_family}"}

# ====================
# DBから最新年間収支情報を取得する関数
# ====================
def get_latest_summary():
    db_path = "db.sqlite3"  # SQLiteのファイルパス
    if not os.path.exists(db_path):
        raise FileNotFoundError("データベースが見つかりません")

    conn = sqlite3.connect(db_path)
    try:
        df = pd.read_sql_query("SELECT * FROM transactions", conn)
    finally:
        conn.close()

    # 日付をdatetime型に変換して年を抽出
    df['date'] = pd.to_datetime(df['date'])
    df['year'] = df['date'].dt.year

    latest_year = df['year'].max()
    df_latest = df[df['year'] == latest_year]

    income = df_latest[df_latest['amount'] > 0]['amount'].sum()
    expense = df_latest[df_latest['amount'] < 0]['amount'].sum()
    balance = income + expense

    return {
        "income": int(income),
        "expense": int(expense),
        "balance": int(balance)
    }

# ====================
# 家計データのAPI（数字のみ返す）
# ====================
@app.get("/api/summary")
def get_summary():
    try:
        summary = get_latest_summary()
        return {
            "income": summary["income"],
            "expense": summary["expense"],
            "balance": summary["balance"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ====================
# AIアドバイス生成エンドポイント
# ====================
@app.post("/api/ai")
def ai_endpoint(data: dict):
    message = data.get("message", "")
    age = user_age or "未設定"
    salary = user_salary or "未設定"
    family = user_family or "未設定"

    try:
        summary = get_latest_summary()
        income = f"{summary['income']:,}円"
        expense = f"{abs(summary['expense']):,}円"
        balance = f"{summary['balance']:,}円"
        finance_summary = (
            f"■今年の家計データ\n"
            f"- 収入: {income}\n"
            f"- 支出: {expense}\n"
            f"- 残高: {balance}"
        )
    except Exception as e:
        finance_summary = f"※家計データ取得に失敗しました: {e}"

    prompt = (
        f"以下のユーザー情報をもとに、資産形成に向けた優しいアドバイスをわかりやすく提供してください。\n\n"
        f"■ユーザー情報\n- 年齢: {age}歳\n- 年収: {salary}万円\n- 家族構成: {family}\n"
        f"{finance_summary}\n"
        f"\n■ユーザーからのコメント:\n{message}"
    )

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )

    return {"message": response.choices[0].message.content}
