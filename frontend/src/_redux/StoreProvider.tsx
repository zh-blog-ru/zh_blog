'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { AppStore, makeStore } from './store'
import { LocaleType } from '@/i18n/locales'
import { updateLocale } from './Slices/LocaleSlice'

export default function StoreProvider({
  children,
  locale,
}: {
  children: React.ReactNode,
  locale: LocaleType,
}) {
  const storeRef = useRef<AppStore>(undefined)
  if (!storeRef.current) {
    storeRef.current = makeStore()
    storeRef.current.dispatch(updateLocale(locale))
  }

  return <Provider store={storeRef.current} >{children}</Provider>
}