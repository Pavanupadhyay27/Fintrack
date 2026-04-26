import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-verified',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verified.component.html',
  styleUrls: ['./verified.component.css']
})
export class VerifiedComponent implements OnInit {
  isLoading = true;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.verifyEmail();
  }

  private async verifyEmail() {
    try {
      // Give Supabase a moment to process the token
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = await this.auth.getUser();

      if (user && user.email_confirmed_at) {
        this.isLoading = false;
      } else if (user && !user.email_confirmed_at) {
        this.error = 'Email verification failed. Please check the verification link and try again.';
        this.isLoading = false;
      } else {
        this.error = 'Unable to verify email. Please try logging in.';
        this.isLoading = false;
      }
    } catch (err: any) {
      this.error = err.message || 'An error occurred during verification.';
      this.isLoading = false;
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
