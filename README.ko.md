# Notion-As-Blog

**Notion**을 CMS로 사용하는 모던 오픈소스 블로그 템플릿입니다. **Next.js 16** 기반.
Notion에서 글을 쓰면 블로그에 자동으로 반영됩니다.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

**[English](README.md)** | **한국어**

---

## 스크린샷

### 홈 (라이트 / 다크)

| 라이트 | 다크 |
|:---:|:---:|
| ![홈 라이트](docs/screenshots/home-desktop.png) | ![홈 다크](docs/screenshots/home-dark.png) |

### 포스트 상세

![포스트 상세](docs/screenshots/post-desktop.png)

### 모바일

<p align="center">
  <img src="docs/screenshots/home-mobile.png" alt="모바일" width="300" />
</p>

---

## 주요 기능

- **Notion CMS** — Notion에서 직접 글을 작성하고 관리
- **멀티 저자 지원** — 아바타, 소개, 소셜 링크가 포함된 별도의 저자 데이터베이스
- **카테고리 & 태그** — 커스터마이징 가능한 카테고리와 자유로운 태그 분류
- **시리즈** — 연관된 포스트를 시리즈로 묶어 이전/다음 네비게이션 제공
- **전문 검색** — 즉각적인 결과를 제공하는 내장 검색 API
- **다크 모드** — `next-themes` 기반 시스템 연동 테마 전환
- **SEO 최적화** — Open Graph, 동적 OG 이미지 생성, 사이트맵, robots.txt, RSS 피드, Organization JSON-LD
- **Giscus 댓글** — GitHub Discussions 기반 댓글 시스템
- **반응형 디자인** — Tailwind CSS 기반 모바일 퍼스트 레이아웃
- **커스텀 브랜딩** — 로고, 파비콘, 푸터 링크 커스터마이징
- **포스트 애니메이션** — 상세 페이지 타이프라이터 제목 효과 및 슬라이드업 전환
- **뉴스레터 CTA** — 홈 피드 하단 구독 섹션 (선택사항)
- **공유 버튼** — Web Share API 기반 네이티브 공유 (클립보드 폴백)
- **Docker 지원** — 멀티 스테이지 빌드 프로덕션 Dockerfile 포함
- **온디맨드 갱신** — 웹훅으로 콘텐츠를 즉시 새로고침

---

## 빠른 시작

### 1. Notion 템플릿 복제

아래 링크를 열고 템플릿을 본인의 Notion 워크스페이스에 복제하세요.

