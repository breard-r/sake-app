import { allowedLocales } from './const';

const fallBackValue = 'en';

const getShortLanguageCode = (language) => {
	language = language.split('-')[0];
	language = language.split('_')[0];
	return language;
};

export const getDefaultLocale = () => {
	for (const lang of navigator.languages) {
		const lang_short = getShortLanguageCode(lang);
		if (allowedLocales.includes(lang_short)) {
			return lang_short;
		}
	}
	return fallBackValue;
};
