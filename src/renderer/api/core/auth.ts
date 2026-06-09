// src/renderer/api/core/auth.ts

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export interface AuthResponse {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  token: string;
  refreshToken: string;
  expiresAt: string;
  roles: string[];
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AuthAPI {
  login(credentials: LoginRequest): Promise<AuthResponse>;
  register(userData: RegisterRequest): Promise<AuthResponse>;
  logout(): Promise<boolean>;
  getCurrentUser(): Promise<AuthResponse>;
  changePassword(data: ChangePasswordRequest): Promise<boolean>;
  refreshToken(): Promise<AuthResponse>;
  // ---------- Utility methods ----------
  isLoggedIn(): Promise<boolean>;
  getAccessToken(): Promise<string | null>;
  revokeAllTokens(): Promise<boolean>;
}

const authAPI: AuthAPI = {
  async login(credentials) {
    const response = await window.backendAPI.auth('login', credentials);
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async register(userData) {
    const response = await window.backendAPI.auth('register', userData);
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async logout() {
    const response = await window.backendAPI.auth('logout', {});
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getCurrentUser() {
    const response = await window.backendAPI.auth('me', {});
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async changePassword(data) {
    const response = await window.backendAPI.auth('changePassword', data);
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async refreshToken() {
    const response = await window.backendAPI.auth('refresh', {});
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  // ---------- Utility methods ----------
  async isLoggedIn() {
    const response = await window.backendAPI.auth('isLoggedIn', {});
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getAccessToken() {
    const response = await window.backendAPI.auth('getAccessToken', {});
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async revokeAllTokens() {
    const response = await window.backendAPI.auth('revokeAllTokens', {});
    if (!response.status) throw new Error(response.message);
    return response.data;
  },
};

export default authAPI;