import React from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { LangResources } from "./resources";
import { languageDetector } from "./detector";

i18n
    .use(initReactI18next)
    .use(languageDetector)
    .init({
        compatibilityJSON: 'v3',
        resources: LangResources,
        fallbackLng: "en",

        interpolation: {
            escapeValue: false
        },
        react: {
            useSuspense: false,
        },
    });

export default i18n;