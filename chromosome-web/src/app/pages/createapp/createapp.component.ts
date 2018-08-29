import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-createapp',
  templateUrl: './createapp.component.html',
  styleUrls: ['./createapp.component.css']
})
export class CreateappComponent implements OnInit {

  public email:string = "";

  constructor() { }

  ngOnInit() {
     this.email = sessionStorage.getItem("user");
  }

}
