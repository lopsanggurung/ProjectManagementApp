import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  model: any = {};
  public loginForm: FormGroup;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.loginForm.controls[controlName].hasError(errorName) && this.loginForm.controls[controlName].touched;
  }

  public onForgotPassword = () => {
    console.log('Clicked Forgot Password');
    this.router.navigateByUrl('/resetPassword');
  }

  public onLogin = (loginFormValue) => {
    if (this.loginForm.valid) {
      this.model = {
        username: loginFormValue.username,
        password: loginFormValue.password
      };
      // console.log(this.model);
      this.authService.login(this.model).subscribe(next => {
        this.router.navigateByUrl('/pages');
      }, error => {
        console.log('Failed to login');
      });
    }
  }

  public openRegister = () => {
    console.log('Clicked Register');
    this.router.navigateByUrl('/register');
  }
}
