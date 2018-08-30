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
    }
  }

  ngOnInit() {
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

}
