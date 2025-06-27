import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import { match } from '@formatjs/intl-localematcher';
import { defaultLocale, locales, LocaleType } from './locales';

const LOCALE_COOKIE_NAME = 'locale';

function getPreferredLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // Получаем и фильтруем языки
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
    .map(lang => lang.split('-')[0]) // Берем только базовый язык (en из en-US)
    .filter(lang => {
      try {
        return Intl.getCanonicalLocales(lang).length > 0;
      } catch {
        return false;
      }
    });

  // Если нет корректных языков - возвращаем дефолтную локаль
  if (languages.length === 0) {
    return defaultLocale;
  }

  // Проверяем, что locales валидны
  try {
    Intl.getCanonicalLocales([...locales]);
  } catch (e) {
    console.error('Invalid locales configuration:', locales);
    return defaultLocale;
  }

  try {
    return match(languages, [...locales], defaultLocale);
  } catch (error) {
    console.error('Locale matching error:', error);
    return defaultLocale;
  }
}

export function LocaleMiddleware(request: NextRequest): NextResponse | NextRequest {
  const { pathname } = request.nextUrl;

  // Проверяем наличие локали в пути
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  const localeCookie = request.cookies.get(LOCALE_COOKIE_NAME)?.value as LocaleType;

  if (localeCookie && locales.includes(localeCookie)) {
    if (!pathnameHasLocale) {
      return NextResponse.redirect(new URL(`/${localeCookie}${pathname}`, request.url), 301);
    } else {
      const currentPathLocale = pathname.split('/')[1] as LocaleType;
      if (localeCookie !== currentPathLocale) {
        const newPath = `/${localeCookie}${pathname.slice(currentPathLocale.length + 1)}`;
        return NextResponse.redirect(new URL(newPath, request.url), 301);
      }
      return request;
    }
  } else {
    if (!pathnameHasLocale) {
      const preferredLocale = getPreferredLocale(request);
      const response = NextResponse.redirect(new URL(`/${preferredLocale}${pathname}`, request.url), 301);
      response.cookies.set(LOCALE_COOKIE_NAME, preferredLocale, {
        sameSite: 'lax',
        secure: true,
        httpOnly: true
      });
      return response;
    } else {
      const currentPathLocale = pathname.split('/')[1] as LocaleType;
      if (locales.includes(currentPathLocale)) {
        const response = NextResponse.next();
        response.cookies.set(LOCALE_COOKIE_NAME, currentPathLocale, {
          sameSite: 'lax',
          secure: true,
          httpOnly: true
        });
        return response;
      } else {
        const response = NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url), 301);
        response.cookies.set(LOCALE_COOKIE_NAME, defaultLocale, {
          sameSite: 'lax',
          secure: true,
          httpOnly: true
        });
        return response;
      }
    }
  }
}