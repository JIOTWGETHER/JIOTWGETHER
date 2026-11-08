
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { serverDb } from './db';

type CookieOptions = {
  domain?: string;
  path?: string;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: boolean | 'lax' | 'strict' | 'none';
  maxAge?: number;
};

type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

async function createSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Cookies may be read-only in Server Components.
          }
        },
      },
    }
  );
}

export async function getAdmin() {
  const client = await createSupabaseClient();

  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error || !user) {
    return null;
  }

  const { data } = await serverDb()
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  return data ? user : null;
}

export async function login(
  email: string,
  password: string
) {
  const client = await createSupabaseClient();

  return client.auth.signInWithPassword({
    email,
    password,
  });
}

export async function logout() {
  const client = await createSupabaseClient();
  await client.auth.signOut();
}
