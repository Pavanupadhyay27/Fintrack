import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../storage.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('expenseChartCanvas') expenseChartCanvas!: ElementRef;
  @ViewChild('incomeExpenseChartCanvas') incomeExpenseChartCanvas!: ElementRef;

  totalIncome = 0;
  totalExpense = 0;
  balance = 0;
  budgetLimit = 0;
  budgetInput = 0;
  isEditingBudget = false;
  transactions: any[] = [];
  recentTransactions: any[] = [];
  selectedTransaction: any = null;

  expenseChart: any;
  incomeExpenseChart: any;

  // Filter properties
  selectedExpenseMonth = new Date().toISOString().substring(0, 7); // YYYY-MM format
  selectedIncomeRange = '3months'; // '3months', '6months', '12months', or 'year'
  selectedIncomeYear = new Date().getFullYear().toString();

  availableMonths: string[] = [];
  availableYears: string[] = [];

  constructor(private storage: StorageService) {}

  async ngOnInit() {
    await this.loadData();
    this.createCharts();
  }

  ngAfterViewInit() {
    // Charts are already created in ngOnInit, don't reload data
    // Just ensure canvas references are available
    if (this.expenseChartCanvas && !this.expenseChart) {
      this.createCharts();
    }
  }

  generateAvailableMonthsAndYears() {
    const monthSet = new Set<string>();
    const yearSet = new Set<string>();

    this.transactions.forEach(t => {
      const date = new Date(t.date);
      const month = date.toISOString().substring(0, 7); // YYYY-MM
      const year = date.getFullYear().toString();
      monthSet.add(month);
      yearSet.add(year);
    });

    this.availableMonths = Array.from(monthSet).sort().reverse();
    this.availableYears = Array.from(yearSet).sort().reverse();

    // Set default values if available
    if (this.availableMonths.length > 0 && !this.availableMonths.includes(this.selectedExpenseMonth)) {
      this.selectedExpenseMonth = this.availableMonths[0];
    }
    if (this.availableYears.length > 0 && !this.availableYears.includes(this.selectedIncomeYear)) {
      this.selectedIncomeYear = this.availableYears[0];
    }
  }

  async loadData() {
    this.transactions = await this.storage.getTransactions();
    this.calculateTotals();
    this.budgetLimit = await this.storage.getBudgetLimit();
    this.budgetInput = this.budgetLimit;
    this.recentTransactions = this.transactions.slice(-5).reverse();
    this.selectedTransaction = null;
    this.generateAvailableMonthsAndYears();
  }

  calculateTotals() {
    this.totalIncome = 0;
    this.totalExpense = 0;

    this.transactions.forEach(t => {
      const amount = Number(t.amount) || 0;  // Parse as number, fallback to 0
      if (t.type === 'income') {
        this.totalIncome += amount;
      } else if (t.type === 'expense') {
        this.totalExpense += amount;
      }
      // Ignore any other types (investments, etc.)
    });

    this.balance = this.totalIncome - this.totalExpense;
  }

  async setBudgetLimit() {
    if (this.budgetInput > 0) {
      try {
        await this.storage.setBudgetLimit(this.budgetInput);
        this.budgetLimit = this.budgetInput;
        this.isEditingBudget = false;
      } catch (error) {
        // Budget save failed silently
      }
    }
  }

  toggleEditBudget() {
    this.isEditingBudget = !this.isEditingBudget;
    if (this.isEditingBudget) {
      this.budgetInput = this.budgetLimit;
    }
  }

  cancelEditBudget() {
    this.isEditingBudget = false;
  }

  createCharts() {
    setTimeout(() => {
      this.createExpenseChart();
      this.createIncomeExpenseChart();
    }, 100);
  }

  onExpenseFilterChange() {
    this.createExpenseChart();
  }

  onIncomeFilterChange() {
    this.createIncomeExpenseChart();
  }

  createExpenseChart() {
    try {
      const categories = this.getExpenseCategories(this.selectedExpenseMonth);

      if (this.expenseChartCanvas && this.expenseChartCanvas.nativeElement) {
        const ctx = this.expenseChartCanvas.nativeElement.getContext('2d');
        if (this.expenseChart) {
          this.expenseChart.destroy();
        }

        // Category to color mapping
        const categoryColors: { [key: string]: string } = {
          'Food': '#DC2626',
          'Transport': '#F97316',
          'Bills': '#2563EB',
          'Shopping': '#D97706',
          'Utilities': '#7C3AED',
          'Entertainment': '#EC4899',
          'Health': '#D946EF',
          'Education': '#0EA5E9',
          'Other': '#6B7280'
        };

        const colors = categories.map(c => categoryColors[c.category] || '#9CA3AF');

        this.expenseChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: categories.map(c => c.category),
            datasets: [{
              data: categories.map(c => c.amount),
              backgroundColor: colors,
              borderColor: '#FFFFFF',
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom' as any,
                labels: {
                  font: { size: 11 },
                  color: '#6B7280',
                  padding: 12,
                  boxWidth: 10
                }
              }
            }
          }
        });
      } else {
        // Chart canvas not available
      }
    } catch (error) {
      // Chart creation failed silently
    }
  }

  createIncomeExpenseChart() {
    try {
      let months: string[] = [];
      let incomeData: number[] = [];
      let expenseData: number[] = [];
      let monthLabels: string[] = [];

      if (this.selectedIncomeRange === 'year') {
        // Show all months of selected year
        months = this.getMonthsForYear(this.selectedIncomeYear);
        incomeData = months.map(m => this.getMonthTotal('income', m));
        expenseData = months.map(m => this.getMonthTotal('expense', m));
        monthLabels = months.map(m => {
          const [year, month] = m.split('-');
          const date = new Date(parseInt(year), parseInt(month) - 1, 1);
          return date.toLocaleDateString('en-US', { month: 'short' });
        });
      } else {
        // Show last N months
        const monthCount = this.selectedIncomeRange === '3months' ? 3 : this.selectedIncomeRange === '6months' ? 6 : 12;
        months = this.getLastNMonths(monthCount);
        incomeData = months.map(m => this.getMonthTotal('income', m));
        expenseData = months.map(m => this.getMonthTotal('expense', m));
        monthLabels = months.map(m => {
          const [year, month] = m.split('-');
          const date = new Date(parseInt(year), parseInt(month) - 1, 1);
          return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        });
      }

      if (this.incomeExpenseChartCanvas && this.incomeExpenseChartCanvas.nativeElement) {
        const ctx = this.incomeExpenseChartCanvas.nativeElement.getContext('2d');
        if (this.incomeExpenseChart) {
          this.incomeExpenseChart.destroy();
        }
        this.incomeExpenseChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: monthLabels,
            datasets: [
              {
                label: 'Income',
                data: incomeData,
                backgroundColor: '#16A34A'
              },
              {
                label: 'Expense',
                data: expenseData,
                backgroundColor: '#DC2626'
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  color: '#6B7280',
                  font: {
                    size: 11
                  }
                },
                grid: {
                  color: '#E5E7EB'
                }
              },
              x: {
                ticks: {
                  color: '#6B7280',
                  font: {
                    size: 11
                  }
                },
                grid: {
                  display: false
                }
              }
            },
            plugins: {
              legend: {
                labels: {
                  color: '#6B7280',
                  font: { size: 11 },
                  padding: 12,
                  boxWidth: 10
                }
              }
            }
          }
        });
      } else {
        // Chart canvas not available
      }
    } catch (error) {
      // Chart creation failed silently
    }
  }

  getExpenseCategories(monthFilter?: string) {
    const categories: { [key: string]: number } = {};

    this.transactions
      .filter(t => {
        if (t.type !== 'expense') return false;
        if (!monthFilter) return true;

        const date = new Date(t.date);
        const month = date.toISOString().substring(0, 7); // YYYY-MM
        return month === monthFilter;
      })
      .forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      });

    return Object.keys(categories).map(key => ({
      category: key,
      amount: categories[key]
    }));
  }

  getLast3Months() {
    const months = [];
    for (let i = 2; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push(d.toLocaleDateString('en-US', { month: 'short' }));
    }
    return months;
  }

  getLastNMonths(n: number) {
    const months = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthStr = String(d.getMonth() + 1).padStart(2, '0');
      const yearStr = d.getFullYear();
      months.push(`${yearStr}-${monthStr}`);
    }
    return months;
  }

  getMonthsForYear(year: string) {
    const months = [];
    for (let i = 0; i < 12; i++) {
      const monthStr = String(i + 1).padStart(2, '0');
      months.push(`${year}-${monthStr}`);
    }
    return months;
  }

  getMonthTotal(type: string, monthYearStr: string, year?: string) {
    const filtered = this.transactions
      .filter(t => {
        const date = new Date(t.date);
        const txMonth = String(date.getMonth() + 1).padStart(2, '0');
        const txYear = date.getFullYear().toString();
        const txMonthYear = `${txYear}-${txMonth}`;

        const matches = t.type === type && txMonthYear === monthYearStr;

        return matches;
      });

    const total = filtered.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    return total;
  }

  getDateFormatted(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  getMonthLabel(monthStr: string): string {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  showDetails(tx: any) {
    this.selectedTransaction = tx;
  }

  closeDetails() {
    this.selectedTransaction = null;
  }

  async deleteTransaction(id: string) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await this.storage.deleteTransaction(id);
        await this.loadData();
        this.selectedTransaction = null;
      } catch (error) {
        alert('Failed to delete transaction');
      }
    }
  }
}
