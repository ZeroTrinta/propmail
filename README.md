# PropMail

AI email writer for real estate agents. Built with Next.js, Supabase, Anthropic and Lemon Squeezy.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```
ANTHROPIC_API_KEY=           # anthropic.com → API keys
NEXT_PUBLIC_SUPABASE_URL=    # supabase.com → project settings
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
LEMONSQUEEZY_WEBHOOK_SECRET= # lemonsqueezy.com → webhooks
NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL=  # your checkout link
```

### 3. Set up Supabase

Run this SQL in your Supabase SQL editor:

```sql
create table users (
  id uuid primary key references auth.users(id),
  email text,
  is_pro boolean default false,
  generations_used integer default 0,
  created_at timestamp default now()
);

-- Auto-create user row on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Increment function used by the API
create or replace function increment_generations(user_id uuid)
returns void as $$
  update users set generations_used = generations_used + 1 where id = user_id;
$$ language sql security definer;
```

### 4. Set up Lemon Squeezy

1. Create a product at lemonsqueezy.com ($19/month subscription)
2. Copy the checkout URL to `NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL`
3. Create a webhook pointing to `https://yourdomain.com/api/webhook`
4. Copy the webhook secret to `LEMONSQUEEZY_WEBHOOK_SECRET`

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

```bash
npx vercel
```

Add all `.env.local` variables in the Vercel dashboard under Settings → Environment Variables.

## Project structure

```
app/
  page.tsx              # Landing page
  app/page.tsx          # Main generator
  upgrade/page.tsx      # Upgrade / paywall
  api/
    generate/route.ts   # Claude API call (server-side)
    webhook/route.ts    # Lemon Squeezy webhook
lib/
  prompts.ts            # Email types and system prompts
  supabase.ts           # Supabase client
```
