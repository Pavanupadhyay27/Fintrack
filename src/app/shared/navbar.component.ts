import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  name = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.auth.getUser().then(user => {
      if (user) {
        if (user.user_metadata && user.user_metadata['name']) {
          this.name = user.user_metadata['name'];
        } else if (user.email) {
          this.name = user.email.split('@')[0];
        } else {
          this.name = 'User';
        }
      }
    }).catch(() => { this.name = ''; });
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }
}
