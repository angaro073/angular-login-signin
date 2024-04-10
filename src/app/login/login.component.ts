import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

import { Router, RouterLink } from '@angular/router';

import { ReactiveFormsModule, FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';

import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  protected form: FormGroup;
  protected submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
  ){
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  protected get control(): { [key: string ]: AbstractControl} {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.valid) {
//
console.log(`
  Username: ${this.form.value['username']}
  Password: ${this.form.value['password']}
`);
//
      let user: User = {
        username: this.form.value['username'],
        password: this.form.value['password'],
      };
//
console.log(JSON.stringify(user, null, 2));
//
      this.userService
      .login(user)
      .subscribe({
        next: (data) => {
          console.log(`${data.username} are login...`);
          sessionStorage.setItem('user', JSON.stringify(data));
        },
        complete: () => {
          this.router.navigateByUrl('/home');
        },
        error: (response) => {
//
console.log(JSON.stringify(response, null, 2));
//
          console.log(`ERROR(${response.status}): ${response.message}`);
        }
      });
    }
  }
}
