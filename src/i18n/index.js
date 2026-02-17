import de from "./de.js";
import en from "./en.js";
import fr from "./fr.js";

const translations = { de, en, fr };
export const LANGUAGES = Object.keys(translations);
export function getTranslation(lang) { return translations[lang] || translations.de; }
export default translations;
