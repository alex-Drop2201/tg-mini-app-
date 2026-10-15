# Telegram Mini App

Заготовка Telegram Mini App: React + TypeScript + Vite. Сайт публикуется на GitHub Pages
и открывается внутри Telegram на любом телефоне, включая iPhone.

## Как работать с телефона

1. Пишете в Claude Code, что нужно поменять.
2. Claude правит код, собирает его и показывает скриншот.
3. После попадания изменений в `main` GitHub Actions за 1–2 минуты обновляет сайт.
4. Открываете бота в Telegram и проверяете.

Компьютер не нужен.

## Первоначальная настройка (один раз)

Настройки репозитория меняются только через сайт. Откройте github.com в браузере телефона,
а не в приложении GitHub, и зайдите в репозиторий → **Settings**.

1. **General → Repository name**: короткое имя латиницей, например `tg-mini-app`.
2. **Описание**: значок ⚙️ рядом с About на главной странице репозитория.
3. **General → Danger Zone → Change visibility → Public.** На бесплатном плане
   GitHub Pages работает только у публичных репозиториев. Код Mini App всё равно
   скачивается в браузер, но **токен бота и другие секреты сюда не коммитим никогда**.
4. **Pages → Build and deployment → Source: GitHub Actions.**
5. **Actions → Build & Deploy → Run workflow.** После завершения сайт доступен по адресу
   `https://alex-drop2201.github.io/tg-mini-app-/` (меняется вместе с именем репозитория).

### Подключить к боту

1. В Telegram откройте [@BotFather](https://t.me/BotFather) и отправьте `/newbot`, чтобы создать бота.
2. `/mybots` → ваш бот → **Bot Settings → Configure Mini App** (или **Menu Button**) →
   вставьте адрес с GitHub Pages.
3. Откройте своего бота: Mini App запускается кнопкой у поля ввода.

## Команды

| Команда           | Что делает                                   |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Dev-сервер с автообновлением                 |
| `npm run build`   | Проверка типов и сборка в `dist/`            |
| `npm run lint`    | Линтер (oxlint)                              |
| `npm run preview` | Локальный просмотр собранной версии          |

## Структура

- `src/telegram.ts`: доступ к `Telegram.WebApp` с проверкой «открыто ли в Telegram».
- `src/App.tsx`: экран приложения.
- `src/index.css`: стили на цветах темы Telegram (`--tg-theme-*`).
- `.github/workflows/deploy.yml`: сборка на каждый push и PR, деплой на Pages из `main`.
