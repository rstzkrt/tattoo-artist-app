import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {MatDialog} from "@angular/material/dialog";
import {LoginDialogComponent} from "../components/login-dialog/login-dialog.component";
import {StorageService} from "../services/storage.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(
    private dialog: MatDialog,
    private storage:StorageService) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const user = await this.storage.getUser()
    const isAuthenticated: boolean = !!user;
    if (!isAuthenticated) {
      await alert("Please login first!")
      await this.dialog.open(LoginDialogComponent)
    }
    return isAuthenticated;
  }
}
