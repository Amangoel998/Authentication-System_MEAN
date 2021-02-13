import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../../services/server.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  err: string = '';
  form: any;
  constructor(private server: ServerService, private router: Router) {}
  ngOnInit(): void {
    this.server.checkLogin();
    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.email,
        Validators.required,
        Validators.pattern(
          /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i
        ),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  submit() {
    let result: any;
    if (this.form.valid) {
      try {
        result = this.server.login(this.form.value);
      } catch (err) {
        this.err = 'Invalid Credentials';
      }
    } else this.err = 'Form is Invalid';
    if (result?.error) this.err = result.error;
    else if (result?.message) {
      this.router.navigate(['/home']);
    }
  }
  gotoRegister() {
    this.router.navigate(['/register']);
  }
}
