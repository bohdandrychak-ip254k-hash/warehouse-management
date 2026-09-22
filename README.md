# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Warehouse Management

Веб-система управління складським приміщенням.
Поточний результат: початкова сторінка з каталогом товарів на локальних даних.

## Середовище
Node.js: вкажіть фактичну версію
npm: вкажіть фактичну версію
Git: вкажіть фактичну версію
Docker і Docker Compose: вкажіть фактичні версії
Основний варіант: A — Windows зі стандартними інсталяторами

## Запуск
Нативно: npm install, потім npm run dev.
Docker: docker compose build, docker compose run --rm web npm install, потім docker compose up.
Адреса Docker: http://localhost:5173.
Зупинення й видалення контейнера: docker compose down.

## Збірка
npm run build
Або: docker compose run --rm web npm run build

## План
Див. docs/project-plan.md.
Форми, маршрути та авторизація ще заплановані.