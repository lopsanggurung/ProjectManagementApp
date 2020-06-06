import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { User } from './../../../_models/user';
import { UserService } from './../../../core/user.service';


@Injectable()
export class UserListResolver implements Resolve<User[]> {

    constructor(
        private userService: UserService,
        private router: Router
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        return this.userService.getUsers().pipe(
            catchError(error => {
                console.log('Problem retreiving data');
                this.router.navigate(['/../pages/users']);
                return of(null);
            })
        );
    }
}
