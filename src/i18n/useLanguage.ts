import { useEffect, useState } from "react";
import { getUiLanguage, setUiLanguage, initPreferences, UiLanguage } from "../progress/preferences";
import { STRINGS, StringKey, translate } from "./strings";

type Listener = () => void;
const listeners = new Set<Listener>();

/** Re-render every screen using this hook when the language changes. */
export function useLanguage(): {
  lang: UiLanguage;
  setLang: (lang: UiLanguage) => void;
  t: (key: StringKey) => string;
} {
  const [lang, setLangState] = useState<UiLanguage>(getUiLanguage());

  useEffect(() => {
    let mounted = true;
    initPreferences().then(() => {
      if (mounted) setLangState(getUiLanguage());
    });
    const listener = () => setLangState(getUiLanguage());
    listeners.add(listener);
    return () => {
      mounted = false;
      listeners.delete(listener);
    };
  }, []);

  function setLang(next: UiLanguage) {
    setUiLanguage(next).then(() => {
      listeners.forEach((l) => l());
    });
  }

  return { lang, setLang, t: (key: StringKey) => translate(key, lang) };
}

export { STRINGS };
