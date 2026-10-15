import { hasCloudStorage, tg } from './telegram.ts'

// В Telegram данные лежат в CloudStorage: они привязаны к пользователю и
// синхронизируются между его устройствами. Вне Telegram используем localStorage.
// Ключ CloudStorage: только A-Z, a-z, 0-9, _ и -; значение до 4096 символов.

export function loadItem(key: string): Promise<string | null> {
  const app = tg
  if (hasCloudStorage && app) {
    return new Promise((resolve) => {
      app.CloudStorage.getItem(key, (error, value) => resolve(error ? null : value || null))
    })
  }
  try {
    return Promise.resolve(localStorage.getItem(key))
  } catch {
    return Promise.resolve(null)
  }
}

export function saveItem(key: string, value: string) {
  if (hasCloudStorage && tg) {
    tg.CloudStorage.setItem(key, value)
    return
  }
  try {
    localStorage.setItem(key, value)
  } catch {
    // Хранилище недоступно (например, приватный режим): работаем без сохранения.
  }
}
