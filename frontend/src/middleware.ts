import { NextRequest, NextResponse } from 'next/server'
import { LocaleMiddleware } from './i18n/LocaleMiddleware'

export function middleware(request: NextRequest) {
  //////////////////////////////////////////////////////
  const newRequest = LocaleMiddleware(request)
  if (newRequest instanceof NextResponse) {
    return newRequest
  }
  //////////////////////////////////////////////////////

  const requestHeaders = request.headers

  requestHeaders.set(
    'Cross-Origin-Opener-Policy',
    'same-origin'
  )
  const cspHeader = `
    default-src 'none'; 
    style-src 'self' 'unsafe-inline';
    script-src 'self' 'unsafe-inline' https://smartcaptcha.yandexcloud.net https://challenges.cloudflare.com;
    img-src 'self' data:;
    font-src 'self';
    base-uri 'self';
    upgrade-insecure-requests;
    child-src 'none';
    worker-src 'none';
    connect-src https://zhblog.ru wss://zhblog.ru ;
    frame-ancestors 'none';
    frame-src https://smartcaptcha.yandexcloud.net https://challenges.cloudflare.com;
    manifest-src 'none';
    media-src 'none';
    object-src 'none';
    script-src-attr 'none'; 
    ` 
    //    trusted-types nextjs#bundler #zh_bundler;
    // require-trusted-types-for 'script';


  requestHeaders.set(
    'Content-Security-Policy',
    cspHeader.replace(/\s{2,}/g, ' ').trim()
  )

  requestHeaders.set(
    'Cross-Origin-Embedder-Policy',
    'require-corp'
    // 'credentialless'
  )
  requestHeaders.set(
    'Cross-Origin-Resource-Policy',
    'same-origin'
  )
  requestHeaders.set(
    'X-Frame-Options',
    'DENY'
  )
  requestHeaders.set(
    'X-Content-Type-Options',
    'nosniff'
  )
  requestHeaders.set(
    'Strict-Transport-Security',
    "max-age=63072000; includeSubDomains; preload"
  )
  requestHeaders.set(
    'Referrer-Policy',
    "no-referrer"
  )
  return NextResponse.next({
    headers: requestHeaders,
    request: {
      headers: requestHeaders,
    },
  })
}
export const config = {
  matcher: ['/',
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.+[.](?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}