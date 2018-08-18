import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIURL } from '../urlConfig';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }


  validateEmail(email: string) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      _base.httpClient.get("http://apilayer.net/api/check?access_key=a439fe8da36d5f7d82b55576c735b9d7&email=" + email + "&smtp=1&format=1")
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
    return new Promise(function (resolve, reject) {
      _base.httpClient.post(APIURL + 'User', user)
        .subscribe((data) => {
          resolve(data);
        },
          (err) => {
            reject(err);
          })
    });
  }

  authenticateUser(user: any) {
    let _base = this;
    return new Promise(function (resolve, reject) {
      _base.httpClient.post(APIURL + 'User/verify', user)
        .subscribe((data) => {
          resolve(data);
        },
          (err) => {
            reject(err);
          })
    });
  }

  /*********************DRUG TYPE METHOD**********************/
  // createdrug(data) {
  //   console.log(data)
  //   return this.httpClient.post(APIURL + 'DrugType', data)
  // }

  // /*************************GET DRUG TYPE*******************/
  // getDrugType() {
  //   return this.httpClient.get(APIURL + 'DrugType')
  // }
  // /******************* CREATE MEDICINE MASTER*****************************/
  // createMedicineMaster(data) {
  //   console.log(data)
  //   return this.httpClient.post(APIURL + 'MedicineMaster', data)
  // }
  // // ***********************VENDOR METHOD************************************/
  // createVendor(data) {
  //   console.log(data)
  //   return this.httpClient.post(APIURL + 'Vendor', data)
  // }
  // /*****************************CREATE MANUFACTURE****************/
  // createManufacture(data) {
  //   console.log(data);
  //   return this.httpClient.post(APIURL + 'Manufacturer', data)
  // }
  // /**************************GET PHARMACY DETAIL BY TRADE LICENSE ID*************************/
  // getPharmacy(tradeId) {
  //   console.log(tradeId)
  //   return this.httpClient.get(APIURL + 'Pharmacy/' + tradeId)
  // }

  // /** get All manufacturer **/
  // getAllManufacturer() {
  //   return this.httpClient.get(APIURL + 'Manufacturer');
  // }

  // /** get all vendors **/
  // getAllVendors() {
  //   return this.httpClient.get(APIURL + 'Vendor');
  // }

}
