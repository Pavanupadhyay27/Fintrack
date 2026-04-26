import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { ValidationUtils } from '../validation.utils';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent {
  description = '';
  amount = 0;
  category = 'Food';
  creditCard = 'Cash';
  message = '';
  isSuccess = false;

  expenseCategories = ['Food', 'Transport', 'Utilities', 'Rent', 'Entertainment', 'Health', 'Education', 'Other'];
  creditCards = ['Cash', 'Debit Card', 'Credit Card', 'Net Banking', 'UPI'];

  constructor(private storage: StorageService, private router: Router) {}

  async submit() {
    this.message = '';
    this.isSuccess = false;

    const validationError = ValidationUtils.validateTransaction(this.description, this.amount);
    if (validationError) {
      this.message = validationError;
      return;
    }

    try {
      const result = await this.storage.addTransaction({
        type: 'expense',
        description: this.description,
        amount: this.amount,
        category: this.category,
        payment_method: this.creditCard
      });

      this.message = `Expense of ₹${this.amount} added successfully!`;
      this.isSuccess = true;
      this.resetForm();

      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);
    } catch (error: any) {
      this.message = error?.message || 'Error adding expense. Please try again.';
    }
  }

  resetForm() {
    this.description = '';
    this.amount = 0;
    this.category = 'Food';
    this.creditCard = 'Cash';
  }
}
