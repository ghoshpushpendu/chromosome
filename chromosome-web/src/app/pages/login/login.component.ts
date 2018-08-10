import { Component, OnInit } from '@angular/core';

declare var $;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.validate();
  }

  validate() {
    $('.ui.form')
      .form({
        on: 'blur',
        fields: {
          fname: 'empty',
          lname: 'empty',
          email: 'email',
          check: 'checked'
        },
        onSuccess: function (event, fields) {
          event.preventDefault();
        }
      })
  }

  submit() {
    let isFormValid = $('.ui.form').form("is valid");
    if (isFormValid){

    }else{

    }
  }

}
