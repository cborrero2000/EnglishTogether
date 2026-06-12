import React from "react";
import { StyleSheet } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { md } from "../theme";

/**
 * Plays a scene's real video clip (when `scene.video` is set) instead of
 * the animated avatar. Looping is off — `playing` controls play/pause so
 * it stays in sync with the TTS-driven "play scene" button.
 */
export function SceneVideo({ uri, playing }: { uri: string; playing: boolean }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
  });

  React.useEffect(() => {
    if (playing) {
      player.currentTime = 0;
      player.play();
    } else {
      player.pause();
    }
  }, [playing, player]);

  return (
    <VideoView
      style={styles.video}
      player={player}
      contentFit="cover"
      nativeControls={false}
      accessibilityLabel="Scene video"
    />
  );
}

const styles = StyleSheet.create({
  video: {
    width: "100%",
    height: 220,
    borderRadius: md.shape.large,
    backgroundColor: "#000",
  },
});
