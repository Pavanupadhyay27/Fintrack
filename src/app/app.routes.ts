import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { VerifiedComponent } from './auth/verified.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IncomeComponent } from './income/income.component';
import { ExpenseComponent } from './expense/expense.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { InvestmentsComponent } from './investments/investments.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'verified',
    component: VerifiedComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'income',
    component: IncomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'expense',
    component: ExpenseComponent,
    canActivate: [authGuard]
  },
  {
    path: 'transactions',
    component: TransactionsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'investments',
    component: InvestmentsComponent,
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
