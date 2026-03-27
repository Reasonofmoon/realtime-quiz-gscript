// ============================================================
//  실시간 퀴즈 & 투표 시스템 - Google Apps Script Backend
//  DB: Google Sheets (자동 생성)
// ============================================================

// ── 설정 ──────────────────────────────────────────────────────
const SHEET_NAME_QUIZZES = '퀴즈목록';
const SHEET_NAME_RESPONSES = '응답기록';
const SHEET_NAME_CONFIG = '설정';

// ── 웹앱 진입점 ──────────────────────────────────────────────
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

// HTML 파일 인클루드 헬퍼
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ── 스프레드시트 초기화 ──────────────────────────────────────
function getOrCreateSheet_(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.create('퀴즈시스템_DB');
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

// ── 퀴즈 CRUD ────────────────────────────────────────────────

/**
 * 새 퀴즈 생성
 * @param {Object} data - { title, question, options[], correctIndex, type }
 *   type: 'quiz' (정답 있음) | 'poll' (투표, 정답 없음)
 */
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

/**
 * 활성 퀴즈 목록 가져오기
 */
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
      type: row[5],
      createdAt: row[7]
    }));
}

/**
 * 모든 퀴즈 목록 (교사용)
 */
function getAllQuizzes() {
  initSheets_();
  const sheet = getOrCreateSheet_(SHEET_NAME_QUIZZES);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  return data.slice(1).map(row => ({
    quizId: row[0],
    title: row[1],
    question: row[2],
    options: JSON.parse(row[3]),
    correctIndex: row[4],
    type: row[5],
    active: row[6] === 'Y',
    createdAt: row[7]
  }));
}

/**
 * 퀴즈 활성/비활성 토글
 */
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
  return { success: false, error: '퀴즈를 찾을 수 없습니다.' };
}

/**
 * 퀴즈 삭제
 */
function deleteQuiz(quizId) {
  const sheet = getOrCreateSheet_(SHEET_NAME_QUIZZES);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === quizId) {
      sheet.deleteRow(i + 1);
      // 관련 응답도 삭제
      deleteResponsesByQuizId_(quizId);
      return { success: true };
    }
  }
  return { success: false };
}

function deleteResponsesByQuizId_(quizId) {
  const sheet = getOrCreateSheet_(SHEET_NAME_RESPONSES);
  const data = sheet.getDataRange().getValues();
  
  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][1] === quizId) {
      sheet.deleteRow(i + 1);
    }
  }
}

// ── 학생 응답 ────────────────────────────────────────────────

/**
 * 학생 응답 제출
 * @param {Object} data - { quizId, studentName, selectedIndex }
 */
