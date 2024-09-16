'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

interface FormData {
  email: string;
  password: string;
}

export async function signup(data: FormData) {
  const supabase = createClient();
  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return { error: true };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
