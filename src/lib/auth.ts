import { SignJWT, jwtVerify } from 'jose';

// Tipagem profissional para o payload
export type JWTPayload = {
  role: 'admin';
};

// Chave Secreta Exclusiva para JWT (Separada da senha do admin)
const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Erro crítico se carregar sem a chave, evita fallback inseguro
    throw new Error('Erro de Configuração: JWT_SECRET não definido no ambiente.');
  }
  return new TextEncoder().encode(secret);
};

export async function signJWT() {
  const SECRET = getSecret();
  
  return await new SignJWT({ role: 'admin' } as JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(SECRET);
}

export async function verifyJWT(token: string) {
  try {
    const SECRET = getSecret();
    
    // Verificação com algoritmo fixo para evitar ataques de downgrade
    const { payload } = await jwtVerify<JWTPayload>(token, SECRET, {
      algorithms: ['HS256'],
    });

    return payload?.role === 'admin';
  } catch (error) {
    // Tokens expirados, alterados ou sem assinatura válida caem aqui
    return false;
  }
}
