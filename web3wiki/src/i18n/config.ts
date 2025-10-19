import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en_us from "./en_us.json";
import zh_cn from "./zh_cn.json";

const resources = {
  en: {
    translation: en_us,
  },
  zh: {
    translation: zh_cn,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("language") || "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
