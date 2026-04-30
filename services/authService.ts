

export const authService = {

    saveToken: (token: string) => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('token', token);
        }
    },

    getToken: () => {
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem('token');
        }
        return null;
    },

    logout: () => {
        authService.clearToken();
        window.location.href = '/login';
    },

    clearToken: () => {
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('token');
        }
    },

    isLoggedIn: () => {
        return !!authService.getToken();
    },
}