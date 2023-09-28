# 1. NextJS with Supabase

## 1.1. NextJS

### 1.1.1. Create a NextJS app

```bash
npx create-next-app@latest
```

### 1.1.2. Install dependencies

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

```bash
npx shadcn-ui@latest init
```

```bash
npm i react-dropzone
```

### 1.1.3. Create a Supabase client

```js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
```
