import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata, Viewport } from "next";
import { locales, LocaleType } from "@/i18n/locales";
import { notFound } from "next/navigation";
import StoreProvider from "@/_redux/StoreProvider";
import { ThemeProvider } from 'next-themes'
import './styleSyntaxLight.css'
import './styleSyntaxDark.css'
import Script from "next/script";
import { getDictionary } from "@/i18n/getDictionary";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

const inter = Inter({
  weight: 'variable',
  subsets: ['latin', 'cyrillic']
  // preload: false,
})

type Props = {
  params: Promise<{ locale: LocaleType }>
}
export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  // read route params
  const { locale } = await params

  // fetch data
  const meta = (await getDictionary(locale)).blog.blogLayout.meta

  let languages: {[key: string]: string} = {}
  locales.forEach((locale)=> languages[locale] = `/${locale}`)

  return {
    applicationName: meta.applicationName,
    keywords: meta.keywords,
    metadataBase: new URL('https://zhblog.ru'),
    alternates: {
      canonical: '/ru',
      languages
    }
  }
}
// export const dynamicParams = false
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: LocaleType }>;
}) {

  const { locale } = await params;
  if (!locales.includes(locale)) {
    notFound();
  }
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <Script id="init-csrf" strategy="beforeInteractive">
          {`
            fetch('https://zhblog.ru/api/v1/csrf/get_token', {
              method: 'GET',
              credentials: 'include'
            })
              .then(res => {
                if (!res.ok) throw new Error('CSRF token fetch failed');
                return res.json();
              })
              .catch(err => console.error('CSRF init error:', err));
          `}
        </Script>
        <ThemeProvider>
          <StoreProvider locale={locale}>
            {children}
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
