
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }
    canActivate(): boolean {
        if (this.authService.loggedIn()) {
            return true;
        }

        this.router.navigate(['/login']);
        console.log('You are not authorized to access this page');
        return false;
    }
}
