import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'The MeetUp App';
  users: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getUser();
  }

  getUser(){
    this.http.get("https://localhost:5001/api/users").subscribe(output=>{
      this.users = output;
    }, error =>{
      console.log(error)
    });
  }
}
