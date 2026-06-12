/**
 * UI strings for the app's own menus/navigation (NOT the English lesson
 * content, which stays in English on purpose since that's what's being
 * practiced). Korean translations are provided so a Korean-speaking parent
 * can navigate the app confidently before they're comfortable with English
 * menus.
 */

export type Lang = "en" | "ko";

export const STRINGS = {
  appTitle: { en: "English Together", ko: "English Together (영어 함께)" },
  appSubtitle: {
    en: "Practice listening and speaking, one step at a time.",
    ko: "한 걸음씩 듣기와 말하기를 연습해요.",
  },
  voiceButton: { en: "🔊 Voice", ko: "🔊 음성" },

  statLearned: { en: "learned", ko: "학습 완료" },
  statDueToday: { en: "due today", ko: "오늘 복습" },
  reviewNow: { en: "Review now ›", ko: "지금 복습하기 ›" },

  sectionStudy: { en: "STUDY", ko: "학습" },
  sectionPractice: { en: "PRACTICE", ko: "연습" },

  tileLearnTitle: { en: "Learn", ko: "배우기" },
  tileLearnDesc: {
    en: "Listen → Speak → Read → Build. The full sensory lesson.",
    ko: "듣기 → 말하기 → 읽기 → 만들기. 모든 감각을 사용한 학습.",
  },
  tileRecallTitle: { en: "Recall", ko: "기억하기" },
  tileRecallDesc: {
    en: "Test your memory. Reconstruct phrases from their meaning.",
    ko: "기억력 테스트. 의미를 보고 문장을 다시 만들어요.",
  },
  tileReviewTitle: { en: "Daily Review", ko: "매일 복습" },
  tileReviewDesc: {
    en: "Keep phrases fresh. A short review of what you have learned.",
    ko: "배운 내용을 잊지 않도록 짧게 복습해요.",
  },
  tileProgressTitle: { en: "My Progress", ko: "나의 진도" },
  tileProgressDesc: {
    en: "See how much you've learned and your practice streak.",
    ko: "지금까지의 학습량과 연속 학습일을 확인해요.",
  },

  tileListeningTitle: { en: "Listen & Choose", ko: "듣고 고르기" },
  tileListeningDesc: {
    en: "Hear a sentence, pick the one you heard.",
    ko: "문장을 듣고 들은 것을 고르세요.",
  },
  tileSpeakingTitle: { en: "Say It", ko: "말해보기" },
  tileSpeakingDesc: {
    en: "Read it out loud and check your speaking.",
    ko: "큰 소리로 읽고 발음을 확인해요.",
  },
  tileDialogTitle: { en: "Dialog & Question", ko: "대화와 질문" },
  tileDialogDesc: {
    en: "Hear a short talk, then answer a question.",
    ko: "짧은 대화를 듣고 질문에 답해요.",
  },
  tileTalkbackTitle: { en: "Talk Back", ko: "대화하기" },
  tileTalkbackDesc: {
    en: "Have a real conversation. Answer out loud.",
    ko: "실제처럼 대화해요. 소리내어 답하세요.",
  },
  tileScenesTitle: { en: "Watch & Decide", ko: "보고 선택하기" },
  tileScenesDesc: {
    en: "Watch a scene, choose the best reply.",
    ko: "장면을 보고 가장 좋은 대답을 고르세요.",
  },

  settingsTitle: { en: "Voice", ko: "음성" },
  settingsScreenTitle: { en: "Settings", ko: "설정" },
  settingsVoiceSection: { en: "Voice", ko: "음성" },
  settingsLanguageTitle: { en: "App Language", ko: "앱 언어" },
  settingsLanguageDesc: {
    en: "Choose the language for menus and instructions. Lesson content stays in English.",
    ko: "메뉴와 안내문에 사용할 언어를 선택하세요. 학습 내용은 영어로 유지됩니다.",
  },
  languageEnglish: { en: "English", ko: "English (영어)" },
  languageKorean: { en: "Korean (한국어)", ko: "한국어" },

  settingsLevelTitle: { en: "Difficulty Level", ko: "난이도" },
  settingsLevelDesc: {
    en: "Choose which sentences appear in practice sessions.",
    ko: "연습에 나올 문장의 난이도를 선택하세요.",
  },
  levelAll: { en: "All levels", ko: "전체" },
  levelBeginner: { en: "Beginner", ko: "초급" },
  levelIntermediate: { en: "Intermediate", ko: "중급" },

  settingsTutorialTitle: { en: "Tutorial", ko: "사용법 안내" },
  settingsTutorialButton: { en: "Show app tour again", ko: "앱 사용법 다시 보기" },

  progressTitle: { en: "My Progress", ko: "나의 진도" },
  progressStreak: { en: "day streak", ko: "일 연속 학습" },
  progressLearned: { en: "phrases learned", ko: "학습한 문장" },
  progressAccuracy: { en: "overall accuracy", ko: "전체 정확도" },
  progressDue: { en: "due for review", ko: "복습 대기" },
  progressByTopic: { en: "By topic", ko: "주제별 진도" },
  progressEmpty: {
    en: "Start with Learn to begin tracking your progress.",
    ko: "‘배우기’를 시작하면 진도가 표시됩니다.",
  },
  progressNoStreak: {
    en: "Practice today to start a streak!",
    ko: "오늘 연습을 시작해 연속 기록을 만들어 보세요!",
  },

  back: { en: "Back", ko: "뒤로" },

  onboardingSkip: { en: "Skip", ko: "건너뛰기" },
  onboardingNext: { en: "Next", ko: "다음" },
  onboardingGetStarted: { en: "Get started", ko: "시작하기" },
  onboardingTitle1: { en: "Welcome!", ko: "환영합니다!" },
  onboardingBody1: {
    en: "English Together helps you practice listening and speaking English, a little every day.",
    ko: "English Together는 매일 조금씩 영어 듣기와 말하기를 연습하도록 도와줍니다.",
  },
  onboardingTitle2: { en: "Five ways to practice", ko: "5가지 연습 방법" },
  onboardingBody2: {
    en: "Listen & Choose, Say It, Dialog & Question, Talk Back, and Watch & Decide — try them all from the Home screen.",
    ko: "듣고 고르기, 말해보기, 대화와 질문, 대화하기, 보고 선택하기 — 홈 화면에서 모두 시작할 수 있어요.",
  },
  onboardingTitle3: { en: "Choose your voice", ko: "음성 선택하기" },
  onboardingBody3: {
    en: "Tap 🔊 Voice on the Home screen to pick the most natural-sounding voice on your device.",
    ko: "홈 화면의 🔊 음성 버튼을 눌러 가장 자연스러운 음성을 선택하세요.",
  },
  onboardingTitle4: { en: "We'll remember your progress", ko: "진도가 자동으로 저장됩니다" },
  onboardingBody4: {
    en: "Recall and Daily Review bring back phrases at the right time, so they stick. Check My Progress any time.",
    ko: "‘기억하기’와 ‘매일 복습’이 적절한 때에 문장을 다시 보여줘서 오래 기억하게 도와줍니다. ‘나의 진도’에서 언제든 확인하세요.",
  },
} as const;

export type StringKey = keyof typeof STRINGS;

export function translate(key: StringKey, lang: Lang): string {
  return STRINGS[key][lang] ?? STRINGS[key].en;
}
