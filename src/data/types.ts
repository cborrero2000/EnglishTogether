export type ListenItem     = { say: string; options: string[] };
export type SpeakItem      = { text: string; hint?: string };
export type DialogItem     = { title: string; lines: { speaker: string; text: string }[]; question: string; options: string[]; answer: number };
export type TalkStep       = { prompt: string; expect: string; accept: string[] };
export type TalkConversation = { title: string; steps: TalkStep[] };
export type SceneItem      = { title: string; situation: string; video?: string; lines: { speaker: string; text: string }[]; question: string; options: string[]; answer: number };
