/**
 * All learning content lives here so it is easy to edit and add to.
 * Everything is everyday, beginner-friendly English for adult learners.
 */

/* 1) LISTEN & CHOOSE -------------------------------------------------
   The app SPEAKS `say`. The learner picks which sentence they heard.
   `options` must include the exact `say` sentence. */
export type ListenItem = { say: string; options: string[] };

export const listening: ListenItem[] = [
  {
    say: "Good morning. How are you today?",
    options: [
      "Good morning. How are you today?",
      "Good evening. Where are you going?",
      "Good morning. What time is it now?",
    ],
  },
  {
    say: "Can I have a cup of coffee, please?",
    options: [
      "Can I have a cup of coffee, please?",
      "Can I have a glass of water, please?",
      "Could you give me the coffee menu?",
    ],
  },
  {
    say: "The store closes at nine o'clock.",
    options: [
      "The store opens at nine o'clock.",
      "The store closes at nine o'clock.",
      "The store closes at five o'clock.",
    ],
  },
  {
    say: "I would like to pay with my card.",
    options: [
      "I would like to pay with my card.",
      "I would like to pay with cash.",
      "I forgot my card at home.",
    ],
  },
  {
    say: "Excuse me, where is the train station?",
    options: [
      "Excuse me, where is the bus station?",
      "Excuse me, when does the train leave?",
      "Excuse me, where is the train station?",
    ],
  },
  {
    say: "My appointment is at four thirty.",
    options: [
      "My appointment is at four thirty.",
      "My appointment is at four fifteen.",
      "My appointment is in the morning.",
    ],
  },
];

/* 2) SAY IT ----------------------------------------------------------
   The learner reads the sentence and says it. Speech-to-text checks it. */
export type SpeakItem = { text: string; hint?: string };

export const speaking: SpeakItem[] = [
  { text: "Hello, nice to meet you." },
  { text: "Can you help me, please?" },
  { text: "I would like a glass of water." },
  { text: "How much does this cost?" },
  { text: "Where is the bathroom?" },
  { text: "Thank you very much for your help." },
  { text: "I don't understand. Can you say it again?" },
  { text: "What time does the bus arrive?" },
];

/* 3) DIALOG & QUESTION ----------------------------------------------
   A short conversation is read aloud, then a comprehension question. */
export type DialogItem = {
  title: string;
  lines: { speaker: string; text: string }[];
  question: string;
  options: string[];
  answer: number; // index into options
};

export const dialogs: DialogItem[] = [
  {
    title: "At the coffee shop",
    lines: [
      { speaker: "Server", text: "Hi! What can I get for you?" },
      { speaker: "Maria", text: "I'd like a small coffee, please." },
      { speaker: "Server", text: "Sure. Anything to eat?" },
      { speaker: "Maria", text: "No, thank you. Just the coffee." },
    ],
    question: "What did Maria order?",
    options: ["A small coffee", "A coffee and a sandwich", "A glass of water"],
    answer: 0,
  },
  {
    title: "Asking for directions",
    lines: [
      { speaker: "Tom", text: "Excuse me, how do I get to the library?" },
      { speaker: "Woman", text: "Go straight, then turn left at the bank." },
      { speaker: "Tom", text: "Is it far?" },
      { speaker: "Woman", text: "No, about five minutes on foot." },
    ],
    question: "How long does it take to get to the library?",
    options: ["About fifteen minutes", "About five minutes", "About an hour"],
    answer: 1,
  },
  {
    title: "At the doctor's office",
    lines: [
      { speaker: "Doctor", text: "Good afternoon. How are you feeling?" },
      { speaker: "Ana", text: "Not very well. I have a headache." },
      { speaker: "Doctor", text: "How long have you had it?" },
      { speaker: "Ana", text: "Since yesterday morning." },
    ],
    question: "When did Ana's headache start?",
    options: ["This morning", "Yesterday morning", "Last week"],
    answer: 1,
  },
  {
    title: "Making plans",
    lines: [
      { speaker: "Lily", text: "Do you want to see a movie on Saturday?" },
      { speaker: "Sam", text: "I'd love to, but I'm busy on Saturday." },
      { speaker: "Lily", text: "How about Sunday afternoon?" },
      { speaker: "Sam", text: "Sunday works great. See you then!" },
    ],
    question: "When will they see the movie?",
    options: ["Saturday", "Sunday afternoon", "Sunday morning"],
    answer: 1,
  },
];

