import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private supabase: SupabaseService) {}

  async setBudgetLimit(limit: number) {
    return await this.supabase.setBudgetLimit(limit);
  }

  async getBudgetLimit() {
    return await this.supabase.getBudgetLimit();
  }

  async addTransaction(transaction: any) {
    return await this.supabase.addTransaction(transaction);
  }

  async getTransactions() {
    return await this.supabase.getTransactions();
  }

  async deleteTransaction(id: string) {
    return await this.supabase.deleteTransaction(id);
  }

  async addInvestment(investment: any) {
    return await this.supabase.addInvestment(investment);
  }

  async getInvestments() {
    return await this.supabase.getInvestments();
  }

  async deleteInvestment(id: string) {
    return await this.supabase.deleteInvestment(id);
  }

  clearAllData() {
    // Data is now persisted in Supabase, nothing to clear locally
  }
}