function submitResponse(data) {
  initSheets_();
  const sheet = getOrCreateSheet_(SHEET_NAME_RESPONSES);
  const quizSheet = getOrCreateSheet_(SHEET_NAME_QUIZZES);
  const quizData = quizSheet.getDataRange().getValues();
  
  // 퀴즈 찾기
  let quiz = null;
  for (let i = 1; i < quizData.length; i++) {
    if (quizData[i][0] === data.quizId) {
      quiz = {
        correctIndex: quizData[i][4],
        type: quizData[i][5]
      };
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
  
  const responseId = Utilities.getUuid().slice(0, 8);
  sheet.appendRow([
    responseId,
    data.quizId,
    data.studentName,
    data.selectedIndex,
    isCorrect,
    new Date().toISOString()
  ]);
  
  return { 
    success: true, 
    correct: isCorrect === 'O',
    type: quiz.type,
    responseId: responseId
  };
}

// ── 결과 집계 ────────────────────────────────────────────────

/**
 * 특정 퀴즈의 응답 결과 집계
 */
function getQuizResults(quizId) {
  initSheets_();
  const responseSheet = getOrCreateSheet_(SHEET_NAME_RESPONSES);
  const quizSheet = getOrCreateSheet_(SHEET_NAME_QUIZZES);
  
  // 퀴즈 정보
  const quizData = quizSheet.getDataRange().getValues();
  let quiz = null;
  for (let i = 1; i < quizData.length; i++) {
    if (quizData[i][0] === quizId) {
      quiz = {
        quizId: quizData[i][0],
        title: quizData[i][1],
        question: quizData[i][2],
        options: JSON.parse(quizData[i][3]),
        correctIndex: quizData[i][4],
        type: quizData[i][5]
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
  const studentList = [];
  
  responses.forEach(r => {
    const idx = r[3];
    tally[idx] = (tally[idx] || 0) + 1;
    if (r[4] === 'O') correctCount++;
    studentList.push({
      name: r[2],
      selected: r[3],
      correct: r[4],
      time: r[5]
    });
  });
  
  return {
    quiz: quiz,
    totalResponses: responses.length,
    correctCount: correctCount,
    correctRate: responses.length > 0 ? 
      Math.round((correctCount / responses.length) * 100) : 0,
    tally: tally,
    students: studentList
  };
}

/**
 * 전체 대시보드 요약
 */
function getDashboardSummary() {
  initSheets_();
  const quizzes = getAllQuizzes();
  const responseSheet = getOrCreateSheet_(SHEET_NAME_RESPONSES);
  const allResp = responseSheet.getDataRange().getValues();
  
  const totalResponses = Math.max(0, allResp.length - 1);
  const activeCount = quizzes.filter(q => q.active).length;
  
  // 고유 학생 수
  const students = new Set();
  allResp.slice(1).forEach(r => students.add(r[2]));
  
  return {
    totalQuizzes: quizzes.length,
    activeQuizzes: activeCount,
    totalResponses: totalResponses,
    uniqueStudents: students.size
  };
}

// ── 유틸리티 ─────────────────────────────────────────────────

/**
 * 웹앱 URL 가져오기
 */
function getWebAppUrl() {
  return ScriptApp.getService().getUrl();
}

// ── 샘플 데이터 시드 (실행 후 삭제 가능) ─────────────────────
function seedWorldHistoryQuizzes() {
  const quizzes = [
    {
      title: '🏛️ 고대 문명',
      question: '이집트 피라미드를 건설한 주요 목적은 무엇인가요?',
      options: ['왕궁으로 사용', '파라오의 무덤', '군사 요새', '곡물 저장소'],
      correctIndex: 1,
      type: 'quiz'
    },
    {
      title: '⚔️ 중세 유럽',
      question: '1215년 영국에서 제정되어 왕권을 제한한 역사적 문서는?',
      options: ['권리장전', '마그나 카르타', '독립선언서', '인권선언'],
      correctIndex: 1,
      type: 'quiz'
    },
    {
      title: '🗺️ 대항해시대',
      question: '1492년 아메리카 대륙에 도달한 탐험가는 누구인가요?',
      options: ['바스코 다 가마', '페르디난드 마젤란', '크리스토퍼 콜럼버스', '아메리고 베스푸치'],
      correctIndex: 2,
      type: 'quiz'
    },
    {
      title: '🇫🇷 프랑스 혁명',
      question: '프랑스 혁명이 시작된 상징적 사건은 무엇인가요?',
      options: ['워털루 전투', '바스티유 감옥 습격', '베르사유 행진', '테니스 코트의 서약'],
      correctIndex: 1,
      type: 'quiz'
    },
    {
      title: '📊 세계사 의견조사',
      question: '역사에서 가장 영향력 있었던 사건은 무엇이라고 생각하나요?',
      options: ['산업혁명', '프랑스 혁명', '제2차 세계대전', '인터넷의 발명'],
      correctIndex: -1,
      type: 'poll'
    }
  ];

  quizzes.forEach(q => createQuiz(q));
  Logger.log('✅ 세계사 퀴즈 5개 생성 완료!');
}
