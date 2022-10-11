import {CanActivate, Router} from '@angular/router';
import {Injectable} from "@angular/core";
import {AngularFireAuth} from '@angular/fire/compat/auth/';
import {take, switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private auth: AngularFireAuth, private router: Router) {
  }

  canActivate() {
    return this.auth.authState.pipe(
      take(1),
      switchMap(async (authState) => {
        if (!authState) {
          this.router.navigate(['/home'])
          return false
        }
        const token = await authState.getIdTokenResult()
        if (!token.claims.admin) {
          this.router.navigate(['/home'])
          return false
        }
        return true
      }),
    )
  }
}
