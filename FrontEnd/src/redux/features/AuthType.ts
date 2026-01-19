import type { BadgePropsColorOverrides } from "@mui/material";

export interface PayloadData {
  name: string;
  email: string;
  password: string;
}

export interface AuthState {
  loading: boolean;
  error: string | null;
  ifReg?: boolean,
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
    isEmailveryfied?: boolean;
  } | null;
}
