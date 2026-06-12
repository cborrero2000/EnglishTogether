import React, { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { colors } from "./src/theme";
import { ScreenName } from "./src/navigation";
import { HomeScreen }     from "./src/screens/HomeScreen";
import { LearnScreen }    from "./src/screens/LearnScreen";
import { RecallScreen }   from "./src/screens/RecallScreen";
import { ReviewScreen }   from "./src/screens/ReviewScreen";
import { ListeningScreen } from "./src/screens/ListeningScreen";
import { SpeakingScreen } from "./src/screens/SpeakingScreen";
import { DialogScreen }   from "./src/screens/DialogScreen";
import { TalkBackScreen } from "./src/screens/TalkBackScreen";
import { SceneScreen }    from "./src/screens/SceneScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { ProgressScreen } from "./src/screens/ProgressScreen";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { initSpeech, stopSpeaking } from "./src/speech/speech";
import { initPreferences, hasSeenOnboarding, setOnboardingSeen } from "./src/progress/preferences";

export default function App() {
  const [screen, setScreen] = useState<ScreenName>("home");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initSpeech();
    initPreferences().then(() => {
      if (!hasSeenOnboarding()) setScreen("onboarding");
      setReady(true);
    });
  }, []);

  function go(s: ScreenName) { stopSpeaking(); setScreen(s); }
  const back = () => go("home");

  function finishOnboarding() {
    setOnboardingSeen();
    go("home");
  }

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root} edges={["top","left","right","bottom"]}>
        <StatusBar style="dark" />
        {screen === "onboarding" && <OnboardingScreen onDone={finishOnboarding} />}
        {screen === "home"      && <HomeScreen go={go} />}
        {screen === "learn"     && <LearnScreen onBack={back} />}
        {screen === "recall"    && <RecallScreen onBack={back} />}
        {screen === "review"    && <ReviewScreen onBack={back} />}
        {screen === "progress"  && <ProgressScreen onBack={back} />}
        {screen === "listening" && <ListeningScreen onBack={back} />}
        {screen === "speaking"  && <SpeakingScreen onBack={back} />}
        {screen === "dialog"    && <DialogScreen onBack={back} />}
        {screen === "talkback"  && <TalkBackScreen onBack={back} />}
        {screen === "scenes"    && <SceneScreen onBack={back} />}
        {screen === "settings"  && <SettingsScreen onBack={back} go={go} />}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
});
