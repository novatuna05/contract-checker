# 콘트렉체커 (Contract Checker)


> 전세 계약서를 분석하여 **전세사기 위험도**를 판단하고 브리핑해주는 웹 서비스

전세 계약을 앞둔 임차인이 계약서 이미지를 업로드하면, OCR로 내용을 추출하고 등기·시세·독소조항·HUG 가입 가능 여부를 종합 분석하여 위험도 등급(안전 / 주의 / 위험 / 매우위험)을 알려줍니다. 회원가입 없이 익명으로 바로 사용할 수 있습니다.

## 주요 기능

- **계약서 업로드** — JPG, PNG, PDF 지원, 드래그 앤 드롭 가능
- **OCR 처리** — 계약서에서 주소, 보증금, 계약 조건, 특약사항 추출 (AWS Textract 예정)
- **빚 체크** — 법원 등기정보광장 Open API로 (근)저당권 등 선순위 채권 확인
- **시세 체크** — 국토교통부 실거래가 + 한국부동산원 API로 매물 시세 적정성 판단
- **독소조항 체크** — 표준계약서와 비교하여 비표준 조항 탐지 및 유불리 분석
- **HUG 가입 가능 여부** — 주택도시보증공사 전세보증 가입 조건 판정
- **판단 AI 브리핑** — LLM이 위 결과를 종합하여 위험도 등급과 권장 행동 제시

## 분석 파이프라인

```
계약서 업로드
     │
     ▼
 ① OCR 텍스트 추출
     │
     ▼
 ② 병렬 분석 ─── 빚 체크 · 시세 체크 · 독소조항 체크
     │
     ▼
 ③ HUG 가입 가능 여부 확인
     │
     ▼
 ④ 판단 AI 종합 분석 → 위험도 브리핑
```

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript |
| UI | React 19, Tailwind CSS |
| OCR | AWS Textract (예정) |
| 외부 API | 법원 등기정보광장, 국토교통부 실거래가, 한국부동산원 |
| AI | OpenAI API (예정) |

현재 모든 외부 연동은 **Mock 모듈**로 구현되어 있으며, 환경변수 `USE_MOCK=false`로 전환하면 실제 API를 사용하도록 설계되어 있습니다 (인터페이스 + 팩토리 패턴).

## 시작하기

### 1. 설치

```bash
npm install
```

### 2. 환경변수 설정

```bash
cp .env.local.example .env.local
```

`.env.local`에서 필요한 값을 설정합니다:

| 변수 | 설명 |
|------|------|
| `USE_MOCK` | `true`면 Mock 서비스, `false`면 실제 API 사용 |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | AWS Textract OCR용 |
| `REGISTRY_API_KEY` | 법원 등기정보광장 API 키 |
| `MOLIT_API_KEY` | 국토교통부 실거래가 API 키 |
| `KREB_API_KEY` | 한국부동산원 API 키 |
| `OPENAI_API_KEY` | 판단 AI용 OpenAI API 키 |

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 프로젝트 구조

```
contract-checker/
├── src/
│   ├── app/
│   │   ├── page.tsx              # 메인 페이지
│   │   ├── layout.tsx            # 레이아웃
│   │   └── api/analyze/route.ts  # 분석 API 엔드포인트
│   ├── components/
│   │   ├── FileUpload.tsx        # 파일 업로드
│   │   ├── RiskBriefing.tsx      # 위험도 브리핑
│   │   ├── DebtResult.tsx        # 빚 체크 결과
│   │   ├── PriceResult.tsx       # 시세 체크 결과
│   │   ├── ContractResult.tsx    # 독소조항 결과
│   │   └── HugResult.tsx         # HUG 가입 결과
│   ├── services/
│   │   ├── orchestrator.ts       # 분석 파이프라인 조율
│   │   ├── factory.ts            # Mock/Real 서비스 팩토리
│   │   ├── types.ts              # 공통 타입 정의
│   │   ├── ocr/                  # OCR 서비스 (interface + mock)
│   │   ├── debt/                 # 빚 체크 서비스
│   │   ├── price/                # 시세 체크 서비스
│   │   ├── contract/             # 독소조항 체크 서비스
│   │   ├── hug/                  # HUG 판정 서비스
│   │   └── judgment/             # 판단 AI 서비스
│   └── lib/
│       ├── constants.ts          # 상수
│       └── region-codes.ts       # 시도/시군구 지역코드 매핑
├── .env.local.example            # 환경변수 템플릿
└── package.json
```

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint` | 린트 검사 |

## 로드맵

- [x] Mock 기반 전체 파이프라인 구현
- [ ] AWS Textract OCR 실제 연동
- [ ] 법원 등기정보광장 API 연동
- [ ] 국토교통부 실거래가 / 한국부동산원 API 연동
- [ ] OpenAI 판단 AI 연동
- [ ] HUG 공식 API 연동
