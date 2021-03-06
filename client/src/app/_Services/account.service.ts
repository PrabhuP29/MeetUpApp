import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import {map} from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { User } from '../_models/User';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private presenceService: PresenceService) { }

  Login(model:any){
    return this.http.post(this.baseUrl+'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if(user){
          localStorage.setItem('user', JSON.stringify(user));
          //this.currentUserSource.next(user);
          this.setCurrentUser(user);
          this.presenceService.CreateHubConnection(user);
          return response;
        }
      })
    );
  }

  setCurrentUser(user: User){
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles)? user.roles = roles: user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
    this.presenceService.CreateHubConnection(user);
  }

  Logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presenceService.StopHubConnection();
  }

  Register(model:any){
    return this.http.post(this.baseUrl+'account/register', model).pipe(
      map((user: User) => {
        if(user){
          localStorage.setItem('user', JSON.stringify(user));
          //this.currentUserSource.next(user);
          this.setCurrentUser(user);
          return user;
        }
      })
    );
  }

  getDecodedToken(token){
    return JSON.parse(atob(token.split('.')[1]));
  }
}
