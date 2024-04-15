import { Component, OnDestroy } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, AbstractControl, Validators, AbstractControlOptions, FormControlStatus, FormControl } from '@angular/forms';
import { UserService } from '../user.service';
import { passwordValidator } from './password-validator';
import { Observable, Subject, Subscription, filter, startWith, switchMap, take } from 'rxjs';
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
export class RegisterComponent implements OnDestroy {
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
	) {
		this.form = this.formBuilder.group({
			/*  
			* What updateOn seems to do, is validating the whole form again when the event configured 
			* for the control or the form happens. When the form is in VALID state, submitting it won't 
			* trigger the validation again. The validation follows this order:
			* 
			* 1) Synchronous validation is done.
			* 2) If the synchronous validation goes well, asynchronous validation is done (the form enters the PENDING state).
			* 3) If the asynchronous validation goes well, the form enters the VALID state.
			* 
			* When some validation fails, it is inserted inside the 'errors' property of the control or form.
			*/
			username: new FormControl({value: '', disabled: false}, {updateOn: 'blur'} ), //* When the user goes away from the control, the validation is triggered.
			email: new FormControl({value: '', disabled: false}, {updateOn: 'change'} ), //* When the user changes the control value, the validation is triggered.
			password: new FormControl({value: '', disabled: false}, {updateOn: 'blur'} ),
			passwordConfirm: new FormControl({value: '', disabled: false}, {updateOn: 'blur'} ),
		}, {
			validators: passwordValidator,
			asyncValidators: backendRegisterValidator.validate.bind(this),
			updateOn: 'submit' //* When the user submits the form, the validation is triggered.
		} as AbstractControlOptions);
		this.control['username'].addValidators([Validators.required]);
		this.control['password'].addValidators([Validators.required]);
		this.control['passwordConfirm'].addValidators([Validators.required]);
		this.control['email'].addValidators([Validators.email]);


		this.formSubmitSubject$ = new Subject();

		this.formStatusObservable$ = this.formSubmitSubject$
			.pipe(
				switchMap((value, index) =>
					this.form.statusChanges.pipe(
						startWith(this.form.status),
						filter(status => status === 'VALID' || status === 'INVALID'),
						take(1)
					)
				),
			);

		this.formStatusSubscription = this.formStatusObservable$.subscribe((status) => {
			this.submitted = true;
			if (status === 'VALID')
				this.registerUser();
			}
		);
	}

	protected get control(): { [key: string]: AbstractControl } {
		return this.form.controls;
	}

	registerUser(): void {
		this.userService
			.register({
				username: this.form.value['username'],
				email: this.form.value['email'] ?? "pedro@gmail.com",
				password: this.form.value['password'],
				passwordConfirm: this.form.value['passwordConfirm']
			})
			.subscribe({
				complete: () => {
					this.router.navigateByUrl('/login');
				}
			});
	}

	ngOnDestroy(): void {
		this.formStatusSubscription.unsubscribe();
	}
}
