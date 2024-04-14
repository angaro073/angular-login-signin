import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { Observable, map } from "rxjs";
import { UserService } from "../user.service";
import { Injectable } from "@angular/core";

@Injectable({
	providedIn: 'root'
})
export class BackendLoginValidator implements AsyncValidator {

	constructor(private userService: UserService) {

	}

	validate(control: AbstractControl<any, any>): Observable<ValidationErrors | null> {
		console.log("Doing async validation");
		const userName = control.get("username")?.value as string;
		const userPassword = control.get("password")?.value as string;
		return this.userService.userCanBeLogged({
			username: userName,
			password: userPassword
		})
		.pipe(
			map((canBeLogged) => canBeLogged ? null : { wrongCredentials: true })
		);
	}
}