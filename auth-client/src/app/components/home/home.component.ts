import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  user: any;
  constructor(private server: ServerService) {
    this.server.checkLogin();
  }
  ngOnInit(): void {
    const res: string = String(localStorage.getItem('id_token'));
    this.user = this.server.parseJwt(JSON.parse(res)?.token)?.user;
  }
}
