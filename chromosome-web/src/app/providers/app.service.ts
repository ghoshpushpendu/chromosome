import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIURL } from '../urlConfig';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private httpClient: HttpClient) { }


  createapp(application: any) {
    let _base = this;
    // user.$class = "online.snapbase.chromosome.User";
    // console.log(user);

    return new Promise(function (resolve, reject) {
      _base.httpClient.post(APIURL + 'App', application, {
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

  appexists(appid) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      _base.httpClient.get(APIURL + "App/count?where=%7B%22appid%22%3A%22" + appid + "%22%7D")
        .subscribe((data) => {
          resolve(data);
        },
          (err) => {
            reject(err);
          })
    });
  }

  //count apps by user ID
  countApps(email: String) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      _base.httpClient.get(APIURL + "App/count?where=%7B%22owner%22%3A%22resource%3Aonline.snapbase.chromosome.User%23" + email + "%22%7D")
        .subscribe((data) => {
          resolve(data);
        },
          (err) => {
            reject(err);
          })
    });
  }

}
