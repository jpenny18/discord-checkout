export type UserRole = 'ascendant_hero' | 'ascendant_challenger' | 'ascendant_trader' | 'default';

export const roleHierarchy: Record<UserRole, number> = {
  'ascendant_hero': 3,
  'ascendant_challenger': 2,
  'ascendant_trader': 1,
  'default': 0
};

export const courseRequirements = {
  beginners: 'ascendant_trader',
  intermediate: 'ascendant_challenger',
  advanced: 'ascendant_hero'
} as const;

export function hasRequiredRole(userRole: UserRole | null | undefined, requiredRole: UserRole): boolean {
  const currentRoleLevel = roleHierarchy[userRole || 'default'];
  const requiredRoleLevel = roleHierarchy[requiredRole];
  return currentRoleLevel >= requiredRoleLevel;
}

export function getUpgradeMessage(currentRole: UserRole | null | undefined, requiredRole: UserRole): string {
  if (!currentRole || currentRole === 'default') {
    return `You need to be an ${requiredRole.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')} to access this content`;
  }

  return `Upgrade to ${requiredRole.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')} to unlock this content`;
}

export function getRoleBadgeColor(role: UserRole): string {
  switch (role) {
    case 'ascendant_hero':
      return 'bg-purple-900/50 text-purple-400';
    case 'ascendant_challenger':
      return 'bg-blue-900/50 text-blue-400';
    case 'ascendant_trader':
      return 'bg-green-900/50 text-green-400';
    default:
      return 'bg-gray-900/50 text-gray-400';
  }
}

export function formatRoleName(role: UserRole): string {
  return role.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
} 