import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import { match } from '@formatjs/intl-localematcher';
import { defaultLocale, locales, LocaleType } from './locales';

// Название cookie, в которой хранится выбранная пользователем локаль
const LOCALE_COOKIE_NAME = 'locale';

/**
 * Определяет наиболее подходящую локаль для пользователя на основе заголовка Accept-Language в запросе.
 * @param {NextRequest} request - Объект запроса Next.js.
 * @returns {string} - Наиболее подходящая локаль (например, 'en', 'ru').
 */
function getPreferredLocale(request: NextRequest): string {
  // Создаем объект, содержащий заголовки запроса в формате, понятном для Negotiator.
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // Получаем список предпочитаемых языков от пользователя на основе заголовка Accept-Language.
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  // Используем `match` для определения наиболее подходящей локали из списка поддерживаемых локалей.
  // Если ни одна из предпочитаемых локалей не поддерживается, возвращается `defaultLocale`.

  let locale = ''
  try {
    locale = match(languages, locales, defaultLocale)
  } catch (error) {
    locale = defaultLocale
  }
  return locale
}

/**
 * Middleware для обработки локализации.  Перенаправляет запросы на основе локали пользователя.
 * @param {NextRequest} request - Объект запроса Next.js.
 * @returns {NextResponse<unknown> | NextRequest} - Объект ответа Next.js (перенаправление) или оригинальный запрос.
 */
export function LocaleMiddleware(request: NextRequest): NextResponse<unknown> | NextRequest {
  const { pathname } = request.nextUrl;

  // Проверяем, содержится ли локаль в текущем пути (например, '/en/about').
  const pathnameHasLocale = locales.some((locale) =>
    pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Получаем значение куки с локалью пользователя, если она установлена.
  const localeCookie = request.cookies.get(LOCALE_COOKIE_NAME)?.value as LocaleType;


  // Проверяем, существует ли куки с локалью и является ли её значение валидной локалью.
  if (localeCookie && locales.includes(localeCookie)) {

    // Куки с локалью установлена, проверяем, содержится ли локаль также и в пути.
    if (!pathnameHasLocale) {
      // Локаль отсутствует в пути, нужно перенаправить пользователя, добавив префикс локали из куки.
      const newPath = `/${localeCookie}${pathname}`;
      return NextResponse.redirect(new URL(newPath, request.url),301);
    } else {
      // Локаль присутствует и в куки, и в пути.  Проверяем, совпадают ли они.
      const currentPathLocale = pathname.split('/')[1] as LocaleType;

      if (localeCookie !== currentPathLocale) {
        // Локаль в куки не совпадает с локалью в пути.  Нужно перенаправить на путь с локалью из куки.

        // Удаляем текущий префикс локали из пути.
        const newPathWithoutLocale = pathname.slice(currentPathLocale.length + 1); // Учитываем слэш

        // Формируем новый путь с локалью из куки.
        const newPath = `/${localeCookie}${newPathWithoutLocale}`;
        return NextResponse.redirect(new URL(newPath, request.url), 301);
      } else {
        // Локаль в куки и в пути совпадают.  Ничего не нужно менять, возвращаем оригинальный запрос.
        return request
      }
    }
  } else {
    // Куки с локалью отсутствует.
    if (!pathnameHasLocale) {
      // Локаль отсутствует и в пути, и в куки.  Определяем предпочитаемую локаль пользователя на основе заголовка Accept-Language.
      const preferredLocale = getPreferredLocale(request);

      // Формируем новый путь с предпочитаемой локалью.
      const newPath = `/${preferredLocale}${pathname}`;

      // Перенаправляем пользователя на новый путь.
      const response = NextResponse.redirect(new URL(newPath, request.url), 301);

      // Устанавливаем куки с предпочитаемой локалью, чтобы в следующий раз использовать её.
      response.cookies.set(LOCALE_COOKIE_NAME, preferredLocale, { sameSite: 'lax', secure: true, httpOnly: true });
      return response;
    } else {
      // Локаль присутствует в пути, но отсутствует в куки.  Проверяем, является ли локаль в пути валидной.
      const currentPathLocale = pathname.split('/')[1] as LocaleType;

      if (locales.includes(currentPathLocale)) {
        // Локаль в пути является валидной.  Устанавливаем куки с этой локалью.
        const response = NextResponse.next();
        response.cookies.set(LOCALE_COOKIE_NAME, currentPathLocale, { sameSite: 'lax', secure: true, httpOnly: true });
        return response;
      } else {
        // Локаль в пути не является валидной.  Перенаправляем на путь с локалью по умолчанию.
        const newPath = `/${defaultLocale}${pathname}`;
        const response = NextResponse.redirect(new URL(newPath, request.url), 301);
        response.cookies.set(LOCALE_COOKIE_NAME, defaultLocale, { sameSite: 'lax', secure: true, httpOnly: true });
        return response;
      }

    }
  }
}