// Auth related types and constants

export const USER_ROLES = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
};

export const EMPLOYEE_ROLES = {
  CASHIER: 'CASHIER',
  MANAGER: 'MANAGER',
};

export const ALL_ROLES = {
  ...USER_ROLES,
  ...EMPLOYEE_ROLES,
};

// Auth state interface (for documentation)
export const AuthState = {
  user: null, // User object or null
  loading: false, // Boolean
  isAuthenticated: false, // Boolean
};

// Login credentials interface
export const LoginCredentials = {
  email: '', // string
  password: '', // string
};

// Register data interface
export const RegisterData = {
  name: '', // string
  email: '', // string
  password: '', // string
  role: '', // USER_ROLES value
};