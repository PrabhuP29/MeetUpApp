import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_Services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input() usersFromHomeComponent;
  @Output() cancelRegister = new EventEmitter();
  @Output() emitName = new EventEmitter();
  name: string = '';
  model: any= {};
  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  }

  register(){
    this.accountService.Register(this.model).subscribe(response=>{
      this.name = response.username;
      console.log(response);
      this.cancel();
    },
    error=>{
      console.log(error);
    });
  }

  cancel(){
    this.cancelRegister.emit(false);
    this.emitName.emit(this.name);
  }

}
