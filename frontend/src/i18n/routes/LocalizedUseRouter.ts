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

const getLocalizedHref = (href: string, locale: string) => {
  const normalizedHref = href.startsWith('/') ? href : `/${href}`;
  return href.startsWith(`/${locale}/`) || href === `/${locale}` 
    ? href 
    : `/${locale}${normalizedHref}`;
}; 

export const useLocalizedRouter = (): LocalizedRouter => {
  const router = useRouter();
  const cookiesLocale = useAppSelector(state => state.locale.locale);
  const locale = cookiesLocale || process.env.NEXT_PUBLIC_DEFAULT_LOCALE || defaultLocale;

  const createLocalizedHandler = (method: 'push' | 'replace' | 'prefetch') => 
    useCallback((href: string, options?: any) => {
      const hrefWithLocale = getLocalizedHref(href, locale);
      return router[method](sanitizeUrl(hrefWithLocale), options);
    }, [router, locale]);

  const changeLocale = useCallback((newLocale: string, options?: any) => {
    let currentPath = window.location.pathname;
    if (locale && currentPath.startsWith(`/${locale}`)) {
      currentPath = currentPath.slice(locale.length + 1) || '/';
    }
    const newPath = `/${newLocale}${currentPath.startsWith('/') ? currentPath : `/${currentPath}`}`;
    router.push(sanitizeUrl(newPath), options);
  }, [router, locale]);

  return {
    push: createLocalizedHandler('push'),
    replace: createLocalizedHandler('replace'),
    prefetch: createLocalizedHandler('prefetch'),
    back: router.back,
    forward: router.forward,
    refresh: router.refresh,
    currentLocale: locale,
    changeLocale,
  };
};

export default useLocalizedRouter;