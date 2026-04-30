import { LoginDto, RegisterDto,AuthResponseDto,GoogleLoginDto, Validate2faDto, ValidateBackupCodeDto } from "../validations/auth";
import { apiPost } from "@/lib/api";



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
