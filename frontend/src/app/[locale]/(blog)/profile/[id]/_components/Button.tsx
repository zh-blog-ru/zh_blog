'use client'
import React, { useEffect, useState, useRef } from 'react'
import s from './Button.module.css'

interface ButtonProps {
  position: 'left' | 'right';
  containerId: string; // Передаём ID контейнера как пропс
}

export default function Button({ position, containerId }: ButtonProps) {
  const [showButton, setShowButton] = useState(false); // Состояние для отображения кнопки

  useEffect(() => {
    const checkScrollWidth = () => {
      const container = document.getElementById(containerId) as HTMLDivElement;
      if (!container) {
        setShowButton(false); // Не отображаем, если контейнер не найден
        return;
      }

      const clientWidth = container.clientWidth;
      const scrollWidth = container.scrollWidth;

      setShowButton(scrollWidth > clientWidth); // Отображаем, если scrollWidth больше clientWidth
    };

    // Вызываем сразу при монтировании
    checkScrollWidth();

    // Добавляем слушателя изменения размера окна, чтобы реагировать на ресайз
    window.addEventListener('resize', checkScrollWidth);

    // Убираем слушателя при размонтировании компонента
    return () => {
      window.removeEventListener('resize', checkScrollWidth);
    };
  }, [containerId]); // Зависимость от containerId важна

  const handleClick = () => {
    const container = document.getElementById(containerId) as HTMLDivElement;
    if (!container) return;

    const scrollAmount = 100;

    if (position === 'left') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
  };


  if (!showButton) {
    return null;
  }

  return (
    <button
      className={position === 'left' ? s.buttonLeft : s.buttonRight}
      onClick={handleClick}
    >
      {position === 'left' ? '<' : '>'}
    </button>
  );
}