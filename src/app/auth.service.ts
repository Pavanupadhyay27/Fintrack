import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: any = null;
  private currentUserId: string | null = null;
  private userCacheTime = 0;
  private cacheExpiry = 5 * 60 * 1000;

  constructor(private storage: StorageService, private supabase: SupabaseService) { }

  validatePassword(password: string): { valid: boolean; message: string } {
    if (password.length < 6) {
      return { valid: false, message: 'Password must be at least 6 characters' };
    }
    if (!/[a-z0-9]/i.test(password)) {
      return { valid: false, message: 'Password must contain alphanumeric characters' };
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one special character' };
    }
    return { valid: true, message: '' };
  }

  async register(name: string, email: string, password: string) {
    const validation = this.validatePassword(password);
    if (!validation.valid) {
      return { success: false, message: validation.message };
    }

    try {
      const { data, error } = await this.supabase.signUp(email, password, name);
      
      if (error) {
        if (error.status === 429) {
          return { success: false, message: 'Too many signup requests. Please wait a few minutes before trying again.' };
        }
        if (error.message && (error.message.includes('already exists') || error.message.includes('User already registered'))) {
          return { success: false, message: 'Account already exists. Please login.' };
        }
        return { success: false, message: error.message };
      }

      this.clearCache();
      return { success: true, message: 'Registration successful!' };
    } catch (err: any) {
      if (err.message && err.message.includes('already exists')) {
        return { success: false, message: 'Account already exists. Please login.' };
      }
      return { success: false, message: err.message || 'Registration failed' };
    }
  }

  async login(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.signIn(email, password);
      
      if (error) {
        if (error.status === 400) {
          return { success: false, message: 'Invalid email or password' };
        }
        if (error.status === 429) {
          return { success: false, message: 'Too many login attempts. Please wait a few minutes before trying again.' };
        }
        return { success: false, message: error.message };
      }

      const user = await this.supabase.getCurrentUser();
      if (user && !user.email_confirmed_at) {
        return { 
          success: false, 
          message: 'Please verify your email first. Check your inbox for verification link.' 
        };
      }

      if (user) {
        this.currentUser = user;
        this.currentUserId = user.id;
        this.userCacheTime = Date.now();
      }

      return { success: true, message: 'Login successful!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Login failed' };
    }
  }

  private isCacheValid(): boolean {
    return this.currentUser !== null && (Date.now() - this.userCacheTime) < this.cacheExpiry;
  }

  private clearCache(): void {
    this.currentUser = null;
    this.currentUserId = null;
    this.userCacheTime = 0;
  }

  async getUser() {
    if (this.isCacheValid()) {
      return this.currentUser;
    }

    const user = await this.supabase.getCurrentUser();
    if (user) {
      this.currentUser = user;
      this.userCacheTime = Date.now();
    }
    return user;
  }

  getCurrentUserId(): string | null {
    if (this.isCacheValid() && this.currentUserId) {
      return this.currentUserId;
    }
    return null;
  }

  async logout() {
    try {
      await this.supabase.signOut();
      this.clearCache();
      this.storage.clearAllData();
      return { success: true, message: 'Logged out successfully' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Logout failed' };
    }
  }

  async resendVerificationEmail(email: string) {
    try {
      const { error } = await this.supabase.resendVerificationEmail(email);
      if (error) {
        return { success: false, message: error.message || 'Failed to resend email' };
      }
      return { success: true, message: 'Verification email sent! Check your inbox.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Error sending email' };
    }
  }
}
