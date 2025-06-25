import React from 'react'
import styles from './BlogLayoutFotter.module.css'
import { LocaleType } from '@/i18n/locales'
import { Irish_Grover } from 'next/font/google'
import { getDictionary } from '@/i18n/getDictionary'
import LocalizedLink from '@/i18n/routes/LocalizedLink'

const irish_grover = Irish_Grover({
  weight: '400',
  preload: false,
})

export default async function BlogLayoutFotter({ params }: { params: Promise<{ locale: LocaleType }> }) {
  const { locale } = await params
  const dict = (await getDictionary((locale))).blog.blogLayout.fotter
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <h3 className={irish_grover.className}>Zh Blog</h3>
            <p>© {new Date().getFullYear()} Zh Blog. {dict.copyright}.</p>
          </div>

          <div className={styles.links}>
            <LocalizedLink href="/privacy">{dict.privacy_policy}</LocalizedLink>
            <LocalizedLink href="/terms">{dict.terms_of_use}</LocalizedLink>
          </div>
        </div>

        <div className={styles.cookieNotice}>
          <p>{dict.p} <a href="/privacy">{dict.privacy_policy}</a>.</p>
        </div>
      </div>
    </footer>
  )
}
