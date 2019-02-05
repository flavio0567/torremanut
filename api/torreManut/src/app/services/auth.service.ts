import { Platform, AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';


const TOKEN_KEY = 'access_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = environment.url;
  user = null;
  authenticationState = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    private helper: JwtHelperService,
    private storage: Storage,
    private plt: Platform,
    private alertController: AlertController
  ) { 
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  checkToken() {
    this.storage.get(TOKEN_KEY).then(token => {
      if (token) {
        const decoded = this.helper.decodeToken(token);
        const isExpired = this.helper.isTokenExpired(token);

        if (!isExpired) {
          this.user = decoded;
          this.authenticationState.next(true);
        } else {
          this.storage.remove(TOKEN_KEY);
        }
      }
    });
  }

  register(credentials) {
    console.log('register service auth: ', this.url);
    return this.http.post(`${this.url}/api/register`, credentials).pipe(
      catchError(e => {
        throw new Error(e);
      })
    )
  }

  login(credentials) {
    console.log('SQL login service auth: ', this.url);
    return this.http.post(`${this.url}/api/login`, credentials)
      .pipe(
        tap(res => {
          this.storage.set(TOKEN_KEY, res['token']);
          this.user = this.helper.decodeToken(res['token']);
          this.authenticationState.next(true);
        }),
        catchError(e => {
          console.log('error: ', e)
          this.showAlert(e.error.msg);
          throw new Error(e.error.msg);
        })
      );
  }



  // login(credentials) {
  //   console.log('login service auth: ', this.url);
  //   return this.http.post(`${this.url}/api/login`, credentials)
  //     .pipe(
  //       tap(res => {
  //         this.storage.set(TOKEN_KEY, res['token']);
  //         this.user = this.helper.decodeToken(res['token']);
  //         this.authenticationState.next(true);
  //       }),
  //       catchError(e => {
  //         console.log('error: ', e)
  //         this.showAlert(e.error.msg);
  //         throw new Error(e.error.msg);
  //       })
  //     );
  // }

  logout() {
    this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
  }

  getSpecialData() {
    return this.http.get(`${this.url}/api/special`).pipe (
      catchError(e => {
        let status = e.status;
        if (status === 401) {
          this.showAlert('Acesso não autorizado! Contate o Administrador');
          this.logout();
        }
        throw new Error(e.error);
      })
    )
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

  showAlert(msg) {
    let alert = this.alertController.create({
      message: msg,
      header: 'Error',
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }


}
