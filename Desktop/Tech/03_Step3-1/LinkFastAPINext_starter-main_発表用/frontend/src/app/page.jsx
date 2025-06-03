'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  // 状態管理
  const [aiMessage, setAiMessage] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [ageMessage, setAgeMessage] = useState('');
  const [ageResult, setAgeResult] = useState('');
  const [salaryMessage, setSalaryMessage] = useState('');
  const [salaryResult, setSalaryResult] = useState('');
  const [familyMessage, setFamilyMessage] = useState('');
  const [familyResult, setFamilyResult] = useState('');

  // 家計データ状態
  const [income, setIncome] = useState('');
  const [expense, setExpense] = useState('');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(true);

  // 画面表示時に家計データを取得（GET /api/summary）
  useEffect(() => {
    const fetchHouseholdData = async () => {
      setLoading(true); // ローディング開始
      try {
        const res = await fetch('http://localhost:8000/api/summary');
        if (!res.ok) throw new Error('家計データの取得に失敗しました');
        const data = await res.json();
        setIncome(data.income ?? '');
        setExpense(data.expense ?? '');
        setBalance(data.balance ?? '');
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // ローディング終了
      }
    };

    fetchHouseholdData();
  }, []);

  // POST: /api/age
  const handleAgeRequest = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/age', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: ageMessage }),
      });
      const data = await response.json();
      setAgeResult(data.message);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // POST: /api/salary
  const handleSalaryRequest = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/salary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: salaryMessage }),
      });
      const data = await response.json();
      setSalaryResult(data.message);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // POST: /api/family
  const handleFamilyRequest = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: familyMessage }),
      });
      const data = await response.json();
      setFamilyResult(data.message);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // POST: /api/ai  OpenAI連携用
  const handleAiRequest = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: aiMessage,
          age: ageMessage,
          salary: salaryMessage,
          family: familyMessage,
        }),
      });
      const data = await response.json();
      setAiResult(data.message);

      // AIの応答から収入・支出・残高を抽出してstateにセット
      const resultText = data.message;

      const incomeMatch = resultText.match(/収入[:：]?\s*([\d,]+)円/);
      const expenseMatch = resultText.match(/支出[:：]?\s*([\d,]+)円/);
      const balanceMatch = resultText.match(/残高[:：]?\s*([\d,]+)円/);

      if (incomeMatch) setIncome(incomeMatch[1]);
      if (expenseMatch) setExpense(expenseMatch[1]);
      if (balanceMatch) setBalance(balanceMatch[1]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">AIフィナンシャルプランナー</h1>

      <div className="mb-6">
        <h3 className="font-bold">■家計データ</h3>
        {loading ? (
          <p>読み込み中...</p>
        ) : (
          <>
            <p>収入: {income ? `${income}円` : '-'}</p>
            <p>支出: {expense ? `${expense}円` : '-'}</p>
            <p>残高: {balance ? `${balance}円` : '-'}</p>
          </>
        )}
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">年齢を登録</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={ageMessage}
            onChange={(e) => setAgeMessage(e.target.value)}
            className="border rounded px-2 py-1"
            placeholder="例）33歳"
          />
          <button
            onClick={handleAgeRequest}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            登録
          </button>
        </div>
        {ageResult && <p className="mt-2">年齢: {ageResult}</p>}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">年収を登録</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={salaryMessage}
            onChange={(e) => setSalaryMessage(e.target.value)}
            className="border rounded px-2 py-1"
            placeholder="例）10,000千円"
          />
          <button
            onClick={handleSalaryRequest}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            登録
          </button>
        </div>
        {salaryResult && <p className="mt-2">年収: {salaryResult}</p>}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">家族構成を登録</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={familyMessage}
            onChange={(e) => setFamilyMessage(e.target.value)}
            className="border rounded px-2 py-1"
            placeholder="例）妻34歳、長女5歳、次女1歳"
          />
          <button
            onClick={handleFamilyRequest}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            登録
          </button>
        </div>
        {familyResult && <p className="mt-2">家族構成: {familyResult}</p>}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">AIに質問を送信</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={aiMessage}
            onChange={(e) => setAiMessage(e.target.value)}
            className="border rounded px-2 py-1 flex-grow"
            placeholder="質問を入力してください"
          />
          <button
            onClick={handleAiRequest}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            送信
          </button>
        </div>
        {aiResult && (
          <div className="mt-4 p-4 border rounded bg-gray-100 whitespace-pre-wrap">
            {aiResult}
          </div>
        )}
      </section>
    </div>
  );
}
