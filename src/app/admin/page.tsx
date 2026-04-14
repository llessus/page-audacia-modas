import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { AdminLogin } from '@/components/admin/AdminLogin';

export const metadata: Metadata = {
  title: 'Login | Audácia Modas',
  description: 'Acesso ao painel administrativo — Audácia Modas',
  robots: { index: false, follow: false },
};

async function loginAction(formData: FormData) {
  'use server';

  const password = formData.get('password') as string | null;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!password || !adminPassword || password !== adminPassword) {
    redirect('/admin?error=invalid');
  }

  const cookieStore = await cookies();
  cookieStore.set('admin_session', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/',
  });

  redirect('/admin/dashboard');
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  // Se já está autenticado, redireciona pro dashboard
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;
  if (session === 'authenticated') {
    redirect('/admin/dashboard');
  }

  const params = await searchParams;
  const hasError = params.error === 'invalid';

  return <AdminLogin loginAction={loginAction} hasError={hasError} />;
}
