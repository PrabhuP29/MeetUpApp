import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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
  constructor(private accountService: AccountService, private toastr: ToastrService) { }

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
      this.toastr.error(error.error);
    });
  }

  cancel(){
    this.cancelRegister.emit(false);
    this.emitName.emit(this.name);
  }

}
