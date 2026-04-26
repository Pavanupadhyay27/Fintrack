import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {
  name = '';
  email = '';
  password = '';
  isRegister = false;
  error = '';
  passwordStrength = '';
  showNotification = false;
  notificationType: 'error' | 'success' = 'error';
  notificationMessage = '';
  isSubmitting = false;
  cooldownSeconds = 0;
  showResendButton = false;
  private cooldownTimer: any;
  private lastSubmitMs = 0; // timestamp to debounce rapid submits

  constructor(private auth: AuthService, private router: Router) {}

  showToast(message: string, type: 'error' | 'success' = 'error') {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 4000);
  }

  closeNotification() {
    this.showNotification = false;
  }

  hasMinLength() {
    return this.password.length >= 6;
  }

  hasAlphanumeric() {
    return /[a-z0-9]/i.test(this.password);
  }

  hasSpecialChar() {
    return /[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]/.test(this.password);
  }

  checkPasswordStrength() {
    if (!this.password) {
      this.passwordStrength = '';
      return;
    }

    const checks = [this.hasMinLength(), this.hasAlphanumeric(), this.hasSpecialChar()].filter(c => c).length;

    if (checks === 3) {
      this.passwordStrength = 'strong';
    } else if (checks === 2) {
      this.passwordStrength = 'medium';
    } else {
      this.passwordStrength = 'weak';
    }
  }

  async submit() {
    // Strong loading guard - prevent any further execution if already submitting
    if (this.isSubmitting) return;
    if (this.cooldownSeconds > 0) return;

    // Debounce rapid submits (5s apart)
    const now = Date.now();
    if (now - this.lastSubmitMs < 5000) return;

    this.lastSubmitMs = now;
    this.isSubmitting = true;
    this.error = '';

    // Start a short cooldown for register to avoid rapid repeated signups
    if (this.isRegister) {
      this.startCooldown();
    }

    try {
      if (this.isRegister) {
        if (!this.name || !this.email || !this.password) {
          this.showToast('Please fill in all fields', 'error');
          this.isSubmitting = false;
          return;
        }

        if (!this.email.includes('@')) {
          this.showToast('Please enter a valid email', 'error');
          this.isSubmitting = false;
          return;
        }

        const result = await this.auth.register(this.name, this.email, this.password);
        if (result.success) {
          this.showToast('Account created! Now login.', 'success');
          this.resetRegisterForm();
          setTimeout(() => {
            this.isRegister = false;
          }, 1500);
        } else {
          if (result.message.includes('already exists') || result.message.includes('user_id')) {
            this.showToast('Account already exists. Please login.', 'error');
          } else {
            this.showToast(result.message, 'error');
          }
        }
      } else {
        if (!this.email || !this.password) {
          this.showToast('Please fill in all fields', 'error');
          this.isSubmitting = false;
          return;
        }

        const result = await this.auth.login(this.email, this.password);
        if (result.success) {
          this.router.navigate(['/dashboard']);
        } else {
          if (result.message.includes('verify') || result.message.includes('confirmation')) {
            this.showResendButton = true;
          }
          this.showToast(result.message, 'error');
        }
      }
    } catch (error) {
      this.showToast('An unexpected error occurred', 'error');
    } finally {
      // keep a short delay before allowing next submit to prevent accidental double click
      setTimeout(() => {
        this.isSubmitting = false;
      }, 300);
    }
  }

  private startCooldown() {
    this.cooldownSeconds = 5;
    if (this.cooldownTimer) {
      clearInterval(this.cooldownTimer);
    }
    this.cooldownTimer = setInterval(() => {
      this.cooldownSeconds--;
      if (this.cooldownSeconds <= 0) {
        clearInterval(this.cooldownTimer);
      }
    }, 1000);
  }

  async resendVerificationEmail() {
    if (!this.email) {
      this.showToast('Please enter your email', 'error');
      return;
    }
    
    this.isSubmitting = true;
    try {
      const result = await this.auth.resendVerificationEmail(this.email);
      if (result.success) {
        this.showToast(result.message, 'success');
        this.showResendButton = false;
      } else {
        this.showToast(result.message, 'error');
      }
    } catch (error) {
      this.showToast('Error sending email', 'error');
    } finally {
      this.isSubmitting = false;
    }
  }

  toggleMode() {
    this.isRegister = !this.isRegister;
    this.error = '';
    this.passwordStrength = '';
    this.cooldownSeconds = 0;
    this.showResendButton = false;
    if (this.cooldownTimer) {
      clearInterval(this.cooldownTimer);
    }
    if (this.isRegister) {
      this.resetRegisterForm();
    } else {
      this.email = '';
      this.password = '';
    }
  }

  ngOnDestroy() {
    if (this.cooldownTimer) {
      clearInterval(this.cooldownTimer);
    }
  }

  resetRegisterForm() {
    this.name = '';
    this.email = '';
    this.password = '';
    this.passwordStrength = '';
  }
}
