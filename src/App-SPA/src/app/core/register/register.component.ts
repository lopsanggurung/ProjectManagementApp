import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  model: any = {};
  public registerForm: FormGroup;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)])
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.registerForm.controls[controlName].hasError(errorName) && this.registerForm.controls[controlName].touched;
  }

  public onCancel = () => {
    console.log('Clicked Cancel');
    this.router.navigateByUrl('/login');
  }

  public onRegister = (registerFormValue) => {
    if (this.registerForm.valid) {
      this.model = {
        username: registerFormValue.username,
        password: registerFormValue.password
      };
      // console.log(this.model);
      this.authService.register(this.model).subscribe(
        () => {
          console.log('Registration successful');
          this.authService.login(this.model).subscribe();
          this.router.navigateByUrl('/pages');
        },
        error => {
          console.log(error);
        }
      );
    }
  }
}
