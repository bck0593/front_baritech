import sqlite3
from datetime import datetime, timedelta
import random
import os
import pandas as pd  # ← 忘れずに

# 作業ディレクトリ確認（任意）
print("現在の作業ディレクトリ:", os.getcwd())

# 既存DBファイルの削除
db_path = 'db.sqlite3'
if os.path.exists(db_path):
    try:
        os.remove(db_path)
        print("古いDBファイルを削除しました。")
    except Exception as e:
        print(f"DBファイル削除に失敗しました: {e}")
else:
    print("DBファイルは存在しません。")

# DB新規作成＆テーブル作成
conn = sqlite3.connect(db_path)
c = conn.cursor()

c.execute('DROP TABLE IF EXISTS transactions')
c.execute('''
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    amount REAL,
    type TEXT,
    description TEXT
)
''')

income_types = {
    '給与（夫）': '夫の月給',
    '給与（妻）': '妻の月給',
    '住宅手当': '会社からの家賃補助',
    '賞与': 'ボーナス支給'
}

expense_types = {
    '家賃': '2LDK家賃（補助後）',
    '食費': 'スーパーやコンビニ',
    '光熱費': '電気・ガス・水道代',
    '通信費': 'スマホ・ネット',
    '奨学金返済': '月1万円の返済',
    '娯楽費': '推し活やライブ参戦',
    '旅行': '旅行代（年1回）',
    '交通費': '通勤定期やICチャージ',
    '衣服費': '服や靴の購入',
    '医療費': '妊婦健診など',
    '日用品': 'ドラッグストアなど',
    'ベビー用品': 'ベビーベッド・服・消耗品',
    '車関連費': '車検・保険・ガソリン代'
}

today = datetime.now()
start_date = today - timedelta(days=365)  # ← 1年間に設定

data = []
current = start_date

while current <= today:
    if current.day == 1:
        data.append((current.strftime("%Y-%m-%d"), 330000, '給与（夫）', income_types['給与（夫）']))
        data.append((current.strftime("%Y-%m-%d"), 250000, '給与（妻）', income_types['給与（妻）']))
        data.append((current.strftime("%Y-%m-%d"), 30000, '住宅手当', income_types['住宅手当']))
        data.append((current.strftime("%Y-%m-%d"), -70000, '家賃', expense_types['家賃']))
        data.append((current.strftime("%Y-%m-%d"), -10000, '奨学金返済', expense_types['奨学金返済']))

    if current.day == 10 and current.month in [7, 12]:
        data.append((current.strftime("%Y-%m-%d"), 200000, '賞与', income_types['賞与']))

    if random.random() < 0.35:
        expense_type = random.choice(list(expense_types.keys())[1:])
        amount = random.randint(500, 12000)
        data.append((current.strftime("%Y-%m-%d"), -amount, expense_type, expense_types[expense_type]))

    if current.month == 9 and current.day == 15:
        data.append((current.strftime("%Y-%m-%d"), -80000, '旅行', expense_types['旅行']))

    if random.random() < 0.05:
        data.append((current.strftime("%Y-%m-%d"), -random.randint(3000, 15000), '車関連費', expense_types['車関連費']))

    current += timedelta(days=1)

c.executemany('''
INSERT INTO transactions (date, amount, type, description)
VALUES (?, ?, ?, ?)
''', data)

conn.commit()
conn.close()

print("✅ 1年間分の家計データを生成・保存しました！")

# --- データ読み込み関数 ---
def load_data():
    conn = sqlite3.connect(db_path)
    df = pd.read_sql_query("SELECT * FROM transactions", conn)
    conn.close()
    return df