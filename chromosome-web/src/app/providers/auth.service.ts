import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIURL } from '../urlConfig';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private httpClient: HttpClient) { }


  validateEmail(email: string) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      _base.httpClient.get("https://apilayer.net/api/check?access_key=a439fe8da36d5f7d82b55576c735b9d7&email=" + email + "&smtp=1&format=1")
        .subscribe((data) => {
          resolve(data);
        },
          (err) => {
            reject(err);
          })
    });
  }

  verifyEmail(email: string) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      _base.httpClient.get(APIURL + "User/" + email + "/exists")
        .subscribe((data) => {
          resolve(data);
        },
          (err) => {
            reject(err);
          })
    });
  }


  registerUser(user: any) {
    let _base = this;
    // user.$class = "online.snapbase.chromosome.User";
    // console.log(user);

    return new Promise(function (resolve, reject) {
      _base.httpClient.post(APIURL + 'User', user, {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
      })
        .subscribe(data => {
          resolve(data);
        },
          err => {
            reject(err);
          })
    });
  }

  authenticateUser(user: any) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      _base.httpClient.post(APIURL + 'User/verify', user, _base.httpOptions)
        .subscribe((data) => {
          resolve(data);
        },
          (err) => {
            reject(err);
          })
    });
  }

  getUser(user: any) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      _base.httpClient.post(APIURL + 'User/getUser', user, _base.httpOptions)
        .subscribe((data) => {
          resolve(data);
        },
          (err) => {
            reject(err);
          })
    });
  }

}
