
import { authService } from '../(auth)/services/authService';
import { API_URL } from '../constants';
import { toast } from 'sonner';

interface FetchOptions extends RequestInit {
  isFileUpload?: boolean;
  isFormData?: boolean;
}

// Función helper para hacer fetch con autenticación
export const fetchWithAuth = async (url: string, options: FetchOptions = {}) => {
  const token = authService.getToken();
  // Para FormData o subida de archivos, NO establecer Content-Type manualmente
  // El navegador lo establecerá automáticamente con el boundary correcto
  const isFormDataBody = options.body instanceof FormData || options.isFormData || options.isFileUpload;
  
    
  const headers: any = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  // Solo establecer Content-Type si NO es FormData y hay un body
  if (!isFormDataBody && options.body) {
    headers['Content-Type'] = 'application/json';
  }

  
  const response = await fetch(url, {
    ...options,
    headers,
  });



  // Si el token expiró o es inválido, redirigir al login
  if (response.status === 401) {
    authService.logout();
    window.location.href = '/login';
  }


  if(response.status === 403) {
    const error = await response.json();
    toast.error(error.message || 'No tienes permisos para acceder a este recurso');
  }

  if(!response.ok) {
    const error = await response.json();
    console.log("error", error);
    toast.error(error.message || 'Error en la petición');
    throw new Error(error.message || 'Error en la petición');
  }

  return response;
};

// Helper para GET
export const apiGet = async <T>(endpoint: string): Promise<T> => {
  const url = `${API_URL}${endpoint}`;
  const response = await fetchWithAuth(url);
  if (!response.ok) {
    const error = await response.json();
    console.log("error", error);
    throw new Error(error.message || 'Error en la petición');
  }
  
  return response.json();
};

// Helper para POST
export const apiPost = async <T>(endpoint: string, data?: any): Promise<T> => {
  const response = await fetchWithAuth(`${API_URL}${endpoint}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message || 'Error en la petición');
  }
  
  return response.json();
};

/** POST que devuelve un Blob (p. ej. PDF). */
export const apiPostBlob = async (
  endpoint: string,
  data?: unknown,
): Promise<Blob> => {
  const response = await fetchWithAuth(`${API_URL}${endpoint}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { message?: string }).message || 'Error en la petición',
    );
  }

  return response.blob();
};

// Helper para PUT
export const apiPut = async <T>(endpoint: string, data: any): Promise<T> => {
  const response = await fetchWithAuth(`${API_URL}${endpoint}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error en la petición');
  }
  
  return response.json();
};

// Helper para PATCH
export const apiPatch = async <T>(endpoint: string, data: any): Promise<T> => {
  const response = await fetchWithAuth(`${API_URL}${endpoint}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error en la petición');
  }
  
  return response.json();
};


// Helper para DELETE
export const apiDelete = async <T>(endpoint: string): Promise<void> => {
  const response = await fetchWithAuth(`${API_URL}${endpoint}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error en la petición');
  }
  
};


