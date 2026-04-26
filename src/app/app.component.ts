import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './shared/navbar.component';
import { SidebarComponent } from './shared/sidebar.component';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router, private auth: AuthService, private supabase: SupabaseService) {
    // Set up auth service in supabase to enable cache checking
    this.supabase.setAuthService(this.auth);
  }

  get isLoginPage() {
    return this.router.url === '/login';
  }
}
