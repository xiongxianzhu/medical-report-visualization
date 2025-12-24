/**
 * 🌍 国际化配置 / Internationalization Configuration
 * 支持语言: 中文(zh-CN), English(en)
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zhCN from './locales/zh-CN';
import en from './locales/en';

const resources = {
  'zh-CN': { translation: zhCN },
  'en': { translation: en },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'zh-CN',
    fallbackLng: 'zh-CN',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
