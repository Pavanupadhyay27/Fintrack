import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private authService: any = null; // Will be injected later to avoid circular dependency

  constructor() {
    this.supabase = createClient(environment.supabase.url, environment.supabase.key);
  }

  setAuthService(authService: any) {
    this.authService = authService;
  }

  getClient() {
    return this.supabase;
  }

  private async getUserIdFromSession(): Promise<string | null> {
    try {
      const sessionResult = await this.supabase.auth.getSession();
      // getSession does not hit network, reads local session
      const session = (sessionResult as any)?.data?.session;
      if (session && session.user && session.user.id) {
        return session.user.id;
      }
    } catch (e) {
      // ignore and fallback to localStorage parse
    }

    const sessionStr = localStorage.getItem('supabase.auth.token') || localStorage.getItem('sb:token');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        return session?.user?.id || null;
      } catch {
        return null;
      }
    }
    return null;
  }

  private async getUserId(): Promise<string | null> {
    // First, try to get from AuthService cache (fast, no network call)
    if (this.authService) {
      const cachedId = this.authService.getCurrentUserId();
      if (cachedId) {
        return cachedId;
      }
    }

    // Second, try to get from local session (no network call)
    const cachedId = await this.getUserIdFromSession();
    if (cachedId) {
      return cachedId;
    }

    // Only call getUser() if cache misses (network call)
    const user = await this.getCurrentUser();
    return user?.id || null;
  }

  // Auth methods
  async signUp(email: string, password: string, name: string) {
    return await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    });
  }

  async signIn(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({
      email,
      password
    });
  }

  async signOut() {
    return await this.supabase.auth.signOut();
  }

  async getCurrentUser() {
    const { data: { user } } = await this.supabase.auth.getUser();
    return user;
  }

  async resendVerificationEmail(email: string) {
    return await this.supabase.auth.resend({
      type: 'signup',
      email: email
    });
  }

  // Transaction methods
  async addTransaction(transaction: any) {
    const userId = await this.getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await this.supabase
      .from('transactions')
      .insert([
        {
          user_id: userId,
          description: transaction.description,
          category: transaction.category,
          type: transaction.type,
          amount: transaction.amount,
          payment_method: transaction.payment_method || null,
          date: new Date().toISOString()
        }
      ]);

    if (error) {
      throw new Error(error.message || 'Failed to add transaction');
    }

    return { data, error };
  }

  async getTransactions() {
    const userId = await this.getUserId();
    if (!userId) {
      return [];
    }

    const { data, error } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return [];
    }

    return data || [];
  }

  async deleteTransaction(id: string) {
    const userId = await this.getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    return await this.supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
  }

  // Budget methods
  async setBudgetLimit(limit: number) {
    const userId = await this.getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await this.supabase
      .from('user_budget')
      .upsert({
        user_id: userId,
        budget_limit: limit,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (error) {
      throw new Error(error.message || 'Failed to set budget');
    }

    return { data, error };
  }

  async getBudgetLimit() {
    const userId = await this.getUserId();
    if (!userId) {
      return 0;
    }

    const { data, error } = await this.supabase
      .from('user_budget')
      .select('budget_limit')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return 0;
      }
      return 0;
    }

    return data?.budget_limit || 0;
  }

  // Investment methods
  async addInvestment(investment: any) {
    const userId = await this.getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await this.supabase
      .from('investments')
      .insert([
        {
          user_id: userId,
          name: investment.name,
          type: investment.type,
          amount: investment.amount,
          current_value: investment.current_value,
          date: investment.date
        }
      ]);

    if (error) {
      throw new Error(error.message || 'Failed to add investment');
    }

    return { data, error };
  }

  async getInvestments() {
    const userId = await this.getUserId();
    if (!userId) {
      return [];
    }

    const { data, error } = await this.supabase
      .from('investments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return [];
    }

    return data || [];
  }

  async deleteInvestment(id: string) {
    const userId = await this.getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    return await this.supabase
      .from('investments')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
  }
}
