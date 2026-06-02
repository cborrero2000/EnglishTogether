# English Together

A gentle English listening & speaking practice app for adult learners (built for parents).
Runs on **phone, tablet, and computer** — one codebase (Expo / React Native + React Native Web).

## Five practice modes

1. **Listen & Choose** — the app speaks a sentence; learner picks the one they heard (with a "Slower" button).
2. **Say It** — learner reads a sentence aloud; speech-to-text checks it and points out missed words.
3. **Dialog & Question** — a short conversation plays, then a comprehension question with 3 options and right/wrong feedback.
4. **Talk Back** — an interactive conversation: the app speaks, waits for a spoken reply, advances if correct, and says *"Excuse me, what did you say?"* if not.
5. **Watch & Decide** — an acted-out scene (speaking character + voices + subtitles); learner chooses the best response to the situation.

## Running it

```bash
cd EnglishTogether
npm install      # first time only
npm run web      # open in a computer browser (Chrome/Edge)
npm start        # then scan the QR code with Expo Go on a phone/tablet
```

## Speech notes

- **Text-to-speech** (the app talking) automatically picks the **most natural voice** the device offers, and gives the two people in a dialog different voices. Choose a voice any time with the **🔊 Voice** button on the home screen (the choice is remembered).
  - For the most lifelike free voices on a **computer, use Microsoft Edge** — it exposes neural "Natural" voices (Aria, Guy, Jenny). Chrome on Windows only has the older robotic voices.
  - **iPhone / iPad / Mac** (Safari) and **Android** already have natural voices built in.
- **Speech-to-text** (checking the learner's voice) uses the browser's built-in Web Speech API and works great on a **computer (Chrome/Edge)**. On phones/tablets in Expo Go it isn't available, so those screens fall back to a typed answer / listen-and-repeat. To enable native voice recognition, build a dev client and add `@react-native-voice/voice`.

## Editing the content

All sentences, dialogs, conversations, and scenes live in **`src/data/content.ts`** — plain, well-commented arrays. Add or change items there; no other code needs to change. You can also drop a real `.mp4` URL into a scene's `video` field for future native-video support.
