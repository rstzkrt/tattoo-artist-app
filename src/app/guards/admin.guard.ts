import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {StorageService} from "../services/storage.service";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private afAuth: AngularFireAuth
              ,private router:Router,
              private storage:StorageService) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree | any> {
    const user=this.storage.getUser()

    await this.afAuth.authState.subscribe(async user =>
      await user.getIdTokenResult()
        .then(async (idTokenResult) => {
          if (await idTokenResult.claims.admin) {
            return true
          } else {
            if(confirm("You dont have permission to access this page ")) {
              this.router.navigateByUrl("/home")
            }else {
              this.router.navigateByUrl("/home")
            }
            return false
          }
        })
        .catch((error) => {
          console.log(error);
        })
    )
  }
}
