import { UserRole } from '@prisma/client';

export function isAdminRole(role: UserRole): boolean {
  return role === 'SUPER_ADMIN' || role === 'ADMIN';
}
