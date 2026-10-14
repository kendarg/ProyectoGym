import { Injectable, signal, inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable,  tap} from 'rxjs';
import {AuthResponse, LoginCredential} from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http  = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/auth';

    currentUser= signal<AuthResponse['user'] | null > (null);
    
    login(credentials: LoginCredential): Observable<AuthResponse>{
        return this.http.post<AuthResponse>('${this.apiUrl}/login',credentials).pipe(tap((response) => {
            localStorage.setItem('auth_token', response.token);
            this.currentUser.set(response.user);
            })
        );
    }
    logout(): void{
        localStorage.removeItem('auth_token');
        this.currentUser.set(null);
    }

    isAthenticated(): boolean{
        return !!localStorage.getItem('autho_token');
    }
}