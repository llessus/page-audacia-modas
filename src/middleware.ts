import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  // 1. Tenta recuperar o cookie de sessão e valida a assinatura JWT
  const token = request.cookies.get('admin_session')?.value;
  const isAuthenticated = token ? await verifyJWT(token) : false;
  
  // 2. Define as rotas que estamos a monitorizar
  const isLoginPage = request.nextUrl.pathname === '/admin';
  const isAdminDashboard = request.nextUrl.pathname.startsWith('/admin/dashboard');

  // REGRA DE OURO: Proteção do Dashboard
  if (isAdminDashboard && !isAuthenticated) {
    // Se não tem sessão válida e quer o dashboard, volta para o login
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // REGRA DE CONFORTO: Evitar login duplicado
  if (isLoginPage && isAuthenticated) {
    // Se já tem cookie e está no login, vai direto para o dashboard
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // Se estiver tudo ok, deixa a requisição seguir caminho
  return NextResponse.next();
}

// Configuração para o middleware rodar apenas nas rotas /admin
export const config = {
  matcher: ['/admin/:path*'],
};