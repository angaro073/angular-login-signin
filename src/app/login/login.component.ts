import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../user.service';

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
  protected error: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
  ){
    this.form = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  protected get control(): { [key: string ]: AbstractControl} {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.valid) {
      this.userService
      .login({
        username: this.form.value['username'],
        password: this.form.value['password'],
      })
      .subscribe({
        next: (data) => {
          console.log(`${data.username} are login...`);
          sessionStorage.setItem('user', JSON.stringify(data));
        },
        complete: () => {
          this.router.navigateByUrl('/home');
        },
        error: (response) => {
          console.log(`ERROR(${response.status}): ${response.error.message}`);
          this.error = response.error.message;
        }
      });
    }
  }
}
