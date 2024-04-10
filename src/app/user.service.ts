import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
	private readonly apiURL = "http://localhost:3000";

  constructor(private httpClient: HttpClient) {}

	login(user: User): Observable<User> {
		return this.httpClient.post<User>(`${this.apiURL}/login`, user);
	}

	register(user: User): Observable<User> {
		return this.httpClient.post<User>(`${this.apiURL}/register`, user);
	}
}
