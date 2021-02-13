import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject as BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, first, take } from 'rxjs/operators';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private token: string | undefined;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // this.loggedIn.next(false);
    console.log("yay", this.loggedIn)
    this.initialize();
  }
  private initialize() {
  }
  private async setLoggedIn(loggedIn: boolean, token?: string) {
    this.loggedIn.next(loggedIn);
    this.token = token;
  }
  get logOperator() {
    return this.loggedIn.asObservable().pipe(first());
  }
  get isLoggedIn() {
    let result;
    this.loggedIn.subscribe((e) => (result = e));
    return result;
  }
  public checkLogin() {
    this.logOperator
      .subscribe((e: Boolean) => {
        if (e === true) this.router.navigate(['/home']);
        else if (
          localStorage.getItem('id_token') &&
          this.parseJwt(
            JSON.parse(String(localStorage.getItem('id_token')))?.token
          )
        ) {
          this.loggedIn.next(true);
        }else{
          this.router.navigate(['/login']);
        }
      });
  }
  public getRequest(route: string, data?: any) {
    let params = new HttpParams();
    if (data !== undefined) {
      Object.getOwnPropertyNames(data).forEach((key) => {
        params = params.set(key, data[key]);
      });
    }
    return this.http.get(route, {
      responseType: 'json',
      params,
    });
  }
  public request(method: string, route: string, data?: any) {
    if (method === 'GET') {
      return this.getRequest(route);
    }
    if (this.token) {
      const header = { Authorization: `${this.token}` };
      const payload = {
        responseType: 'json',
        observe: 'body',
      };
      Object.assign(payload, header);
      Object.assign(payload, data);
      if (method === 'POST') return this.http.post(route, payload);
      else if (method === 'PUT') return this.http.put(route, payload);
    }
    return;
  }
  private async setSession(authResult: any) {
    this.token = authResult.token;
    this.setLoggedIn(true, this.token);
    localStorage.setItem('id_token', JSON.stringify(authResult));
    this.router.navigate(['/home']);
  }
  public async login(user: { email: string; password: string }) {
    let error_message;
    let payload: any = this.http
      .put('/auth/login', user, {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*',
        }),
      }).pipe(first())
      .subscribe(
        (response: any) => {
          if (response.token) {
            this.setSession(response);
            return response;
          } else {
            if (response.error) error_message = response.error;
            else error_message = 'Invalid Credentials';
          }
        },
        (error) => {
          error_message = error.error;
        }
      );
    if (error_message) return { error: error_message };
    else return { message: payload?.message };
  }
  public async logout() {
    this.loggedIn.pipe(first())
      .subscribe((e: Boolean) => {
        if (e) this.setLoggedIn(false);
        delete this.token;
        localStorage.removeItem('id_token');
        this.router.navigate(['/login']);
      })
      .unsubscribe();
  }
  public async register(user: User) {
    return this.http
      .post('/auth/register', user, {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*',
        }),
      }).pipe(first())
      .subscribe((response: any) => {
        if (response.token !== undefined) {
          this.token = response.token;
          this.setLoggedIn(true, this.token);
          const userData = {
            token: this.token,
          };
          localStorage.setItem('id_token', JSON.stringify(userData));
          this.router.navigate(['/home']);
        }
      });
    // .unsubscribe();
  }
  public parseJwt(token: any) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }
}
