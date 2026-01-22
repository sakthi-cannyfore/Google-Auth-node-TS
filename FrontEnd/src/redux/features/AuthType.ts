export interface PayloadData {
  loading?: boolean;
  name?: string | null;
  email: string | null;
  password: string | null;
  twoFactorCode?: string | null;
  error?: string | null;
}

export interface AuthState {
  loading?: boolean;
  error: string | null;
  ifReg?: boolean;
  accessToken?: string | null;
  otpUrl?: string | null;
  twoFactorEnabled?: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
    istwoFactorEnabled?: boolean;
    isEmailveryfied?: boolean;
  } | null;
}
