import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './../../../core/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: 'nav.component.html',
  styleUrls: ['nav.component.scss'],
})
export class NavComponent implements OnInit {

  constructor(private router: Router, public authService: AuthService) {
  }

  ngOnInit() { }

  loggedIn() {
    return this.authService.loggedIn();
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
