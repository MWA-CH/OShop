import { Observable } from 'rxjs/internal/Observable';
import { AppUser } from './models/app-user';
import { map } from 'rxjs/internal/operators/map';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuardService implements CanActivate {

  constructor(private auth: AuthService, private userService: UserService) { }
  canActivate(): Observable<boolean> {
    return this.auth.appUser$
      .pipe(map((appUser: any) => appUser.isAdmin));
  }

}
