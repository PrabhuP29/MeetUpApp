import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AccountService } from '../_Services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any={};

  constructor(public accountService:AccountService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  login(){
    this.accountService.Login(this.model).subscribe(user => {
      this.router.navigateByUrl('/members')
      console.log(user);
    }, error => {
      console.log(error);
      //this.toastr.error(error.error);
    });
  }

  logout(){
    this.accountService.Logout();
    this.router.navigateByUrl('/')
  }

 }

