
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  last_name: string;
}

export interface AuthResponseDto {
  type: string;
  token: string;
  token_type: string;
  expires_at: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_sign_in: string;
  };
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

