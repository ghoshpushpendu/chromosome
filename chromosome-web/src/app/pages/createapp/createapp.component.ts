import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createapp',
  templateUrl: './createapp.component.html',
  styleUrls: ['./createapp.component.css']
})
export class CreateappComponent implements OnInit {

  public email: string = "";
  public password: string = "";

  constructor(public router: Router) { }

  ngOnInit() {
    this.email = sessionStorage.getItem("email");
    this.password = sessionStorage.getItem("password");

    console.log(this.email, this.password);
    if (!this.email || !this.password) {
      this.router.navigate(["/"]);
    }
  }

}
