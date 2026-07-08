'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import RiskBriefing from '@/components/RiskBriefing';
import DebtResult from '@/components/DebtResult';
import PriceResult from '@/components/PriceResult';
import ContractResult from '@/components/ContractResult';
import HugResult from '@/components/HugResult';
import { JudgmentResult } from '@/services/types';

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<JudgmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.result) {
        setResult(data.result);
      } else {
        setError(data.error || '분석에 실패했습니다.');
      }
    } catch {
      setError('서버 연결에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl" role="img" aria-label="계약서">📄</span>
            <div>
              <h1 className="text-xl font-bold text-gray-800">콘트렉체커</h1>
              <p className="text-xs text-gray-500">전세사기 감시자 - Contract Checker</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 결과가 없을 때: 업로드 UI */}
        {!result && (
          <div className="space-y-8">
            {/* 소개 */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                계약서 한 장으로<br />전세사기 위험을 확인하세요
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                계약서 이미지를 업로드하면 AI가 빚, 시세, 독소조항, HUG 보증 가능 여부를 종합 분석합니다.
              </p>
            </div>

            {/* 업로드 */}
            <FileUpload onFileSelect={handleFileSelect} isAnalyzing={isAnalyzing} />

            {/* 에러 */}
            {error && (
              <div className="max-w-xl mx-auto p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* 안내 */}
            <div className="max-w-xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <span className="text-2xl">🔍</span>
                  <h3 className="font-semibold text-gray-700 mt-2">빚 체크</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    매물의 근저당권 설정 현황을 확인합니다.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <span className="text-2xl">📊</span>
                  <h3 className="font-semibold text-gray-700 mt-2">시세 비교</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    주변 시세와 비교하여 적정 가격인지 판단합니다.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <span className="text-2xl">📋</span>
                  <h3 className="font-semibold text-gray-700 mt-2">독소조항 탐지</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    표준계약서와 비교하여 불리한 조항을 찾습니다.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <span className="text-2xl">🏛️</span>
                  <h3 className="font-semibold text-gray-700 mt-2">HUG 보증</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    전세보증금 반환보증 가입 가능 여부를 확인합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 결과 표시 */}
        {result && (
          <div className="space-y-6">
            {/* 뒤로가기 */}
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>새 계약서 분석하기</span>
            </button>

            {/* 종합 브리핑 */}
            <RiskBriefing result={result} />

            {/* 상세 결과 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DebtResult result={result.details.debt} />
              <PriceResult result={result.details.price} />
              <ContractResult result={result.details.contract} />
              <HugResult result={result.details.hug} />
            </div>

            {/* 면책 공지 */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-gray-500">
                ※ 본 분석 결과는 참고용이며, 법적 효력이 없습니다. 실제 계약 시에는 반드시 등기부등본을 직접 확인하고, 필요시 법률 전문가의 조언을 받으시기 바랍니다.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="border-t border-gray-100 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <p className="text-sm text-gray-500">
            콘트렉체커 - 전세사기 감시자 | 안전한 전세 계약을 위해
          </p>
        </div>
      </footer>
    </div>
  );
}
