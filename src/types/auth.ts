export interface CitizenUser {
  id: string;
  name: string;
  identifierType: 'mobile' | 'email';
  identifier: string; // phone or email used as primary
  email?: string;
  mobile?: string;
  state: string;
  occupation?: string;
  gender?: string;
  isOtpVerified: boolean;
  token?: string;
  createdAt: string;
  savedSchemes: string[];
}

export interface SendOtpRequest {
  identifier: string;
  type: 'mobile' | 'email';
  purpose: 'signin' | 'signup';
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  otpCode?: string; // provided for seamless preview / verification demo or fallback
  delivered?: boolean;
  channel?: 'email' | 'mobile';
  provider?: string;
  expiresInSeconds: number;
}

export interface VerifyOtpRequest {
  identifier: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  verified: boolean;
}

export interface SignUpRequest {
  name: string;
  identifierType: 'mobile' | 'email';
  identifier: string;
  email?: string;
  mobile?: string;
  state: string;
  occupation?: string;
  gender?: string;
  password?: string;
  otp: string;
}

export interface SignInRequest {
  identifier: string;
  method: 'otp' | 'password';
  otp?: string;
  password?: string;
}
