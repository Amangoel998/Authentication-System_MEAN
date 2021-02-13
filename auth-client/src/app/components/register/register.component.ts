import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../../services/server.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form: any;
  @Input() err: string = '';
  constructor(private server: ServerService, private router: Router) {}

  ngOnInit(): void {
    this.initialize();
  }
  initialize() {
    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.email,
        Validators.required,
        Validators.pattern(
          /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i
        ),
      ]),
      fName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      lName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }
  submit() {
    if (this.form.valid)
      this.server.register({
        email: this.form.value['email'],
        password: this.form.value['password'],
        name: this.form.value['fName'] + ' ' + this.form.value['lName'],
      });
    else {
      this.err = 'Form is Invalid';
    }
  }
  gotoLogin() {
    this.router.navigate(['/login']);
  }
}
