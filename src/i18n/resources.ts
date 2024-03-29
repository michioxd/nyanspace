import type { Resource } from "i18next";
import LangEnglish from "./locales/en";
import LangVietnamese from "./locales/vi";

const LangResources: Resource = {
    en: LangEnglish,
    vi: LangVietnamese
}

const SupportedLanguage: {
    [languageCode: string]: {
        label: string,
        en: string,
        author: string,
        github: string
    }
} = {
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

const allLanguageList: {
    [languageCode: string]: string
} = {
    "ar": "العربية",
    "zh": "中文",
    "en": "English",
    "fr": "Français",
    "de": "Deutsch",
    "hi": "हिन्दी",
    "it": "Italiano",
    "ja": "日本語",
    "ko": "한국어",
    "pt": "Português",
    "ru": "Русский",
    "es": "Español",
    "sv": "Svenska",
    "tr": "Türkçe",
    "bn": "বাংলা",
    "pl": "Polski",
    "id": "Bahasa Indonesia",
    "nl": "Nederlands",
    "th": "ไทย",
    "vi": "Tiếng Việt",
    "el": "Ελληνικά",
    "cs": "Čeština",
    "da": "Dansk",
    "fi": "Suomi",
    "hu": "Magyar",
    "no": "Norsk",
    "ro": "Română",
    "sk": "Slovenčina",
    "uk": "Українська",
    "bg": "Български",
    "sr": "Српски",
    "hr": "Hrvatski",
    "lt": "Lietuvių",
    "lv": "Latviešu",
    "et": "Eesti",
    "sl": "Slovenščina",
    "mt": "Malti",
    "ga": "Gaeilge",
    "cy": "Cymraeg",
    "is": "Íslenska",
    "mk": "Македонски",
    "sq": "Shqip",
    "bs": "Bosanski",
    "ka": "ქართული",
    "az": "Azərbaycan dili",
    "eu": "Euskara",
    "be": "Беларуская",
    "hy": "Հայերեն",
    "kk": "Қазақ тілі",
    "uz": "O‘zbek",
    "tk": "Türkmen",
    "mn": "Монгол",
    "fa": "فارسی",
    "he": "עברית",
    "ur": "اردو",
    "am": "አማርኛ",
    "ne": "नेपाली",
    "si": "සිංහල",
    "ta": "தமிழ்",
    "te": "తెలుగు",
    "kn": "ಕನ್ನಡ",
    "ml": "മലയാളം",
    "my": "ဗမာ",
    "km": "ខ្មែរ",
    "lo": "ລາວ",
    "bo": "བོད་སྐད",
    "dz": "རྫོང་ཁ",
    "ti": "ትግርኛ",
    "so": "Soomaali",
    "sw": "Kiswahili",
    "yo": "Yorùbá",
    "ig": "Igbo",
    "ha": "Hausa",
    "ff": "Fulfulde",
    "rw": "Kinyarwanda",
    "ny": "Chichewa",
    "mg": "Malagasy",
    "ln": "Lingala",
    "wo": "Wolof",
    "fj": "Vosa Vakaviti",
    "sm": "Gagana fa'a Samoa",
    "to": "Lea fakatonga",
    "ty": "Reo Tahiti",
};

export { LangResources, SupportedLanguage, allLanguageList }