> **[Notion-As-Blog 템플릿](https://www.notion.so/welcometogyuminworld/Notion-As-Blog-30ab152141a480309a9ede1f8cac4cc7?source=copy_link)**

템플릿에는 샘플 데이터가 포함된 **Posts** 데이터베이스와 **Authors** 데이터베이스가 있어 바로 글쓰기를 시작할 수 있습니다.

### 2. Notion Integration 생성

1. [My Integrations](https://www.notion.so/profile/integrations)에서 **New integration** 클릭
2. 이름을 입력하고 (예: `notion-as-blog`), 템플릿을 복제한 워크스페이스를 선택
3. **Internal Integration Secret**을 복사 — 이것이 `NOTION_API_KEY`입니다

### 3. 데이터베이스에 Integration 연결

1. Notion에서 **Posts** 데이터베이스 페이지를 열기
2. 우측 상단 **···** → **연결(Connections)** → 생성한 Integration을 찾아 **연결**
3. **Authors** 데이터베이스에도 동일하게 반복

### 4. 데이터베이스 ID 확인

각 Notion 데이터베이스는 URL에 고유 ID가 포함되어 있습니다:

```
https://www.notion.so/{workspace}/{database_id}?v=...
                                   ^^^^^^^^^^^
```

Posts 데이터베이스(`NOTION_DATA_SOURCE_ID`)와 Authors 데이터베이스(`NOTION_AUTHORS_DATA_SOURCE_ID`)의 ID를 각각 복사하세요.

### 5. 프로젝트 설치 및 설정

```bash
git clone https://github.com/your-username/notion-as-blog.git
cd notion-as-blog
npm install
cp .env.example .env.local
```

`.env.local` 파일을 편집합니다:

```env
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxx
NOTION_DATA_SOURCE_ID=your_posts_database_id
NOTION_AUTHORS_DATA_SOURCE_ID=your_authors_database_id
TOKEN_FOR_REVALIDATE=any_random_secret_string
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 6. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 블로그를 확인할 수 있습니다.

---

## Notion에서 글 작성하기

### 새 포스트 작성

1. Notion에서 **Posts** 데이터베이스를 열기
2. 새 행을 추가하고 속성(property)들을 채우기
3. 페이지 본문에 글 내용을 작성 — 제목, 목록, 코드 블록, 이미지 등 모두 지원됩니다
4. 발행 준비가 되면 `status`를 **Public**으로 설정

### Posts 데이터베이스 컬럼

| 컬럼 | 타입 | 필수 | 설명 |
|---|---|---|---|
| **title** | Title | Yes | 포스트 제목 |
| **slug** | Rich text | No | URL 슬러그 (예: `my-first-post`). 비워두면 페이지 ID로 자동 생성 |
| **status** | Select | Yes | 발행 상태 (아래 참조) |
| **type** | Select | No | `Post` (기본값) 또는 `Page` |
| **date** | Date | Yes | 발행일. 이 필드를 기준으로 포스트가 정렬됩니다 |
| **category** | Select | Yes | `brand.ts`에 정의된 카테고리 이름과 일치해야 합니다 |
| **tags** | Multi-select | No | 자유 태그 (예: `Next.js`, `React`) |
| **series** | Rich text | No | 시리즈 이름. 같은 시리즈 이름을 가진 포스트들은 이전/다음 네비게이션으로 연결됩니다 |
| **author** | People | No | Notion 워크스페이스 멤버. Authors 데이터베이스의 이름과 매칭됩니다 |
| **summary** | Rich text | No | 포스트 카드와 SEO 메타에 표시되는 짧은 설명 |
| **thumbnail** | Files & media | No | 커버 이미지 (업로드 또는 외부 URL 붙여넣기) |

### Status 값

| 값 | 목록에 표시 | URL로 직접 접근 |
|---|---|---|
| `Public` | O | O |
| `PublicOnDetail` | X | O — 링크로만 공유하는 비공개 포스트에 유용 |
| `Draft` | X | X |
| `Private` | X | X |

### Type 값

| 값 | 설명 |
|---|---|
| `Post` | 일반 블로그 포스트. 홈 피드, 카테고리 페이지, 검색에 표시 |
| `Page` | 독립 페이지 (예: 랜딩 페이지). 포스트 목록에 표시되지 않음 |

### 시리즈 사용법

여러 포스트를 시리즈로 묶으려면, 각 포스트의 `series` 값을 동일하게 설정하세요 (예: `Next.js 블로그 만들기`). 블로그가 자동으로 포스트 상세 페이지에 시리즈 네비게이션(이전/다음)을 렌더링합니다.

### Authors 데이터베이스 (선택사항)

Notion 워크스페이스 멤버 이름 외에 더 풍부한 저자 프로필을 원한다면, Authors 데이터베이스를 사용하세요 (템플릿에 포함되어 있습니다):

| 컬럼 | 타입 | 설명 |
|---|---|---|
| **name** | Title | Notion People 이름과 정확히 일치해야 합니다 |
| **role** | Rich text | 직함 또는 역할 (예: `프론트엔드 엔지니어`) |
| **bio** | Rich text | 짧은 소개글 |
| **avatar** | Files & media | 프로필 사진 |
| **email** | Rich text | 이메일 주소 |
| **github** | URL | GitHub 프로필 URL |
| **x** | URL | X (Twitter) 프로필 URL |
| **linkedin** | URL | LinkedIn 프로필 URL |
| **website** | URL | 개인 웹사이트 URL |

---

## 커스터마이징

모든 사이트 설정은 `src/config/brand.ts`에서 관리합니다:

### 사이트 정보

```ts
name: "My Blog",
title: "A Developer Blog",
highlight: "Developer",    // 타이틀에서 강조할 단어
description: "Your blog description.",
url: "https://your-domain.com",
since: 2025,               // 푸터 저작권 시작 연도
lang: "ko",
```

### 로고 & 파비콘

```ts
logo: {
  image: "",               // 로고 이미지 경로 (/public 기준). "" = 텍스트만 표시
  showNameWithLogo: true,  // 로고 옆에 블로그 이름 표시
  png: "/logo.png",        // JSON-LD, RSS 피드에 사용
  ogWhite: "/logo-white.png", // OG 이미지에 오버레이되는 흰색 로고
  favicon: "",             // 커스텀 파비콘 경로. "" = 자동 생성 글자 아이콘
},
```

### 색상

`colors` 객체에서 HSL 값으로 색상 테마를 변경할 수 있습니다. 라이트 모드와 다크 모드 색상 모두 설정 가능합니다. 각 테마는 5가지 기본 값으로 구성됩니다:

- **brand** — 강조 색상 (버튼, 링크, 포커스 링)
- **bg** — 페이지 배경
- **text** — 본문 텍스트
- **surface** — 카드 및 음소거 영역 배경
- **edge** — 테두리 및 입력 필드 외곽선

### 폰트

```ts
fonts: {
  sans: {
    stack: 'Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  },
  mono: {
    family: "JetBrains Mono",
    cdn: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap",
    preconnect: ["https://fonts.googleapis.com", "https://fonts.gstatic.com"],
  },
  og: {
    family: "Pretendard",
    url: "https://cdn.jsdelivr.net/.../Pretendard-Bold.otf",
  },
},
```

- **sans** — 본문 텍스트용 폰트 스택. 비라틴 언어는 웹 폰트를 앞에 추가 (예: `'Pretendard, -apple-system, ...'`)
- **mono** — 코드 블록용 고정폭 폰트. Google Fonts CDN에서 로드
- **og** — 동적 OG 이미지 생성에 사용하는 폰트 (`.otf` 또는 `.ttf` URL)

### 카테고리

카테고리 이름은 Notion Posts 데이터베이스의 Select 값과 **정확히 일치**해야 합니다:

```ts
categories: [
  { name: "Development", slug: "development", color: "orange", icon: "dns", description: "..." },
  { name: "Design", slug: "design", color: "teal", icon: "palette", description: "..." },
  { name: "Product", slug: "product", color: "green", icon: "work", description: "..." },
],
```

### 소셜 링크

푸터에 표시되는 소셜 미디어 아이콘 링크입니다. `""`으로 설정하면 해당 아이콘이 숨겨집니다.

```ts
social: {
  github: "https://github.com/your-username",
  twitter: "",
  instagram: "",
  facebook: "",
  youtube: "",
  linkedin: "https://linkedin.com/in/your-profile",
  threads: "",
  tiktok: "",
  naverBlog: "",
},
```

### 푸터 링크

푸터에 그룹별 커스텀 링크를 추가할 수 있습니다:

```ts
footerLinks: {
  "Resources": [
    { label: "Documentation", href: "/docs" },
    { label: "GitHub", href: "https://github.com/..." },
  ],
  "Legal": [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
},
```

### SEO

```ts
keywords: ["Next.js", "blog", "frontend"],  // <meta name="keywords"> — []로 두면 태그 생략

organization: {   // Google 지식 패널용 Organization JSON-LD (선택사항)
  name: "Your Company",
  url: "https://your-domain.com",
  logo: "/logo.png",
  // ... address, contactPoint, sameAs 등
},
```

### Giscus 댓글

[Giscus](https://giscus.app/)를 설정한 후 config를 채우세요:

```ts
giscus: {
  repo: "your-username/your-repo",
  repoId: "R_...",
  category: "Announcements",
  categoryId: "DIC_...",
  mapping: "pathname",         // 포스트-디스커션 매핑 방식
  strict: "0",                 // 엄격한 제목 매칭
  reactionsEnabled: "1",       // 리액션 버튼 표시
  emitMetadata: "0",           // 디스커션 메타데이터 전송
  inputPosition: "bottom",     // 댓글 입력 위치
},
```

### 뉴스레터 CTA

`enabled`를 `true`로 설정하면 홈 피드 하단에 구독 섹션이 표시됩니다. 실제 구독 로직은 별도로 구현해야 합니다.

```ts
newsletter: {
  enabled: false,
  headline: "Stay ahead of the curve",
  description: "Join developers receiving the best content...",
  placeholder: "Enter your email address",
  cta: "Subscribe",
  disclaimer: "No spam, unsubscribe anytime.",
},
```

### 포스트 애니메이션

```ts
postAnimation: {
  enabled: true,  // 상세 페이지 타이프라이터 제목 + 슬라이드업 전환
},
```

### 동작 설정

```ts
postsPerPage: 10,                   // 피드 페이지당 포스트 수
slideshow: { intervalMs: 5000 },    // 고정 포스트 슬라이드쇼 자동 전환 간격 (ms)
reading: { wordsPerMinute: 200 },   // 읽기 시간 계산 (영어 200–250, CJK 500–600)
search: {
  dropdownLimit: 10,                // 검색 드롭다운 최대 결과 수
  pageLimit: 30,                    // /search 페이지 최대 결과 수
},
```

### 캐시

```ts
cache: {
  revalidate: 1800,       // ISR 갱신 간격 (초, 기본값: 30분)
  feedTtl: 3600,          // RSS Cache-Control max-age (초, 기본값: 1시간)
  imageTtl: 31536000,     // Notion 이미지 프록시 max-age (초, 기본값: 1년)
  authorsTtlMs: 300000,   // 인메모리 저자 캐시 TTL (밀리초, 기본값: 5분)
},
```

---

## 온디맨드 갱신 (Revalidation)

블로그는 성능을 위해 Notion 데이터를 캐싱합니다. Notion에서 포스트를 수정한 후 즉시 반영하려면 다음과 같이 요청하세요:

```bash
curl -X POST https://your-domain.com/api/revalidate \
  -H "Authorization: Bearer YOUR_TOKEN_FOR_REVALIDATE"
```

Notion 자동화나 외부 서비스의 웹훅으로 연결할 수도 있습니다. 별도로 갱신을 트리거하지 않으면, 콘텐츠는 30분마다 자동으로 새로고침됩니다.

---

## 배포

### Vercel (권장)

1. GitHub에 레포지토리 푸시
2. [Vercel](https://vercel.com/new)에서 프로젝트 임포트
3. Project Settings → Environment Variables에서 환경변수 추가
4. 배포

### Docker

```bash
# docker compose로 빌드 및 실행
docker compose up -d

# 또는 직접 빌드 (NOTION_API_KEY는 정적 생성을 위해 빌드 시점에 필요)
docker build -t notion-as-blog \
  --build-arg NOTION_API_KEY=your_key \
  --build-arg NOTION_DATA_SOURCE_ID=your_db_id \
  .
docker run -p 3000:3000 \
  -e NOTION_API_KEY=your_key \
  -e NOTION_DATA_SOURCE_ID=your_db_id \
  notion-as-blog
```

---

## 환경변수

| 변수 | 필수 | 설명 |
|---|---|---|
| `NOTION_API_KEY` | Yes | Notion Integration API 키 |
| `NOTION_DATA_SOURCE_ID` | Yes | Notion Posts 데이터베이스 ID |
| `NOTION_AUTHORS_DATA_SOURCE_ID` | No | Notion Authors 데이터베이스 ID |
| `TOKEN_FOR_REVALIDATE` | No | 온디맨드 갱신용 시크릿 토큰 (`/api/revalidate`) |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics 측정 ID |

---

## 라이선스

[MIT](LICENSE)
