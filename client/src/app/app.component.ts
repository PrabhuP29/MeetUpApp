import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from './_models/User';
import { AccountService } from './_Services/account.service';
import { PresenceService } from './_Services/presence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'The MeetUp App';
  users: any;

  constructor( private accountService:AccountService, private presenceService: PresenceService) {}

  ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser(){
    const user:User = JSON.parse(localStorage.getItem('user'));
    if(user){
      this.accountService.setCurrentUser(user);
      this.presenceService.CreateHubConnection(user);
    }
  }

}
