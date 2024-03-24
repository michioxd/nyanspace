import type { Resource } from "i18next";
import LangEnglish from "./locales/en";
import LangVietnamese from "./locales/vi";

const LangResources: Resource = {
    en: LangEnglish,
    vi: LangVietnamese
}

const SupportedLanguage = {
    "en": {
        label: "English",
        en: "English",
        author: "michioxd",
        github: "michioxd"
    },
    "vi": {
        label: "Tiếng Việt",
        en: "Vietnamese",
        author: "michioxd",
        github: "michioxd"
    }
}

export { LangResources, SupportedLanguage }