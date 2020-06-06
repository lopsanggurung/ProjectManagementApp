import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  user: User;
  public registerForm: FormGroup;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      confirmPassword: new FormControl('', [Validators.required])
    }, this.passwordMatchValidator);
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value
      ? null
      : { mismatch: true };
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.registerForm.controls[controlName].hasError(errorName) && this.registerForm.controls[controlName].touched;
  }

  public onCancel = () => {
    console.log('Clicked Cancel');
    this.router.navigate(['/login']);
  }

  public onRegister = (registerFormValue) => {
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      // console.log(this.model);
      this.authService.register(this.user).subscribe(
        () => {
          console.log('Registration successful');
          this.authService.login(this.user).subscribe(() => {
            this.router.navigate(['/pages/dashboard']);
          });
        },
        error => {
          console.log(error);
        }
      );
    }
  }
}
