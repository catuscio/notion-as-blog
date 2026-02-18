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
- **SEO 최적화** — Open Graph, 사이트맵, robots.txt, RSS 피드
- **Giscus 댓글** — GitHub Discussions 기반 댓글 시스템
- **반응형 디자인** — Tailwind CSS 기반 모바일 퍼스트 레이아웃
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
lang: "ko",
```

### 색상

`colors` 객체에서 HSL 값으로 색상 테마를 변경할 수 있습니다. 라이트 모드와 다크 모드 색상 모두 설정 가능합니다.

### 폰트

```ts
fonts: {
  display: { family: "Inter", weights: [400, 500, 600, 700] },
  mono: { family: "JetBrains Mono", weights: [400, 500] },
},
```

[Google Fonts](https://fonts.google.com/)에서 제공하는 모든 폰트를 사용할 수 있습니다.

### 카테고리

카테고리 이름은 Notion Posts 데이터베이스의 Select 값과 **정확히 일치**해야 합니다:

```ts
categories: [
  { name: "Development", color: "orange", icon: "dns", description: "..." },
  { name: "Design", color: "teal", icon: "palette", description: "..." },
  { name: "Product", color: "green", icon: "work", description: "..." },
],
```

아이콘은 [Material Symbols](https://fonts.google.com/icons) 이름을 사용합니다.

### 소셜 링크

```ts
social: {
  github: "https://github.com/your-username",
  linkedin: "https://linkedin.com/in/your-profile",
  // twitter: "https://x.com/your-handle",
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
},
```

---

## 온디맨드 갱신 (Revalidation)

블로그는 성능을 위해 Notion 데이터를 캐싱합니다. Notion에서 포스트를 수정한 후 즉시 반영하려면 다음과 같이 요청하세요:

```bash
curl -X POST https://your-domain.com/api/revalidate \
  -H "Authorization: Bearer YOUR_TOKEN_FOR_REVALIDATE"
```

Notion 자동화나 외부 서비스의 웹훅으로 연결할 수도 있습니다. 별도로 갱신을 트리거하지 않으면, 콘텐츠는 1시간마다 자동으로 새로고침됩니다.

---

## 배포

### Vercel (권장)

1. GitHub에 레포지토리 푸시
2. [Vercel](https://vercel.com/new)에서 프로젝트 임포트
3. Project Settings → Environment Variables에서 환경변수 추가
4. 배포

### Docker

```bash
# 빌드 및 실행
docker compose up -d

# 또는 직접 빌드
docker build -t notion-as-blog .
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
