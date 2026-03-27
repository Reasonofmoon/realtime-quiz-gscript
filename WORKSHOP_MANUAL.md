# 🎯 Google Apps Script로 만드는 실시간 퀴즈 시스템
## 워크숍 강연자 매뉴얼 — 120분 실습 코스

---

| 항목 | 내용 |
|------|------|
| **부제** | 교사가 직접 만드는 교육용 웹앱, 복붙에서 배포까지 |
| **총 시간** | 120분 (3부 + 휴식 10분) |
| **대상** | 중·고등 교사, 교육 테크 관심자, GAS 입문자 |
| **핵심 도구** | Google Apps Script, Google Sheets, clasp CLI |
| **실습 환경** | Google 계정, 브라우저 (Chrome 권장), VS Code (선택) |
| **완성 산출물** | 학생용 퀴즈 앱 + 교사용 대시보드 (URL 즉시 배포) |

> ★ **핵심 메시지**: "교육용 웹앱은 코딩이 아니라 **구조 설계**다 — 시트가 DB, 스크립트가 서버, HTML이 앱이 된다."

---

## 📑 목차

| 섹션 | 내용 | 시간 |
|------|------|------|
| 0 | 사전 준비 체크리스트 | 사전 |
| 0.1 | 전체 타임라인 요약 | — |
| 0.2 | 이론적 배경 | — |
| **1부** | **워밍업: GAS 환경 세팅 & 첫 웹앱** | 25분 |
| **2부** | **핵심 설계: 퀴즈 시스템 백엔드 구축** | 40분 |
| — | *휴식* | 10분 |
| **3부** | **산출물 제작: UI 제작 & 배포** | 35분 |
| 마무리 | 포트폴리오 확인 & 핵심 정리 | 10분 |
| 부록 A | 코드 치트시트 | — |
| 부록 B | 참고 문헌 및 레퍼런스 | — |

---

## ✅ 사전 준비 체크리스트

### 수강생 사전 준비

