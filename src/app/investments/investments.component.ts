import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../storage.service';
import { ValidationUtils } from '../validation.utils';

@Component({
  selector: 'app-investments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './investments.component.html',
  styleUrls: ['./investments.component.css']
})
export class InvestmentsComponent implements OnInit {
  name = '';
  type = 'Stock';
  amount = 0;
  currentValue = 0;
  date = '';
  message = '';
  isSuccess = false;
  investments: any[] = [];

  investmentTypes = ['Stock', 'FD', 'Mutual Fund', 'Other'];

  constructor(private storage: StorageService) {}

  ngOnInit() {
    this.loadInvestments();
    const today = new Date().toISOString().split('T')[0];
    this.date = today;
  }

  async submit() {
    this.message = '';
    this.isSuccess = false;

    const validationError = ValidationUtils.validateInvestment(this.name, this.amount, this.currentValue, this.date);
    if (validationError) {
      this.message = validationError;
      return;
    }

    try {
      const result = await this.storage.addInvestment({
        name: this.name,
        type: this.type,
        amount: this.amount,
        current_value: this.currentValue,
        date: this.date
      });

      this.message = `Investment of ₹${this.amount} added successfully!`;
      this.isSuccess = true;
      this.resetForm();
      await this.loadInvestments();
    } catch (error: any) {
      this.message = error?.message || 'Error adding investment. Please try again.';
    }
  }

  async deleteInvestment(id: string) {
    try {
      await this.storage.deleteInvestment(id);
      await this.loadInvestments();
      this.message = 'Investment deleted successfully!';
      this.isSuccess = true;
      setTimeout(() => {
        this.message = '';
      }, 2000);
    } catch (error: any) {
      this.message = 'Error deleting investment. Please try again.';
    }
  }

  async loadInvestments() {
    try {
      this.investments = await this.storage.getInvestments();
    } catch (error) {
      this.investments = [];
    }
  }

  getTotalInvested(): number {
    return this.investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  }

  getTotalCurrentValue(): number {
    return this.investments.reduce((sum, inv) => sum + (inv.current_value || 0), 0);
  }

  getProfitLoss(): number {
    return this.getTotalCurrentValue() - this.getTotalInvested();
  }

  getProfitLossPercentage(): number {
    const invested = this.getTotalInvested();
    if (invested === 0) return 0;
    return ((this.getProfitLoss() / invested) * 100).toFixed(2) as any;
  }

  resetForm() {
    this.name = '';
    this.type = 'Stock';
    this.amount = 0;
    this.currentValue = 0;
    const today = new Date().toISOString().split('T')[0];
    this.date = today;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
