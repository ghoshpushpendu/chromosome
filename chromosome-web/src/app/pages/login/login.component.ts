import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../providers/auth.service';
import { Router } from '@angular/router';

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
    email: '',
    fname: '',
    lname: '',
    password: ''
  };

  public loading: boolean = false;
  public messages: any = [];
  public message_type: string = '';

  constructor(public auth: AuthService, public router: Router) {
    // if got user
    if (sessionStorage.getItem("user")) {
      this.router.navigate(["/create"]);
      // this.authState.state = "logged_in";
      // this.messages = [];
      // this.messages.push("You are loggied in");
      // this.message_type = 'success';
    }
  }

  ngOnInit() {

  }

  /** veirfy and validate email adreess and check if user exists with this email or not **/
  verifyEmail() {
    let _base = this;

    // no email
    if (this.user.email.trim() == "") {
      _base.messages = [];
      _base.messages.push("Email can not be empty");
      _base.message_type = 'warning';
      return;
    } else if (!this.validateEmail(this.user.email)) {
      _base.messages = [];
      _base.messages.push("Not a valid email format");
      _base.message_type = 'warning';
      return;
    }

    _base.loading = true;


    this.auth.validateEmail(this.user.email)
      .then((success: any) => {
        let isValid = success.smtp_check;
        if (isValid) {

          //check if user exists
          _base.auth.verifyEmail(this.user.email)
            .then((success: any) => {
              // console.log(success.exists);
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

    // validate data
    if (this.user.fname.trim() == "") {
      _base.messages = [];
      _base.messages.push("First name can not be empty");
      _base.message_type = 'warning';
      return;
    } else if (this.user.lname.trim() == "") {
      _base.messages = [];
      _base.messages.push("Last name can not be empty");
      _base.message_type = 'warning';
      return;
    } else if (this.user.password.trim() == "") {
      _base.messages = [];
      _base.messages.push("Password can not be empty");
      _base.message_type = 'warning';
      return;
    }

    _base.loading = true;
    _base.auth.registerUser(_base.user)
      .then((user) => {
        _base.messages = [];
        _base.messages.push("registered successfully");
        _base.message_type = 'success';
        _base.loading = false;
        _base.authState.state = "email_validity";
        _base.user.password = "";
      }, (error) => {
        _base.messages = [];
        _base.messages.push("Please fill all the fields and try again");
        _base.message_type = 'error';
        _base.loading = false;
      });
  }


  //authenticate user with provided data
  authenticateUser() {
    let _base = this;

    if (this.user.password.trim() == "") {
      _base.messages = [];
      _base.messages.push("Password can not be empty");
      _base.message_type = 'warning';
      return;
    }

    _base.loading = true;
    _base.auth.authenticateUser(_base.user)
      .then((user: any) => {
        _base.loading = false;
        if (user.exists) {
          _base.messages = [];
          _base.messages.push("You have loggied in");
          _base.message_type = 'success';
          _base.authState.state = "logged_in";
          // set data to local storage
          sessionStorage.setItem("user", _base.user.email);
          this.router.navigate(['/create']);
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

  //validate email
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

}