/* 4) TALK BACK -------------------------------------------------------
   An interactive conversation. The app speaks `prompt`, then waits for
   the learner to answer out loud. If their answer matches one of
   `accept`, it moves on. If not, it says "Excuse me, what did you say?" */
export type TalkStep = {
  prompt: string; // what the app says
  expect: string; // an example good answer (shown as a hint)
  accept: string[]; // key phrases that count as correct (any one is enough)
};
export type TalkConversation = { title: string; steps: TalkStep[] };

export const conversations: TalkConversation[] = [
  {
    title: "Greeting a neighbor",
    steps: [
      {
        prompt: "Good morning! How are you?",
        expect: "I'm fine, thank you. And you?",
        accept: ["i'm fine", "im fine", "i am fine", "good thank you", "i'm good", "im good"],
      },
      {
        prompt: "I'm doing well. Nice weather today, isn't it?",
        expect: "Yes, it's a beautiful day.",
        accept: ["yes", "beautiful", "it is", "lovely", "nice"],
      },
      {
        prompt: "Have a great day!",
        expect: "You too! Goodbye.",
        accept: ["you too", "thank you", "goodbye", "bye", "same to you"],
      },
    ],
  },
  {
    title: "Ordering at a restaurant",
    steps: [
      {
        prompt: "Welcome! Are you ready to order?",
        expect: "Yes, I'd like the chicken soup, please.",
        accept: ["yes", "i'd like", "id like", "i would like", "i want", "please"],
      },
      {
        prompt: "Would you like anything to drink?",
        expect: "A glass of water, please.",
        accept: ["water", "juice", "soda", "tea", "coffee", "no thank you", "nothing"],
      },
      {
        prompt: "Great. Your food will be ready soon.",
        expect: "Thank you very much.",
        accept: ["thank you", "thanks", "okay", "ok", "great"],
      },
    ],
  },
];

/* 5) WATCH & DECIDE --------------------------------------------------
   A short scene "plays" (a real video if a URL is given, otherwise the
   app acts out the scene with voices + subtitles). Then the learner
   chooses the best response to the situation.
   Replace `video` with your own .mp4 URL any time. */
export type SceneItem = {
  title: string;
  situation: string;
  video?: string; // optional real video URL
  lines: { speaker: string; text: string }[]; // acted out with voices + subtitles
  question: string;
  options: string[];
  answer: number;
};

export const scenes: SceneItem[] = [
  {
    title: "A coworker greets you",
    situation: "You arrive at work. A coworker walks up to you and speaks.",
    lines: [{ speaker: "Coworker", text: "Hey! Good to see you. How was your weekend?" }],
    question: "What is the best thing to say back?",
    options: [
      "It was great, thanks. How about yours?",
      "The store is closed today.",
      "I don't have a car.",
    ],
    answer: 0,
  },
  {
    title: "At the checkout",
    situation: "You are buying groceries. The cashier finishes scanning your items.",
    lines: [{ speaker: "Cashier", text: "That'll be twelve dollars. How would you like to pay?" }],
    question: "What is a good response?",
    options: [
      "I'll pay with my card, please.",
      "The weather is nice today.",
      "My name is on the list.",
    ],
    answer: 0,
  },
  {
    title: "Someone asks for help",
    situation: "A person on the street stops you and asks a question.",
    lines: [{ speaker: "Stranger", text: "Excuse me, do you know what time it is?" }],
    question: "What is the best reply?",
    options: [
      "It's half past three.",
      "I live near the park.",
      "Yes, I like coffee.",
    ],
    answer: 0,
  },
];
