import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useAppSelector } from '@/_redux/store';
import { defaultLocale } from '../locales';
var sanitizeUrl = require("@braintree/sanitize-url").sanitizeUrl;

interface LocalizedRouter {
  push: (href: string, options?: { scroll?: boolean; shallow?: boolean }) => void;
  replace: (href: string, options?: { scroll?: boolean; shallow?: boolean }) => void;
  prefetch: (href: string) => void;
  back: () => void;
  forward: () => void;
  refresh: () => void;
  currentLocale: string | undefined;
  changeLocale: (newLocale: string, options?: { scroll?: boolean; shallow?: boolean }) => void;
}

export const useLocalizedRouter = (): LocalizedRouter => {
  const router = useRouter();
  const cookiesLocale = useAppSelector(state => state.locale.locale);
  const locale = cookiesLocale || process.env.NEXT_PUBLIC_DEFAULT_LOCALE || defaultLocale;

  const localizedPush = useCallback(
    (href: string, options?: { scroll?: boolean; shallow?: boolean }) => {
      const hrefWithLocale = href.startsWith(`/${locale}/`) || href === `/${locale}` 
        ? href 
        : `/${locale}${href.startsWith('/') ? href : `/${href}`}`;
      router.push(sanitizeUrl(hrefWithLocale), options);
    },
    [router, locale]
  );

  const localizedReplace = useCallback(
    (href: string, options?: { scroll?: boolean; shallow?: boolean }) => {
      const hrefWithLocale = href.startsWith(`/${locale}/`) || href === `/${locale}`
        ? href 
        : `/${locale}${href.startsWith('/') ? href : `/${href}`}`;
      router.replace(sanitizeUrl(hrefWithLocale), options);
    },
    [router, locale]
  );

  const localizedPrefetch = useCallback(
    (href: string) => {
      const hrefWithLocale = href.startsWith(`/${locale}/`) || href === `/${locale}`
        ? href 
        : `/${locale}${href.startsWith('/') ? href : `/${href}`}`;
      return router.prefetch(sanitizeUrl(hrefWithLocale));
    },
    [router, locale]
  );

  const changeLocale = useCallback(
    (newLocale: string, options?: { scroll?: boolean; shallow?: boolean }) => {
      // Получаем текущий путь (без локали)
      let currentPath = window.location.pathname;
      
      // Удаляем текущую локаль из пути, если она есть
      if (locale && currentPath.startsWith(`/${locale}`)) {
        currentPath = currentPath.slice(locale.length + 1) || '/';
      }
      
      // Создаем новый путь с новой локалью
      const newPath = `/${newLocale}${currentPath.startsWith('/') ? currentPath : `/${currentPath}`}`;
      
      // Переходим по новому пути
      router.push(sanitizeUrl(newPath), options);
    },
    [router, locale]
  );

  return {
    push: localizedPush,
    replace: localizedReplace,
    prefetch: localizedPrefetch,
    back: router.back,
    forward: router.forward,
    refresh: router.refresh,
    currentLocale: locale,
    changeLocale,
  };
};

export default useLocalizedRouter;