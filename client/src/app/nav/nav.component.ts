import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_Services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any={};

  constructor(public accountService:AccountService) { }

  ngOnInit(): void {
  }

  login(){
    this.accountService.Login(this.model).subscribe(user => {
      console.log(user);
    }, error => {
      console.log(error);
    });
  }

  logout(){
    this.accountService.Logout();
  }

 }

