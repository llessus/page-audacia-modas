import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getProdutos, getHeroImage } from '@/lib/db';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { verifyJWT } from '@/lib/auth';
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
  // Verificar sessão via JWT
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  const isAuthenticated = token ? await verifyJWT(token) : false;

  if (!isAuthenticated) {
    redirect('/admin');
  }

  // Buscar produtos
  let produtos: Produto[];
  try {
    produtos = await getProdutos();
  } catch {
    produtos = [];
  }

  const heroImage = await getHeroImage();

  return <AdminDashboard produtos={produtos} logoutAction={logoutAction} heroImage={heroImage} />;
}
