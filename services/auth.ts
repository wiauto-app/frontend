import { AuthResponseDto,RegisterResponseDto,GoogleLoginDto,Validate2faDto, ValidateBackupCodeDto, ResendEmailVerificationResponseDto } from "../validations/auth";
import { apiPost } from "@/lib/api";
import { LoginDto, RegisterDto, ResetPasswordDto } from "../validations/Schemas";



export async function login(data: LoginDto): Promise<AuthResponseDto> {
 
    try {
        return await apiPost<AuthResponseDto>(`/auth/login`, data);
    } catch (error) {
        throw error;
    }
}

export async function register(data: RegisterDto): Promise<AuthResponseDto> {
    try {
        return await apiPost<AuthResponseDto>(`/auth/register`, data);
    } catch (error) {
        throw error;
    }
}   


export async function googleLogin(data: GoogleLoginDto): Promise<AuthResponseDto> {
    try {
        return await apiPost<AuthResponseDto>(`/auth/google/mobile`, data);
    } catch (error) {
        throw error;
    }
}


export async function activate2fa(data: Validate2faDto): Promise<AuthResponseDto> {
    try {
        return await apiPost<AuthResponseDto>(`/2fa/activate`, data);
    } catch (error) {
        throw error;
    }
}


export async function disable2fa(data: Validate2faDto): Promise<AuthResponseDto> {
    try {
        return await apiPost<AuthResponseDto>(`/2fa/disable`, data);
    } catch (error) {
        throw error;
    }
}


export async function enable2fa(data: Validate2faDto): Promise<AuthResponseDto> {
    try {
        return await apiPost<AuthResponseDto>(`/2fa/enable`, data);
    } catch (error) {
        throw error;
    }
}

export async function validateBackupCode(data: ValidateBackupCodeDto): Promise<AuthResponseDto> {
    try {
        return await apiPost<AuthResponseDto>(`/2fa/validate-backup-code`, data);
    } catch (error) {
        throw error;
    }

}

export async function resendEmailVerification(email:string): Promise<ResendEmailVerificationResponseDto> {
    try {
        return  await apiPost<ResendEmailVerificationResponseDto>(`/auth/email-verification/resend`, {email});
                
    } catch (error) {
        throw error;
    }
}


export async function forgotPassword(email:string): Promise<ResendEmailVerificationResponseDto> {
    try {
        return  await apiPost<ResendEmailVerificationResponseDto>(`/auth/password-recovery/request`, {email});
    } catch (error) {
        throw error;
    }
}

export async function changePassword(data: ResetPasswordDto): Promise<ResendEmailVerificationResponseDto> {
    try {
        return  await apiPost<ResendEmailVerificationResponseDto>(`/auth/password-recovery/change`, data);
    } catch (error) {
        throw error;
    }
}

export async function confirmEmailVerification(token:string): Promise<ResendEmailVerificationResponseDto> {
    try {
        return  await apiPost<ResendEmailVerificationResponseDto>(`/auth/email-verification/confirm`, {token});
    } catch (error) {
        throw error;
    }
}
