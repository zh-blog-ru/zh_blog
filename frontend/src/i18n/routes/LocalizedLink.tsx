'use client'
import { useAppSelector } from "@/_redux/store";
import Link from "next/link";
import React, { ComponentProps } from 'react'

type LocalizedLinkProps = {
  href: string;
} & ComponentProps<typeof Link>

function LocalizedLink({ href, children, ...props }: LocalizedLinkProps) {

  const isAbsolute = href.startsWith('http://') || href.startsWith('https://');
  if (isAbsolute) {
    return <Link href={href} {...props}>{children}</Link>;
  }
  const locale = useAppSelector(state => state.locale.locale)
  let localizedHref = ''

  if (href.startsWith("/")) {
    localizedHref = `/${locale}${href}`
  } else {
    return <Link href={href} {...props}>{children}</Link>
  }

  if (href.startsWith('#')) {
    localizedHref = href; // Возвращаем исходный href для якорей
  }

  return (
    <Link href={localizedHref} {...props}>{children}</Link>
  );
}

export default LocalizedLink;
