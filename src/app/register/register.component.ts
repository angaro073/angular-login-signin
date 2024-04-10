import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

import { Router, RouterLink } from '@angular/router';

import { ReactiveFormsModule, FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';

import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  protected form: FormGroup;
  protected submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
  ){
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  protected get control(): { [key: string ]: AbstractControl} {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.valid) {
      this.userService
      .register({
        username: this.form.value['username'],
        password: this.form.value['password']
      })
      .subscribe({
        // next: (user) => {
        //   if (user.id) {
        //     sessionStorage.setItem('userId', user.id);
        //   }
        // },
        complete: () => {
          console.log(`The user ${this.form.value['username']} has been registered!`);
          this.router.navigateByUrl('/home');
        },
        error: (response) => {
          console.log(`ERROR(${response.status}): ${response.message}`);
        }
      });
    }
  }
}
