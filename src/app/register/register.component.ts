import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

import { Router, RouterLink } from '@angular/router';

import { ReactiveFormsModule, FormBuilder, FormGroup, AbstractControl, Validators, AbstractControlOptions, FormControlStatus } from '@angular/forms';

import { UserService } from '../user.service';
import { passwordValidator } from './password-validator';
import { Observable, Subject, Subscription } from 'rxjs';
import { BackendRegisterValidator } from './backend-reg-validation.validator';
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
	protected formSubmitSubject$: Subject<any>;
  protected submitted: boolean = false;
	protected formStatusObservable$: Observable<FormControlStatus>;
	protected formStatusSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
		private backendRegisterValidator: BackendRegisterValidator
  ){
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.email]],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
    }, {
			validators: passwordValidator,
			asyncValidators: backendRegisterValidator.validate.bind(this)
		} as AbstractControlOptions);
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
        email: this.form.value['email'],
        password: this.form.value['password'],
        passwordConfirm: this.form.value['passwordConfirm']
      })
      .subscribe({
        complete: () => {
          console.log(`The user ${this.form.value['username']} has been registered!`);
          this.router.navigateByUrl('/login');
        },
        error: (response) => {
          console.log(`ERROR(${response.status}): ${response.error.message}`);
          this.error = response.error.message;
        }
      });
    }
  }
}
