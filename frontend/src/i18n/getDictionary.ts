import 'server-only'
import { LocaleType } from './locales'

export type DictionaryType = Awaited<ReturnType<typeof dictionaries[keyof typeof dictionaries]>>

const dictionaries = {
  en: () => import('../../InternalisationText/en.json').then((module) => module.default),
  ru: () => import('../../InternalisationText/ru.json').then((module) => module.default),
}

export const getDictionary = async (locale: LocaleType): Promise<DictionaryType> =>
  dictionaries[locale]()

