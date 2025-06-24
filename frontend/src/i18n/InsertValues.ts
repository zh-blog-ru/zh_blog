export function insertValues(text: string, data: any[], placeholder: string = '$'): string {
  try {
    const parts: string[] = text.split(placeholder);
    let result: string = "";

    if (parts.length - 1 > data.length) {
      return text;
    }
    for (let i = 0; i < parts.length; i++) {
      result += parts[i];
      if (i < data.length) {
        result += String(data[i]);
      }
    }

    return result;
  } catch (error) {
    console.error("Ошибка при вставке значений:", error);
    return text; // Возвращаем исходный текст при ошибке
  }
}