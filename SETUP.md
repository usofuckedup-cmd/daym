# SafeDeal — запуск MVP (Stripe test mode)

## Что уже готово
- Регистрация/логин (email + пароль, Auth.js)
- Создание сделки, приглашение продавца по email
- Оплата через Stripe Checkout в **test mode** (manual capture — деньги "замораживаются", как в реальном эскроу)
- **Реальные выплаты продавцу через Stripe Connect** (Express-аккаунты, test mode) — при Release Funds деньги реально переводятся на подключённый аккаунт продавца
- Webhook, который переводит сделку в статус `in_progress` после оплаты, и синхронизирует статус выплат продавца
- Release funds / Open dispute — реальные действия, меняющие статус в БД
- Чат по сделке (сообщения хранятся в БД)
- Админка на реальных данных (доступна только пользователю с ролью `ADMIN`)

## Чего нет (осознанно, вне рамок MVP)
- Загрузки файлов
- KYC/верификации личности (у Stripe Connect Express есть своя лёгкая KYC-проверка при онбординге продавца, но это не полноценная верификация личности на уровне платформы)
- SMS-подтверждения при регистрации (заменено на email+пароль — не нужен платный SMS-провайдер)
- Обработка неудачных выплат вручную (админом) — если Transfer не проходит, сделка просто остаётся в текущем статусе, повторная попытка через "Release Funds" ещё раз

## Локальный запуск

1. Установите зависимости:
   ```bash
   pnpm install
   ```

2. Скопируйте `.env.example` в `.env` и заполните:
   - `DATABASE_URL` — из Neon (Dashboard → Connection string)
   - `NEXTAUTH_SECRET` — выполните `npx auth secret` и вставьте результат
   - `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` — из Stripe Dashboard → Developers → API keys (test mode)
   - `STRIPE_WEBHOOK_SECRET` — см. шаг 4

3. Создайте таблицы в базе и засейдите демо-данные:
   ```bash
   pnpm db:push
   pnpm db:seed
   ```
   Это создаст 3 аккаунта (пароль у всех `password123`):
   - `admin@safedeal.dev` — доступ к /admin
   - `buyer@safedeal.dev` — покупатель по демо-сделке
   - `seller@safedeal.dev` — продавец по демо-сделке

4. В отдельном терминале запустите Stripe CLI, чтобы вебхуки доходили локально:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   Он выведет `whsec_...` — вставьте его в `.env` как `STRIPE_WEBHOOK_SECRET`.

5. Запустите проект:
   ```bash
   pnpm dev
   ```

6. Тестовая оплата: на странице сделки нажмите "Fund deal", на странице Stripe Checkout введите тестовую карту `4242 4242 4242 4242`, любую будущую дату и любой CVC.

## Деплой на Vercel

1. Запушьте код в репозиторий на GitHub.
2. На vercel.com → Add New Project → импортируйте репозиторий.
3. В Settings → Environment Variables добавьте те же переменные, что в `.env` (кроме `NEXTAUTH_URL` — укажите ваш прод-домен, например `https://your-app.vercel.app`).
4. Deploy.
5. После первого деплоя выполните `pnpm db:push` и `pnpm db:seed` локально, указав в `.env` тот же `DATABASE_URL` — так продовая БД получит таблицы и демо-аккаунты.
6. В Stripe Dashboard → Developers → Webhooks → Add endpoint: `https://your-app.vercel.app/api/webhooks/stripe`, выберите события `checkout.session.completed` и `account.updated`, скопируйте его `Signing secret` в переменную `STRIPE_WEBHOOK_SECRET` на Vercel и передеплойте.

## Дальше (после MVP, если решите делать реальный запуск)
- Реальные выплаты: Stripe Connect (Express accounts) для продавцов
- Загрузка файлов: Vercel Blob или UploadThing
- KYC-провайдер (Stripe Identity, Sumsub) перед выводом реальных денег
- Юридическое оформление эскроу-деятельности в вашей юрисдикции — это регулируемая финансовая услуга практически везде
