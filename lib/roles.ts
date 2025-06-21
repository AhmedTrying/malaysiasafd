export type UserRole = 'admin' | 'analyst' | 'viewer'

export interface Permission {
  id: string
  name: string
  description: string
}

export interface Role {
  id: UserRole
  name: string
  description: string
  permissions: Permission[]
}

export const ROLES: Record<UserRole, Role> = {
  admin: {
    id: 'admin',
    name: 'Admin',
    description: 'Full control over the system',
    permissions: [
      { id: 'view_dashboard', name: 'View Dashboard', description: 'Can view the dashboard' },
      { id: 'generate_reports', name: 'Generate Reports', description: 'Can generate new reports' },
      { id: 'manage_users', name: 'Manage Users', description: 'Can manage system users' },
      { id: 'edit_reports', name: 'Edit Reports', description: 'Can edit existing reports' },
      { id: 'delete_reports', name: 'Delete Reports', description: 'Can delete reports' },
      { id: 'reset_passwords', name: 'Reset Passwords', description: 'Can reset user passwords' },
      { id: 'view_predictions', name: 'View Predictions', description: 'Can view prediction results' },
      { id: 'save_csv', name: 'Save CSV', description: 'Can save reports to CSV' },
    ],
  },
  analyst: {
    id: 'analyst',
    name: 'Analyst',
    description: 'Focused on fraud analysis and reporting',
    permissions: [
      { id: 'view_dashboard', name: 'View Dashboard', description: 'Can view the dashboard' },
      { id: 'generate_reports', name: 'Generate Reports', description: 'Can generate new reports' },
      { id: 'view_predictions', name: 'View Predictions', description: 'Can view prediction results' },
      { id: 'save_csv', name: 'Save CSV', description: 'Can save reports to CSV' },
    ],
  },
  viewer: {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only user, for awareness or external stakeholders',
    permissions: [
      { id: 'view_dashboard', name: 'View Dashboard', description: 'Can view the dashboard' },
      { id: 'view_predictions', name: 'View Predictions', description: 'Can view prediction results' },
    ],
  },
}

export const hasPermission = (role: UserRole, permissionId: string): boolean => {
  return ROLES[role].permissions.some(p => p.id === permissionId)
}

export const getRolePermissions = (role: UserRole): Permission[] => {
  return ROLES[role].permissions
}

export const getAllRoles = (): Role[] => {
  return Object.values(ROLES)
} 