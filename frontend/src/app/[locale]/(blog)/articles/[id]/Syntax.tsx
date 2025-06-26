'use client'
import React, { useEffect } from 'react'
import './Syntax.css'
import { useTheme } from 'next-themes'

export default function Syntax({
  children,
}: {
  children: React.ReactNode,
}) {
  const { theme, systemTheme } = useTheme()
  const currentTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    console.log('RENDER: ', currentTheme)
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      
      if (currentTheme === 'dark') {
        // Темная тема
        root.style.setProperty('--hljs-color', '#c9d1d9');
        root.style.setProperty('--hljs-keyword', '#ff7b72');
        root.style.setProperty('--hljs-entity', '#d2a8ff');
        root.style.setProperty('--hljs-constant', '#79c0ff');
        root.style.setProperty('--hljs-string', '#a5d6ff');
        root.style.setProperty('--hljs-variable', '#ffa657');
        root.style.setProperty('--hljs-comment', '#8b949e');
        root.style.setProperty('--hljs-entity-tag', '#7ee787');
        root.style.setProperty('--hljs-subst', '#c9d1d9');
        root.style.setProperty('--hljs-heading', '#1f6feb');
        root.style.setProperty('--hljs-list', '#f2cc60');
        root.style.setProperty('--hljs-emphasis-color', '#c9d1d9');
        root.style.setProperty('--hljs-strong-color', '#c9d1d9');
        root.style.setProperty('--hljs-addition-color', '#aff5b4');
        root.style.setProperty('--hljs-addition-bg', '#033a16');
        root.style.setProperty('--hljs-deletion-color', '#ffdcd7');
        root.style.setProperty('--hljs-deletion-bg', '#67060c');
      } else {
        // Светлая тема
        root.style.setProperty('--hljs-color', '#24292e');
        root.style.setProperty('--hljs-keyword', '#d73a49');
        root.style.setProperty('--hljs-entity', '#6f42c1');
        root.style.setProperty('--hljs-constant', '#005cc5');
        root.style.setProperty('--hljs-string', '#0076ff');
        root.style.setProperty('--hljs-variable', '#e36209');
        root.style.setProperty('--hljs-comment', '#6a737d');
        root.style.setProperty('--hljs-entity-tag', '#22863a');
        root.style.setProperty('--hljs-subst', '#24292e');
        root.style.setProperty('--hljs-heading', '#005cc5');
        root.style.setProperty('--hljs-list', '#735c0f');
        root.style.setProperty('--hljs-emphasis-color', '#24292e');
        root.style.setProperty('--hljs-strong-color', '#24292e');
        root.style.setProperty('--hljs-addition-color', '#22863a');
        root.style.setProperty('--hljs-addition-bg', '#f0fff4');
        root.style.setProperty('--hljs-deletion-color', '#b31d28');
        root.style.setProperty('--hljs-deletion-bg', '#ffeef0');
      }
    }
  }, [currentTheme])

  return (
    <div>
      {children}
    </div>
  )
}