| 구분 | 항목 | 상세 | ☑ |
|------|------|------|---|
| 필수 | Google 계정 | Gmail 또는 Google Workspace 계정 | ☐ |
| 필수 | Chrome 브라우저 | 최신 버전 권장 | ☐ |
| 권장 | VS Code 설치 | [code.visualstudio.com](https://code.visualstudio.com) | ☐ |
| 권장 | Node.js 설치 | v18+ (clasp 사용 시 필요) | ☐ |
| 선택 | GitHub 계정 | 코드 백업용 | ☐ |

### 강연자 사전 준비

| 항목 | 상세 내용 | 준비 시점 |
|------|----------|----------|
| 샘플 스프레드시트 | 완성된 퀴즈 시스템 시트 1부 준비 | D-7 |
| 배포 URL 확보 | 완성본 웹앱 URL (학생/교사 각 1개) | D-7 |
| 코드 파일 배포 | `Code.gs` 외 7개 파일을 공유 폴더 또는 GitHub에 업로드 | D-3 |
| clasp 환경 테스트 | 강연자 PC에서 `clasp login` → `clasp push` 동작 확인 | D-1 |
| 네트워크 확인 | 실습실 Wi-Fi에서 `script.google.com` 접속 가능 여부 | D-1 |
| 프로젝터 세팅 | 브라우저 + VS Code 동시 표시 가능한 듀얼 화면 권장 | D-1 |

---

## ⏱ 전체 타임라인 요약

| 시간 | 구분 | 내용 | 핵심 활동 |
|------|------|------|----------|
| 0:00–0:05 | 오프닝 | 완성본 데모 & 시스템 구조 소개 | 학생 앱 라이브 체험 |
| 0:05–0:15 | 1부-① | Apps Script 에디터 세팅 | 빈 프로젝트 생성, doGet 작성 |
| 0:15–0:25 | 1부-② | 첫 웹앱 배포 & 듀얼 모드 이해 | Hello World → 웹앱 URL 확인 |
| 0:25–0:40 | 2부-① | Sheets as DB 설계 | 시트 자동 생성, 헤더 설정 |
| 0:40–0:55 | 2부-② | CRUD 함수 구현 | createQuiz, getActiveQuizzes |
| 0:55–1:05 | 2부-③ | 응답 처리 & 결과 집계 | submitResponse, getQuizResults |
| 1:05–1:15 | 휴식 | ☕ 쉬는 시간 | — |
| 1:15–1:30 | 3부-① | 학생용 UI 제작 | HTML + CSS + JS 조합 |
| 1:30–1:45 | 3부-② | 교사용 대시보드 제작 | 탭 네비게이션, 차트 렌더링 |
| 1:45–1:50 | 3부-③ | 웹앱 배포 & URL 공유 | 최종 배포 + 라이브 테스트 |
| 1:50–2:00 | 마무리 | 포트폴리오 확인 & Q&A | 핵심 정리, 확장 아이디어 |

---

## 📚 이론적 배경

### 개념 1: Sheets as Database (스프레드시트 = 데이터베이스)

| 항목 | 전통적 DB | Google Sheets as DB |
|------|----------|-------------------|
| 설치 | MySQL, PostgreSQL 설치 필요 | 설치 불필요, 브라우저만 |
| 스키마 | SQL로 테이블 정의 | 시트 이름 = 테이블, 헤더 행 = 컬럼 |
| 쿼리 | `SELECT * FROM ...` | `getDataRange().getValues()` |
| 비용 | 서버 호스팅 비용 | 무료 (Google 계정) |
| 한계 | 대규모 트래픽 가능 | ~50명 동시 접속 적합 (교실 규모) |

> **교육적 시사점**: 교사가 서버·DB 없이 **시트 하나로 완전한 웹앱**을 만들 수 있다. 교실 규모(20~40명)에서는 Sheets가 충분한 DB 역할을 한다.

📖 참고: Watt, A. & Eng, N. (2014). *Database Design — 2nd Edition.* BCcampus. — 관계형 DB와 스프레드시트 기반 데이터 관리의 개념적 차이를 다룸.

---

### 개념 2: Server-Client Bridge (google.script.run)

```
┌──────────────┐                    ┌──────────────┐
│  Client      │   google.script    │  Server      │
│  (HTML/JS)   │ ──────.run.────→   │  (Code.gs)   │
│  브라우저     │ ←── callback ───   │  GAS 런타임  │
└──────────────┘                    └──────────────┘
```

| 일반 웹앱 | GAS 웹앱 |
|----------|---------|
| fetch() / axios → REST API | `google.script.run.함수명()` |
| JSON 파싱 필요 | 자동 직렬화 |
| CORS 설정 필요 | 불필요 |
| 서버 배포 별도 | 한 번에 통합 배포 |

> **교육적 시사점**: 복잡한 API 설계 없이 **함수 이름만으로** 서버 호출이 가능하다. 프론트엔드↔백엔드 연동을 가장 쉽게 체험할 수 있는 환경.

📖 참고: Google. (2024). *HTML Service: Communicate with Server Functions.* Google Developers Documentation. — GAS의 클라이언트-서버 통신 공식 가이드.

---

### 개념 3: Dual-Mode Deployment (사이드바 + 웹앱)

| 모드 | 진입 | 장점 | 적합한 상황 |
|------|------|------|-----------|
| **사이드바** | 시트 메뉴 → Open Sidebar | 시트 데이터와 즉시 연동 | 교사 혼자 사용, 관리 도구 |
| **웹앱 (doGet)** | URL 직접 접근 | 독립 앱, 모바일 지원 | 학생 배포, 다수 접속 |

> **교육적 시사점**: 하나의 코드로 **교사용 관리 도구**(사이드바)와 **학생용 앱**(웹앱)을 동시에 만들 수 있다.

📖 참고: Google. (2024). *Web Apps — Google Apps Script.* Google Developers. — doGet/doPost 기반 웹앱 배포 공식 문서.

---

### 개념 4: 선언적 라우팅 (Query Parameter Routing)

```javascript
function doGet(e) {
  const page = e.parameter.page || 'student';  // 기본값 = 학생
  if (page === 'teacher') return teacherPage();
  return studentPage();
}
```

| URL | 결과 |
|-----|------|
| `.../exec` | 학생 화면 (기본) |
| `.../exec?page=teacher` | 교사 대시보드 |

> **교육적 시사점**: URL 파라미터 하나로 **역할별 라우팅**을 구현할 수 있다. SPA 프레임워크 없이도 다중 화면 앱이 가능.

📖 참고: MDN Web Docs. (2024). *URLSearchParams.* Mozilla Developer Network. — URL 쿼리 파라미터의 웹 표준 해설.

---

# 1부: 워밍업 — GAS 환경 세팅 & 첫 웹앱 (25분)

---

## 1-1. 오프닝: 완성본 데모 (5분)

### 강연자 스크립트

> "여러분, 지금부터 제가 보여드리는 화면은 **서버도 없고, DB도 없고, 코딩 경험도 거의 없이** 만들 수 있는 앱입니다. 한번 같이 체험해볼까요?"

**Step 1.** 프로젝터에 완성본 학생 URL 표시
**Step 2.** 수강생들에게 QR 코드 또는 URL을 공유하여 직접 접속하게 함
**Step 3.** 수강생 이름 입력 → 샘플 퀴즈 1개 풀기 → 결과 확인

> "방금 여러분이 사용한 이 앱을 오늘 **2시간 안에 직접 만듭니다.** 대단한 프레임워크가 아니라, Google Sheets와 Apps Script만으로요."

**Step 4.** 교사 URL(`?page=teacher`) 화면으로 전환
**Step 5.** 실시간으로 수강생 응답이 집계되는 모습을 보여줌

> "보셨죠? 학생이 응답하는 순간 여기 교사 대시보드에 실시간으로 반영됩니다. 이 시스템의 DB는 여러분이 매일 쓰는 **Google 스프레드시트**입니다."

> ★ **"교육용 웹앱은 코딩이 아니라 구조 설계입니다. 시트가 DB, 스크립트가 서버, HTML이 앱이 됩니다."**

---

## 1-2. 환경 세팅: Apps Script 에디터 (10분)

### 강연자 스크립트

> "자, 이제 직접 만들어봅시다. 첫 번째 단계는 빈 시트에서 Apps Script 에디터를 여는 겁니다."

**Step 1.** [sheets.new](https://sheets.new) 접속 → 빈 시트 생성

**Step 2.** 시트 이름을 **"퀴즈시스템_DB"** 로 변경

**Step 3.** 메뉴: **확장 프로그램 > Apps Script** 클릭

> TIP: Apps Script 에디터는 브라우저 기반 IDE입니다. VS Code와 비슷한 역할을 하지만, 별도 설치가 필요 없습니다.

**Step 4.** 기본으로 생성된 `코드.gs` 파일의 내용을 모두 지우고, 아래 코드 입력:

```
PROMPT — Code.gs 기본 구조
// ── 설정 ──────────────────────────────
const SHEET_NAME_QUIZZES = '퀴즈목록';
const SHEET_NAME_RESPONSES = '응답기록';
const SHEET_NAME_CONFIG = '설정';

// ── 웹앱 진입점 ──────────────────────
function doGet(e) {
  return HtmlService.createHtmlOutput('<h1>🎯 퀴즈 시스템 작동 중!</h1>')
    .setTitle('실시간 퀴즈')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
```

**Step 5.** 저장 (Ctrl+S)

> NOTE: `doGet(e)` 함수는 웹앱의 진입점입니다. 누군가 URL에 접속하면 이 함수가 실행됩니다.

---

## 1-3. 첫 웹앱 배포 & 확인 (10분)

**Step 1.** Apps Script 에디터에서 **배포 > 새 배포** 클릭

**Step 2.** ⚙️ 톱니바퀴 → **웹 앱** 선택

**Step 3.** 설정:

| 항목 | 값 |
|------|-----|
| 설명 | v0.1 테스트 |
| 실행 사용자 | 본인 |
| 액세스 | 모든 사용자 |

**Step 4.** **배포** 클릭 → URL 복사

**Step 5.** 새 탭에서 URL 접속 → **"🎯 퀴즈 시스템 작동 중!"** 확인

> "축하합니다! 여러분의 첫 번째 웹앱이 인터넷에 배포되었습니다. 서버 설정? 도메인 구매? Docker? 아무것도 필요 없었죠. 이것이 GAS의 힘입니다."

> TIP: Google이 서버, 도메인, HTTPS를 모두 무료로 제공합니다. 교사가 인프라를 걱정할 필요가 없습니다.

### Before / After 비교

| 항목 | 전통적 웹앱 | GAS 웹앱 |
|------|-----------|---------|
| 서버 세팅 | AWS/Vercel 가입 + 설정 | 불필요 |
| DB 설치 | MySQL/MongoDB 설치 | Google Sheets |
| 도메인 | 구매 + DNS 설정 | 자동 생성 URL |
| HTTPS | SSL 인증서 설정 | 자동 적용 |
| 배포 | CI/CD 파이프라인 | **클릭 한 번** |
| 비용 | 월 $5~50 | **무료** |

---

# 2부: 핵심 설계 — 퀴즈 시스템 백엔드 구축 (40분)

---

## 2-1. Sheets as DB: 시트 자동 생성 (15분)

### 강연자 스크립트

> "웹앱의 뼈대를 세웠으니, 이제 데이터를 저장할 구조를 만들겠습니다. 우리의 DB는 스프레드시트입니다. 직접 시트를 만드는 게 아니라, **코드가 자동으로 시트를 생성**하게 할 겁니다."

**Step 1.** `Code.gs`에 시트 초기화 함수 추가:

```
PROMPT — 시트 자동 생성 함수
function getOrCreateSheet_(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (headers && headers.length) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
  }
  return sheet;
}

function initSheets_() {
  getOrCreateSheet_(SHEET_NAME_QUIZZES, [
    'quizId', '제목', '질문', '선택지(JSON)', '정답인덱스', '유형', '활성', '생성일시'
  ]);
  getOrCreateSheet_(SHEET_NAME_RESPONSES, [
    'responseId', 'quizId', '학생이름', '선택인덱스', '정답여부', '응답일시'
  ]);
  getOrCreateSheet_(SHEET_NAME_CONFIG, ['키', '값']);
}
```

**Step 2.** 함수 드롭다운에서 `initSheets_` 선택 → **▶ 실행**

**Step 3.** 스프레드시트로 돌아가서 확인:

| 시트 탭 | 역할 | 헤더 수 |
|---------|------|--------|
| 퀴즈목록 | 퀴즈 데이터 저장 | 8개 컬럼 |
| 응답기록 | 학생 응답 기록 | 6개 컬럼 |
| 설정 | 확장용 설정 | 2개 컬럼 |

> "시트 3개가 자동으로 생겼죠? 헤더도 볼드체로, 첫 행 고정까지. 이제 이 시트가 여러분의 데이터베이스입니다."

> TIP: 함수명 끝에 `_` (언더스코어)를 붙이면 **내부 전용 함수**가 됩니다. 외부에서 `google.script.run`으로 호출할 수 없어 보안에 유리합니다.

---

## 2-2. CRUD 함수 구현 (15분)

### 강연자 스크립트

> "DB 구조가 준비됐으니, 이제 **데이터를 넣고 읽는 함수**를 만들겠습니다. 웹앱의 핵심이 되는 CRUD — Create, Read, Update, Delete — 중에서 오늘은 CRD를 구현합니다."

**Step 1.** 퀴즈 생성 함수 (Create):

```
PROMPT — 퀴즈 생성 (Create)
function createQuiz(data) {
  initSheets_();
  const sheet = getOrCreateSheet_(SHEET_NAME_QUIZZES);
  const id = Utilities.getUuid().slice(0, 8);

  sheet.appendRow([
    id,
    data.title || '',
    data.question,
    JSON.stringify(data.options),
    data.type === 'poll' ? -1 : (data.correctIndex || 0),
    data.type || 'quiz',
    'Y',
    new Date().toISOString()
  ]);

  return { success: true, quizId: id };
}
```

> NOTE: `Utilities.getUuid()` — GAS 내장 함수로 고유 ID를 자동 생성합니다. 앞 8자리만 잘라서 간결하게 사용합니다.

**Step 2.** 퀴즈 조회 함수 (Read):

```
PROMPT — 활성 퀴즈 목록 (Read)
function getActiveQuizzes() {
  initSheets_();
  const sheet = getOrCreateSheet_(SHEET_NAME_QUIZZES);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  return data.slice(1)
    .filter(row => row[6] === 'Y')
    .map(row => ({
      quizId: row[0],
      title: row[1],
      question: row[2],
      options: JSON.parse(row[3]),
      correctIndex: row[4],
      type: row[5]
    }));
}
```

**Step 3.** 토글 & 삭제 함수 (Update/Delete):

```
PROMPT — 활성/비활성 토글 & 삭제
function toggleQuiz(quizId) {
  const sheet = getOrCreateSheet_(SHEET_NAME_QUIZZES);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === quizId) {
      const newVal = data[i][6] === 'Y' ? 'N' : 'Y';
      sheet.getRange(i + 1, 7).setValue(newVal);
      return { success: true, active: newVal === 'Y' };
    }
  }
  return { success: false };
}

function deleteQuiz(quizId) {
  const sheet = getOrCreateSheet_(SHEET_NAME_QUIZZES);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === quizId) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false };
}
```

### CRUD ↔ 시트 매핑 비교표

| CRUD | SQL 문 | GAS 코드 | 시트 동작 |
|------|--------|---------|----------|
| Create | `INSERT INTO` | `sheet.appendRow()` | 마지막 행에 추가 |
| Read | `SELECT WHERE` | `getValues()` + `.filter()` | 전체 읽기 → JS 필터 |
| Update | `UPDATE SET` | `sheet.getRange().setValue()` | 특정 셀 값 변경 |
| Delete | `DELETE FROM` | `sheet.deleteRow()` | 행 삭제 |

> "SQL을 몰라도 괜찮습니다. JavaScript의 배열 메서드(`filter`, `map`)가 SQL의 WHERE, SELECT 역할을 대신합니다."

---

## 2-3. 응답 처리 & 결과 집계 (10분)

### 강연자 스크립트

> "백엔드의 마지막 조각입니다. 학생이 응답을 제출하면 **정답 체크 + 중복 방지 + 기록 저장**을 한 번에 처리하는 함수를 만듭니다."

**Step 1.** 응답 제출 함수:

```
PROMPT — 학생 응답 제출
function submitResponse(data) {
  initSheets_();
  const sheet = getOrCreateSheet_(SHEET_NAME_RESPONSES);
  const quizSheet = getOrCreateSheet_(SHEET_NAME_QUIZZES);
  const quizData = quizSheet.getDataRange().getValues();

  // 퀴즈 찾기
  let quiz = null;
  for (let i = 1; i < quizData.length; i++) {
    if (quizData[i][0] === data.quizId) {
      quiz = { correctIndex: quizData[i][4], type: quizData[i][5] };
      break;
    }
  }
  if (!quiz) return { success: false, error: '퀴즈를 찾을 수 없습니다.' };

  // 중복 체크
  const responses = sheet.getDataRange().getValues();
  for (let i = 1; i < responses.length; i++) {
    if (responses[i][1] === data.quizId && responses[i][2] === data.studentName) {
      return { success: false, error: '이미 응답하셨습니다.' };
    }
  }

  const isCorrect = quiz.type === 'poll' ? '-' :
    (data.selectedIndex === quiz.correctIndex ? 'O' : 'X');

  sheet.appendRow([
    Utilities.getUuid().slice(0, 8),
    data.quizId, data.studentName, data.selectedIndex,
    isCorrect, new Date().toISOString()
  ]);

  return { success: true, correct: isCorrect === 'O', type: quiz.type };
}
```

**Step 2.** 결과 집계 함수:

```
PROMPT — 퀴즈 결과 집계
function getQuizResults(quizId) {
  initSheets_();
  const responseSheet = getOrCreateSheet_(SHEET_NAME_RESPONSES);
  const quizSheet = getOrCreateSheet_(SHEET_NAME_QUIZZES);

  // 퀴즈 정보 조회
  const quizData = quizSheet.getDataRange().getValues();
  let quiz = null;
  for (let i = 1; i < quizData.length; i++) {
    if (quizData[i][0] === quizId) {
      quiz = {
        quizId: quizData[i][0], title: quizData[i][1],
        question: quizData[i][2], options: JSON.parse(quizData[i][3]),
        correctIndex: quizData[i][4], type: quizData[i][5]
      };
      break;
    }
  }
  if (!quiz) return { error: '퀴즈를 찾을 수 없습니다.' };

  // 응답 집계
  const respData = responseSheet.getDataRange().getValues();
  const responses = respData.slice(1).filter(r => r[1] === quizId);

  const tally = {};
  quiz.options.forEach((_, idx) => { tally[idx] = 0; });

  let correctCount = 0;
  responses.forEach(r => {
    tally[r[3]] = (tally[r[3]] || 0) + 1;
    if (r[4] === 'O') correctCount++;
  });

  return {
    quiz, totalResponses: responses.length,
    correctCount, correctRate: responses.length > 0 ?
      Math.round((correctCount / responses.length) * 100) : 0,
    tally
  };
}
```

> ★ **"시트가 DB, 스크립트가 서버 — 이 두 가지만으로 완전한 백엔드가 완성되었습니다."**

---

# ☕ 휴식 (10분)

> "여기까지 백엔드가 완성됐습니다. 쉬는 시간 동안 스프레드시트로 가서 '퀴즈목록' 시트를 확인해보세요. 방금 만든 함수들이 여기에 데이터를 읽고 쓰게 됩니다. 10분 뒤 프론트엔드를 만듭니다!"

---

# 3부: 산출물 제작 — UI 제작 & 배포 (35분)

---

## 3-1. 학생용 UI 제작 (15분)

### 강연자 스크립트

> "자, 이제 학생들이 실제로 보게 될 화면을 만듭니다. GAS에서는 HTML 파일을 만들어서 UI를 구성합니다."

**Step 1.** Apps Script 에디터에서 **파일 추가 > HTML** → 파일명: `student`

**Step 2.** 기본 HTML 구조 입력:

```
PROMPT — student.html 기본 구조
<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    /* 핵심 CSS만 */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Noto Sans KR', sans-serif; background: #f5f5f5; }
    .container { max-width: 480px; margin: 0 auto; padding: 20px; }
    .btn { padding: 12px 24px; border: 2px solid #1a1a1a;
           font-weight: 700; cursor: pointer; width: 100%; }
    .btn-primary { background: #FF6B35; color: white; }
    .quiz-card { background: white; padding: 24px;
                 border: 2px solid #1a1a1a; margin: 8px 0; }
    .option-btn { text-align: left; background: white;
                  margin: 8px 0; transition: all 0.2s; }
    .option-btn.selected { background: #FFF3EE; border-color: #FF6B35; }
  </style>
</head>
<body>
  <div class="container">
    <!-- 입장 화면 -->
    <div id="entry">
      <h1>🎯 실시간 퀴즈</h1>
      <input type="text" id="student-name" placeholder="이름을 입력하세요">
      <button class="btn btn-primary" onclick="enterQuiz()">참여하기</button>
    </div>
    <!-- 퀴즈 목록 (초기에는 숨김) -->
    <div id="quiz-list" style="display:none;"></div>
  </div>
</body>
</html>
```

**Step 3.** JavaScript 로직 추가 (`</body>` 바로 위에):

```
PROMPT — 학생용 JS 로직
<script>
let studentName = '';
let selectedIndex = -1;
let currentQuizId = '';

function enterQuiz() {
  studentName = document.getElementById('student-name').value.trim();
  if (!studentName) { alert('이름을 입력해주세요!'); return; }
  document.getElementById('entry').style.display = 'none';
  document.getElementById('quiz-list').style.display = 'block';
  loadQuizzes();
}

function loadQuizzes() {
  google.script.run
    .withSuccessHandler(renderQuizList)
    .withFailureHandler(e => alert(e.message))
    .getActiveQuizzes();
}

function renderQuizList(quizzes) {
  const el = document.getElementById('quiz-list');
  if (!quizzes.length) {
    el.innerHTML = '<p>현재 진행 중인 퀴즈가 없습니다</p>';
    return;
  }
  el.innerHTML = '<h2>진행 중인 퀴즈</h2>' + quizzes.map(q => `
    <div class="quiz-card" onclick="openQuiz('${q.quizId}')">
      <strong>${q.title}</strong>
      <p>${q.question}</p>
    </div>
  `).join('');
}

function submitAnswer() {
  if (selectedIndex < 0) { alert('선택지를 골라주세요!'); return; }
  google.script.run
    .withSuccessHandler(result => {
      if (!result.success) { alert(result.error); return; }
      if (result.type === 'poll') alert('✅ 투표 완료!');
      else alert(result.correct ? '🎉 정답!' : '❌ 오답!');
    })
    .submitResponse({
      quizId: currentQuizId,
      studentName: studentName,
      selectedIndex: selectedIndex
    });
}
</script>
```

> TIP: `google.script.run.함수명()` — 이것이 브라우저(클라이언트)에서 서버(Code.gs)를 호출하는 유일한 방법입니다. 반드시 `.withSuccessHandler()`와 `.withFailureHandler()`를 함께 사용하세요.

---

## 3-2. 교사용 대시보드 제작 (10분)

### 강연자 스크립트

> "학생 화면이 됐으니, 이제 교사용 대시보드를 만듭니다. 교사 화면은 **탭 네비게이션**으로 구성합니다."

**Step 1.** `doGet()` 함수를 라우팅 지원으로 업데이트:

```
PROMPT — 역할별 라우팅
function doGet(e) {
  const page = (e && e.parameter && e.parameter.page) || 'student';

  if (page === 'teacher') {
    return HtmlService.createTemplateFromFile('teacher')
      .evaluate()
      .setTitle('퀴즈 관리 - 교사용')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  return HtmlService.createTemplateFromFile('student')
    .evaluate()
    .setTitle('실시간 퀴즈')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
```

> NOTE: `createTemplateFromFile()` vs `createHtmlOutputFromFile()` — 템플릿 함수는 `<?!= include('style') ?>` 같은 서버사이드 인클루드를 지원합니다. 스타일과 스크립트를 분리할 때 필수!

**Step 2.** `teacher.html` 파일 생성 → 코드 파일에서 복사 붙여넣기

> TIP: 교사 UI는 복잡하므로, 강연자가 미리 준비한 **완성 코드를 붙여넣기**하는 방식을 권장합니다. 핵심 구조만 설명하고, 전체 코드는 부록에서 참조.

### 교사 대시보드 핵심 기능 매핑

| 탭 | 서버 함수 | 기능 |
|----|----------|------|
| 대시보드 | `getDashboardSummary()` | 전체 통계 카드 (퀴즈 수, 응답 수, 참여 학생) |
| 퀴즈 만들기 | `createQuiz(data)` | 퀴즈/투표 생성 폼 |
| 퀴즈 관리 | `getAllQuizzes()` + `toggleQuiz()` | 활성/비활성 토글, 삭제 |
| 결과 분석 | `getQuizResults(quizId)` | 선택지별 바 차트, 학생별 응답 테이블 |

---

## 3-3. 최종 배포 & 라이브 테스트 (10분)

### 강연자 스크립트

> "모든 코드가 완성되었습니다! 이제 최종 배포하고, 실제로 동작하는지 확인해봅시다."

**Step 1.** Apps Script 에디터 → **배포 > 배포 관리**

**Step 2.** 기존 배포의 **✏️ 수정** 클릭

**Step 3.** 버전: **새 버전** 선택 → 설명: "v1.0 퀴즈 시스템 완성" → **배포**

**Step 4.** 학생 URL과 교사 URL 확인:

| 역할 | URL |
|------|-----|
| 학생 | `배포URL/exec` |
| 교사 | `배포URL/exec?page=teacher` |

**Step 5.** 교사 화면에서 퀴즈 1개 생성:

| 항목 | 입력값 |
|------|--------|
| 유형 | 퀴즈 |
| 제목 | 테스트 퀴즈 |
| 질문 | 대한민국의 수도는? |
| 선택지 A | 부산 |
| 선택지 B | 서울 ✓ (정답) |
| 선택지 C | 인천 |
| 선택지 D | 대전 |

**Step 6.** 학생 URL을 수강생에게 공유 → 실시간으로 응답 확인!

> "여러분이 방금 응답한 데이터가 **스프레드시트에 실시간으로 기록**되고, 교사 대시보드에서 바로 집계됩니다. 서버? DB? 다 필요 없었죠!"

> ★ **"시트가 DB, 스크립트가 서버, HTML이 앱 — 이 세 가지 구조를 이해하면, 어떤 교육용 도구든 직접 만들 수 있습니다."**

---

# 마무리 (10분)

---

## 포트폴리오 확인

| # | 산출물 | 완성 여부 | ☑ |
|---|--------|---------|---|
| 1 | Google Sheets 퀴즈 DB (3개 시트) | 시트 자동 생성 | ☐ |
| 2 | Code.gs 백엔드 (CRUD + 집계) | 7개 함수 | ☐ |
| 3 | 학생용 UI (student.html) | 입장→퀴즈→응답→결과 | ☐ |
| 4 | 교사용 대시보드 (teacher.html) | 4개 탭 (대시보드/생성/관리/결과) | ☐ |
| 5 | 웹앱 배포 URL | 학생용 + 교사용 각 1개 | ☐ |

## 핵심 정리

| 개념 | 오늘 배운 것 | 내일 적용할 것 |
|------|------------|--------------|
| Sheets as DB | 시트 = 테이블, 행 = 레코드 | 출석부, 설문조사 등 다른 시트 앱 |
| Server-Client Bridge | `google.script.run` 으로 서버 함수 호출 | 사이드바 도구 제작 |
| 듀얼 모드 배포 | URL 파라미터로 역할별 라우팅 | 학생/교사 분리된 도구 제작 |
| CRUD 패턴 | `appendRow`, `getValues`, `deleteRow` | 데이터 관리가 필요한 모든 앱 |

---

## 클로징 멘트

> "오늘 2시간 동안 여러분은 **서버 없이, DB 없이, 프레임워크 없이** 완전한 교육용 웹앱을 만들었습니다."
>
> "기억하세요. **교육용 웹앱은 코딩이 아니라 구조 설계입니다.** 시트에 데이터 구조를 설계하고, 스크립트에서 로직을 처리하고, HTML로 화면을 보여주는 것. 이 세 가지 구조만 이해하면, 퀴즈뿐 아니라 출석부, 과제 제출 시스템, 투표 도구, 학습 포트폴리오 등 **어떤 교실용 도구든 직접 만들 수 있습니다.**"
>
> "여러분의 다음 프로젝트를 기대합니다. 감사합니다! 🎯"

### Q&A 안내

- 📧 이메일: `[강연자 이메일]`
- 📁 코드 전체: `[GitHub/Drive 공유 링크]`
- 📖 GAS 공식 문서: https://developers.google.com/apps-script

---

# 부록 A: 코드 치트시트

## 시트 조작 패턴

| 용도 | 코드 | 설명 |
|------|------|------|
| 시트 가져오기 | `ss.getSheetByName('[시트명]')` | null이면 없는 시트 |
| 시트 생성 | `ss.insertSheet('[시트명]')` | 새 시트 탭 추가 |
| 전체 데이터 | `sheet.getDataRange().getValues()` | 2D 배열로 반환 |
| 행 추가 | `sheet.appendRow([값1, 값2, ...])` | 마지막 행에 |
| 셀 값 변경 | `sheet.getRange(행, 열).setValue(값)` | 1-indexed |
| 행 삭제 | `sheet.deleteRow(행번호)` | 1-indexed |
| 헤더 고정 | `sheet.setFrozenRows(1)` | 스크롤 시 헤더 유지 |

## 서버-클라이언트 통신 패턴

```javascript
// 기본 호출
google.script.run
  .withSuccessHandler(data => { /* 성공 */ })
  .withFailureHandler(err => { alert(err.message); })
  .서버함수명(인자1, 인자2);

// 초기화 패턴 (앱 시작 시)
window.addEventListener('load', () => {
  google.script.run
    .withSuccessHandler(data => renderUI(data))
    .getInitData();
});
```

## 웹앱 배포 패턴

```javascript
// 학생/교사 라우팅
function doGet(e) {
  const page = (e && e.parameter && e.parameter.page) || '[기본화면]';
  if (page === '[역할]') return [역할]Page();
  return defaultPage();
}

// HTML 파일 인클루드
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
```

## 프롬프트 플레이스홀더

| 플레이스홀더 | 설명 | 예시 |
|-------------|------|------|
| `[시트명]` | 데이터 시트 이름 | '출석부', '과제목록' |
| `[역할]` | URL 파라미터 역할 구분 | 'teacher', 'admin' |
| `[기본화면]` | doGet 기본 반환 화면 | 'student', 'main' |
| `[앱이름]` | setTitle에 표시할 앱 제목 | '실시간 출석', '과제 제출' |

---

# 부록 B: 참고 문헌 및 레퍼런스

## 학술 참고

1. Watt, A. & Eng, N. (2014). *Database Design — 2nd Edition.* BCcampus. — 스프레드시트와 관계형 DB의 개념적 비교.
2. Fowler, M. (2002). *Patterns of Enterprise Application Architecture.* Addison-Wesley. — Server-Client 아키텍처 패턴의 근거.
3. Nielsen, J. (1993). *Usability Engineering.* Academic Press. — 단순 UI가 교육 도구에서 효과적인 이유.

## 공식 문서

- Google Apps Script 가이드: https://developers.google.com/apps-script
- HTML Service 통신: https://developers.google.com/apps-script/guides/html/communication
- Web Apps 배포: https://developers.google.com/apps-script/guides/web
- clasp CLI: https://github.com/google/clasp

## 완성 코드 저장소

- 실습 코드 전체: `[GitHub/Drive 공유 링크 삽입]`
- 완성본 학생 URL: `[배포 URL]/exec`
- 완성본 교사 URL: `[배포 URL]/exec?page=teacher`

---

> *본 교안은 Reason of Moon의 GAS Web App Factory 패턴을 기반으로 제작되었습니다.*
> *워크숍 문의: `[강연자 연락처]`*
