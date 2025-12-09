// contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface Usuario {
  id: number;
  cedula: string;
  nombre: string;
  correo: string;
  telefono: string;
}

interface AuthContextData {
  usuario: Usuario | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (correo: string, clave: string) => Promise<void>;
  logout: () => Promise<void>;
  recuperarClave: (correo: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      const storedUser = await AsyncStorage.getItem('userData');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUsuario(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error al cargar sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (correo: string, clave: string) => {
    try {
      const formData = new URLSearchParams();
      formData.append('correo', correo);
      formData.append('clave', clave);

      const response = await axios.post(
        'https://adamix.net/medioambiente/def/iniciar_sesion/',
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (!response.data.exito || !response.data.token || !response.data.usuario) {
        throw new Error(response.data.mensaje || 'Error al iniciar sesión');
      }

      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.usuario));

      setToken(response.data.token);
      setUsuario(response.data.usuario);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.mensaje || error.message || 'Error al iniciar sesión'
      );
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userData']);
      setToken(null);
      setUsuario(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const recuperarClave = async (correo: string): Promise<string> => {
    try {
      const formData = new URLSearchParams();
      formData.append('correo', correo);

      const response = await axios.post(
        'https://adamix.net/medioambiente/def/recuperar_clave/',
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (!response.data.exito) {
        throw new Error(response.data.mensaje);
      }
      return response.data.mensaje;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.mensaje || error.message || 'Error al recuperar contraseña'
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        isLoading,
        isAuthenticated: !!token && !!usuario,
        login,
        logout,
        recuperarClave,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}   