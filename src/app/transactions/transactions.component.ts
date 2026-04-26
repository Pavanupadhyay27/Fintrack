import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  transactions: any[] = [];
  filteredTransactions: any[] = [];
  searchQuery = '';
  filterType = 'all';
  selectedTransaction: any = null;

  constructor(private storage: StorageService) {}

  async ngOnInit() {
    await this.loadTransactions();
  }

  async loadTransactions() {
    this.transactions = (await this.storage.getTransactions()).reverse();
    this.applyFilters();
  }

  applyFilters() {
    this.filteredTransactions = this.transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                           t.category.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesType = this.filterType === 'all' || t.type === this.filterType;
      return matchesSearch && matchesType;
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  async deleteTransaction(id: string) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await this.storage.deleteTransaction(id);
        await this.loadTransactions();
      } catch (error) {
        alert('Error deleting transaction. Please try again.');
      }
    }
  }

  getDateFormatted(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  downloadCSV() {
    const headers = ['Description', 'Category', 'Type', 'Amount', 'Payment Method', 'Date'];
    const rows = this.transactions.map(t => [
      t.description,
      t.category,
      t.type,
      (Number(t.amount) || 0).toFixed(2),
      t.payment_method || '',
      this.getDateFormatted(t.date)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fintrack-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  downloadJSON() {
    const jsonContent = JSON.stringify(this.transactions, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fintrack-transactions-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  showDetails(tx: any) {
    this.selectedTransaction = tx;
  }

  closeDetails() {
    this.selectedTransaction = null;
  }
}
