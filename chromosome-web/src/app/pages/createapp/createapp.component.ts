import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../providers/auth.service';
import { AppService } from './../../providers/app.service';
import { ToastrService } from 'ngx-toastr';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

declare var $;

@Component({
  selector: 'app-createapp',
  templateUrl: './createapp.component.html',
  styleUrls: ['./createapp.component.css'],
  animations: [
    trigger('userState', [
      state('visible', style({
        // backgroundColor: '#eee',
        // transform: 'opacity(0)'
        opacity: 1
      })),
      state('hidden', style({
        // backgroundColor: '#cfd8dc',
        // transform: 'opacity(1)'
        opacity: 0
      })),
      transition('visible => hidden', animate('500ms ease-in')),
      transition('hidden => visible', animate('500ms ease-out'))
    ])
  ]
})
export class CreateappComponent implements OnInit {

  public user: any = {
    name: '',
    email: '',
    fname: '',
    lname: ''
  };

  public application = {
    domain: '',
    appname: '',
    description: ''
  };

  public loading: boolean = false;

  public userState: any = 'hidden';

  constructor(public router: Router, public http: AuthService, public app: AppService, private toastr: ToastrService) {
    let _base = this;
    this.user.email = sessionStorage.getItem("email");
    this.user.password = sessionStorage.getItem("password");
    if (!this.user.email || !this.user.password) {
      this.router.navigate(["/"]);
    } else {
      let user = {
        email: this.user.email,
        password: this.user.password
      }

      _base.app.countApps(sessionStorage.getItem("email"))
        .then(function (success: any) {
          if (success.count >= 1) {
            // send to list page
            _base.router.navigate(["apps"]);
          }
        }, function (error) {
          _base.router.navigate(["/"]);
          _base.showError("Can not fetch app list")
        });

      _base.loading = true;
      this.http.getUser(user)
        .then(function (success: any) {
          _base.user = success.user;
          _base.loading = false;
          _base.userState = 'visible';
        }, function (error) {
          _base.loading = false;
          _base.router.navigate(["/"]);
        });
    }
  }

  ngOnInit() {
    $('.ui.form')
      .form({
        fields: {
          domain: {
            identifier: 'domain',
            rules: [
              {
                type: 'empty'
              },
              {
                type: 'regExp',
                value: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/i,
              }
            ]
          },
          appname: {
            identifier: 'appname',
            rules: [
              {
                type: 'empty'
              },
              {
                type: 'regExp',
                value: /^\s*\S+\s*$/i
              }
            ]
          },
          description: {
            identifier: 'description',
            rules: [
              {
                type: 'empty'
              }
            ]
          }
        }
      });
  }

  // logout
  logout() {
    sessionStorage.clear();
    this.router.navigate(["/"]);
  }

  // create app
  createapp() {
    let valid = $('.ui.form').form('is valid')
    if (valid) {
      let appData: any = {};
      appData.name = this.application.appname;
      appData.description = this.application.description;
      appData.appid = this.application.domain.trim() + '.' + this.application.appname.toLocaleLowerCase().trim();
      appData.owner = this.user.email;
      appData.status = "inactive";
      // delete appData.domain;
      let _base = this;
      _base.loading = true;
      _base.app.appexists(appData.appid)
        .then(function (success: any) {
          if (success.count != 1) {
            _base.app.createapp(appData)
              .then(function (success) {
                _base.loading = false;
                _base.showSuccess("App has been created");
              }, function (error) {
                _base.loading = false;
                _base.showError("Can not create app")
              });
          } else {
            _base.loading = false;
            _base.showError("App name has already taken")
          }
        }, function (error) {
          _base.loading = false;
          _base.showError("Can not create app")
        });
    }
  }

  showSuccess(message: string) {
    this.toastr.success(message, 'SUCCESS');
  }

  showError(message: any) {
    this.toastr.warning(message, 'ERROR');
  }

}
