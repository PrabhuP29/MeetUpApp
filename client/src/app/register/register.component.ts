import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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
  registerForm: FormGroup;
  maxDate: Date;
  validationErrors: string[] = [];

  constructor(private accountService: AccountService, private toastr: ToastrService,
    private fb:FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeForm(){
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['',[Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    })

    this.registerForm.controls.password.valueChanges.subscribe(() =>{
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    })
  }

  matchValues(matchTo: string):ValidatorFn{
    return (control: AbstractControl)=>{
      return control?.value === control?.parent?.controls[matchTo].value?null:{isMatching: true};
    }
  }

  register(){
    // console.log(this.registerForm.value);
    this.accountService.Register(this.registerForm.value).subscribe(response=>{
      //this.name = response.username;
      //console.log(response);
      //this.cancel();
      this.router.navigateByUrl('/members');
    },
    error=>{
      console.log(error);
      //this.toastr.error(error.error);
      this.validationErrors = error;
    });
  }

  cancel(){
    this.cancelRegister.emit(false);
    this.emitName.emit(this.name);
  }

}
