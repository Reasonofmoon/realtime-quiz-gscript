# 🎯 실시간 퀴즈 & 투표 시스템

Google Apps Script + Google Sheets 기반의 교육용 실시간 퀴즈/투표 웹앱입니다.

---

## 📐 시스템 구조

```
┌─────────────────────────────────────────────────────────────┐
│                     Google Apps Script                       │
│                                                              │
│  ┌──────────┐    doGet(?page=teacher)    ┌───────────────┐  │
│  │          │ ◄──────────────────────── │               │  │
│  │  교사용   │    퀴즈 CRUD, 결과 집계    │   Code.gs     │  │
│  │ 대시보드  │ ──────────────────────► │   (Backend)   │  │
│  │          │                          │               │  │
│  └──────────┘                          │  ┌──────────┐  │  │
│                                        │  │  Google   │  │  │
│  ┌──────────┐    doGet() (기본)         │  │  Sheets   │  │  │
│  │          │ ◄──────────────────────── │  │   (DB)    │  │  │
│  │  학생용   │    응답 제출              │  │          │  │  │
│  │ 퀴즈 화면 │ ──────────────────────► │  └──────────┘  │  │
│  │          │                          │               │  │
│  └──────────┘                          └───────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 📁 파일 구조

```
quiz-app/
├── Code.gs              # 서버 로직 (CRUD, 집계, 라우팅)
├── student.html         # 학생용 UI
├── teacher.html         # 교사용 대시보드 UI
├── style.html           # 공유 CSS
├── student_script.html  # 학생 JS
├── teacher_script.html  # 교사 JS
├── appsscript.json      # 매니페스트 (웹앱 설정)
├── .clasp.json          # clasp 프로젝트 연결
└── README.md
```

## 🚀 배포 방법

### 방법 1: clasp CLI (권장)

```bash
# 1. clasp 설치 (최초 1회)
npm i -g @google/clasp

# 2. Google 로그인
clasp login

# 3. 새 프로젝트 생성
clasp create --type webapp --title "실시간 퀴즈 시스템"

# 4. 코드 푸시
clasp push

# 5. 웹앱 배포
clasp deploy -d "v1.0 최초 배포"

# 6. 배포 URL 확인
clasp deployments
```

### 방법 2: Google Apps Script 에디터 (수동)

1. [script.google.com](https://script.google.com) 접속
2. 새 프로젝트 생성
3. 각 파일 내용을 복사하여 붙여넣기
   - `Code.gs` → 기본 코드 파일
   - `.html` 파일들 → 파일 > 새 파일 > HTML
4. 배포 > 새 배포 > 웹 앱 선택
5. 액세스: "모든 사용자" 설정 후 배포

### 후속 업데이트 (URL 유지)

```bash
# 배포 ID 확인
clasp deployments

# 기존 배포 업데이트 (URL 유지!)
clasp push
clasp deploy --deploymentId <DEPLOYMENT_ID> -d "v1.1 버그 수정"
```

---

## 🎮 사용 방법

### 교사
1. `웹앱URL?page=teacher` 로 접속
2. **퀴즈 만들기** 탭에서 퀴즈 또는 투표 생성
3. **학생 접속 링크** 복사하여 공유
4. **결과 분석** 탭에서 실시간 응답 현황 확인

### 학생
1. 공유받은 링크로 접속 (기본 URL)
2. 이름 입력 후 참여
3. 활성화된 퀴즈 선택 → 응답 제출
4. 즉시 정답/오답 피드백 확인

---

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| 🔀 퀴즈/투표 모드 | 정답이 있는 퀴즈 & 의견 수렴용 투표 |
| 📊 실시간 집계 | 선택지별 분포 바 차트 + 정답률 |
| 👥 학생별 기록 | 이름, 선택, 정답여부, 시각 표시 |
| 🔒 중복 방지 | 같은 학생이 동일 퀴즈에 중복 응답 불가 |
| 📱 반응형 디자인 | 모바일/태블릿/PC 모두 지원 |
| ⚡ 활성/비활성 | 퀴즈를 선택적으로 공개/숨김 |

---

## 🔧 커스터마이징

### 접근 권한 변경 (`appsscript.json`)

```json
"webapp": {
  "access": "ANYONE",           // ANYONE | ANYONE_ANONYMOUS | MYSELF
  "executeAs": "USER_DEPLOYING" // USER_DEPLOYING | USER_ACCESSING
}
```

### Google Sheets 자동 생성

최초 실행 시 스프레드시트에 3개 시트가 자동 생성됩니다:
- **퀴즈목록**: 모든 퀴즈/투표 데이터
- **응답기록**: 학생 응답 데이터
- **설정**: 추후 확장용

---

## 📋 확장 아이디어

- **타이머 기능**: 시간 제한 퀴즈
- **이미지 문제**: Google Drive 이미지 첨부
- **리더보드**: 정답률/속도 기반 순위
- **자동 이메일 리포트**: Trigger로 주간 리포트 발송
- **Google Classroom 연동**: Classroom API로 과제 연계
