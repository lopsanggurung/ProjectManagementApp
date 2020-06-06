import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { User } from './../../../_models/user';
import { UserService } from './../../../core/user.service';
import { AuthService } from './../../../core/auth.service';


@Injectable()
export class UserEditResolver implements Resolve<User[]> {

    constructor(
        private userService: UserService,
        private authService: AuthService,
        private router: Router
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        return this.userService.getUser(this.authService.decodedToken.nameid).pipe(
            catchError(error => {
                console.log('Problem retreiving data');
                this.router.navigate(['/../pages/users']);
                return of(null);
            })
        );
    }
}
