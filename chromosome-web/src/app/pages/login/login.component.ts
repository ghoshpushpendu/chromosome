import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../providers/auth.service';

declare var $;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public authState = {
    state: 'email_validity',
    user: {}
  };

  public user = {
    email: 'contactpushpendu@gmail.com',
    fname: '',
    lname: '',
    password: ''
  };

  public loading: boolean = false;
  public messages: any = [];
  public message_type: string = '';

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

  /** veirfy and validate email adreess and check if user exists with this email or not **/
  verifyEmail() {
    let _base = this;
    _base.loading = true;
    this.auth.validateEmail(this.user.email)
      .then((success: any) => {
        let isValid = success.smtp_check;
        if (isValid) {

          //check if user exists
          _base.auth.verifyEmail(this.user.email)
            .then((success: any) => {
              console.log(success.exists);
              _base.loading = false;

              //qualify user existance
              if (success.exists) {
                _base.authState.state = "get_password";
                _base.messages = [];
                _base.messages.push("User already exists. Provide password and login");
                _base.message_type = 'success';
              } else {
                _base.authState.state = "basic_info";
                _base.messages = [];
                _base.messages.push("No user found. Provide info to register");
                _base.message_type = 'info';
              }

            }, (error) => {
              _base.loading = false;
              _base.messages = [];
              _base.messages.push("System error. Please try again");
              _base.message_type = 'error';
            });

        } else {
          _base.loading = false;
          _base.messages = [];
          _base.messages.push("This is not a valid email");
          _base.message_type = 'error';
        }
      }, (error) => {
        _base.loading = false;
        _base.messages = [];
        _base.messages.push("System error. Please try again");
        _base.message_type = 'error';
      });
  }

  // register user with provided data
  registerUser() {
    let _base = this;
    _base.loading = true;
    _base.auth.registerUser(_base.user)
      .then((user) => {
        _base.messages = [];
        _base.messages.push("registered successfully");
        _base.message_type = 'success';
        _base.loading = false;
      }, (error) => {
        _base.messages = [];
        _base.messages.push(error.error.error.message);
        _base.message_type = 'error';
        _base.loading = false;
      });
  }


  //authenticate user with provided data
  authenticateUser() {
    let _base = this;
    _base.loading = true;
    _base.auth.authenticateUser(_base.user)
      .then((user: any) => {
        _base.loading = false;
        if (user.exists) {
          _base.messages = [];
          _base.messages.push("You have loggied in");
          _base.message_type = 'success';
          _base.authState.state = "logged_in";
        } else {
          _base.messages = [];
          _base.messages.push("No user exists");
          _base.message_type = 'error';
        }
      }, (error) => {
        _base.messages = [];
        _base.messages.push(error.error.error.message);
        _base.message_type = 'error';
        _base.loading = false;
      });
  }

}
