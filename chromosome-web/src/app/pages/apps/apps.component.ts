import { Component, OnInit } from '@angular/core';
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
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.css'],
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
export class AppsComponent implements OnInit {

  public userState: any = 'hidden';

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

  public apps: any = [];

  public loading: boolean = false;

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
      this.getallapps();
    }
  }

  /** fetch all apps of the current user **/
  getallapps() {
    let _base = this;
    _base.loading = true;
    _base.app.getApps(_base.user.email)
      .then(function (success) {
        console.log(success);
        _base.loading = false;
        _base.apps = success;
      }, function (error) {
        _base.loading = false;
        _base.showError("Can not fetch app list")
      });
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

  showSuccess(message: string) {
    this.toastr.success(message, 'SUCCESS');
  }

  showError(message: any) {
    this.toastr.warning(message, 'ERROR');
  }

  openModal() {
    $('.ui.mini.modal')
      .modal('show');
  }

  closemodal() {
    $('.ui.mini.modal')
      .modal('hide');
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
                _base.getallapps(); // fetch apps list
                _base.closemodal();
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

  /** delete an app **/
  deleteapp(appid: string) {
    let _base = this;
    _base.app.deleteApp(appid)
      .then(function (success) {
        _base.getallapps();
      }, function (error) {

      });
  }

}

