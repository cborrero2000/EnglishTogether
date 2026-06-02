/**
 * The phrase bank — the heart of the multi-sensory lessons, Recall, and
 * Daily Review (exposure maintenance).
 *
 * Each phrase carries:
 *   english  – the sentence the learner hears / says / reads / builds
 *   meaning  – a plain, simple explanation or the situation it's used in
 *   topic    – a grouping label
 *
 * Recognition choices (pick-the-meaning) and word tiles (build-the-sentence)
 * are generated automatically from this list, so adding a phrase here is all
 * you need to do.
 */
export type Phrase = {
  id: string;
  english: string;
  meaning: string;
  topic: string;
};

export const phrases: Phrase[] = [
  // Greetings & politeness
  { id: "p1", english: "Nice to meet you.", meaning: "A friendly thing to say when you meet someone for the first time.", topic: "Greetings" },
  { id: "p2", english: "How are you today?", meaning: "Asking someone how they feel right now.", topic: "Greetings" },
  { id: "p3", english: "Have a great day!", meaning: "A kind goodbye wish.", topic: "Greetings" },
  { id: "p4", english: "Thank you very much.", meaning: "Saying you are grateful.", topic: "Politeness" },
  { id: "p5", english: "Excuse me, can you help me?", meaning: "Politely asking someone for help.", topic: "Politeness" },

  // Out and about
  { id: "p6", english: "Where is the train station?", meaning: "Asking for the location of the train station.", topic: "Directions" },
  { id: "p7", english: "How much does this cost?", meaning: "Asking the price of something.", topic: "Shopping" },
  { id: "p8", english: "I would like to pay with my card.", meaning: "Telling the cashier you will use a bank card.", topic: "Shopping" },
  { id: "p9", english: "Can I have a glass of water?", meaning: "Politely asking for some water to drink.", topic: "Restaurant" },
  { id: "p10", english: "The bill, please.", meaning: "Asking the waiter for what you owe.", topic: "Restaurant" },

  // Daily life
  { id: "p11", english: "What time is it now?", meaning: "Asking for the current time.", topic: "Everyday" },
  { id: "p12", english: "I don't understand. Can you repeat that?", meaning: "Asking someone to say something again.", topic: "Everyday" },
  { id: "p13", english: "My appointment is at four thirty.", meaning: "Telling someone the time of your meeting.", topic: "Everyday" },
  { id: "p14", english: "I am not feeling well today.", meaning: "Telling someone you are a little sick.", topic: "Health" },
  { id: "p15", english: "Could you speak more slowly, please?", meaning: "Asking someone to talk at a slower speed.", topic: "Everyday" },
  { id: "p16", english: "See you tomorrow.", meaning: "A goodbye when you will meet again the next day.", topic: "Greetings" },
];

/** A small pool of extra words used as distractors when building sentences. */
export const distractorWords = [
  "please", "today", "morning", "now", "here", "there", "very", "good",
  "the", "a", "my", "your", "is", "are", "can", "you", "I", "to", "and",
  "with", "for", "have", "this", "that", "want", "time", "day", "help",
];

export function phraseById(id: string): Phrase | undefined {
  return phrases.find((p) => p.id === id);
}
