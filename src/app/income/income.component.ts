import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { ValidationUtils } from '../validation.utils';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css']
})
export class IncomeComponent {
  description = '';
  amount = 0;
  category = 'Salary';
  message = '';
  isSuccess = false;

  incomeCategories = ['Salary', 'Freelance', 'Investment', 'Bonus', 'Other'];

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
        type: 'income',
        description: this.description,
        amount: this.amount,
        category: this.category
      });

      this.message = `Income of ₹${this.amount} added successfully!`;
      this.isSuccess = true;
      this.resetForm();

      // Auto-redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);
    } catch (error: any) {
      this.message = error?.message || 'Error adding income. Please try again.';
    }
  }

  resetForm() {
    this.description = '';
    this.amount = 0;
    this.category = 'Salary';
  }
}
