import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getProdutos } from '@/lib/db';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import type { Metadata } from 'next';
import type { Produto } from '@/types/produto';

export const metadata: Metadata = {
  title: 'Dashboard | Audácia Modas',
  description: 'Painel de gestão de estoque — Audácia Modas',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

async function logoutAction() {
  'use server';
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/admin');
}

export default async function DashboardPage() {
  // Verificar sessão
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;

  if (session !== 'authenticated') {
    redirect('/admin');
  }

  // Buscar produtos
  let produtos: Produto[];
  try {
    produtos = await getProdutos();
  } catch {
    produtos = [];
  }

  return <AdminDashboard produtos={produtos} logoutAction={logoutAction} />;
}
