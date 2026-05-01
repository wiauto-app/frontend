
export interface AuthResponseDto {
  type: string;
  token: string;
  challenge_token?: string;
}


export interface RegisterResponseDto {
  message: string;
  data: {
    id: string;
    email: string;
    provider_id: string;
    last_sign_in: string;
    two_factor_secret: string;
    two_factor_backup_codes: string;
    provider: string;
    is_email_verified: boolean;
    two_factor_enabled: boolean;
    created_at: string;
  };
  error?: string;
  statusCode?: number;
}


export interface myredentianlresponse {
  id: string;
  email: string;
  provider: string;
  name: string;
  last_name: string;
  avatar_url: string;
  last_sign_in: string;
  created_at: string;
}


export interface mobilelogintoken{
  token: string;
}


export interface start2fa{
  otpauth_url: string;
  qr_code_data_url: string;
}


export interface ResetPasswordDto {
  token: string;
  password: string;
}


export interface GoogleLoginDto {
  id_token: string;
}

export interface Validate2faDto {
  code: string;
}


export interface ValidateBackupCodeDto {
  email: string;
  code: string;
}


export interface Usersesiondto {
  id: string;
  email: string;
  provider: string;
  name: string;
  last_name: string;
  avatar_url: string;
  last_sign_in: string;
  created_at: string;
}


export interface Enable2faResponseDto {
  verified: boolean;
  message: string;
  backup_codes: string[];
}

export interface VerificationCoseResponseDto{
  
  message: string;
  token: string;
}

export interface ResendEmailVerificationResponseDto{
  message: string;
}
