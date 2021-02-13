import { Component } from '@angular/core';
import { ServerService } from './services/server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Authentication Client App';
  constructor(private server: ServerService){}
  public logOff(){
    this.server.logout()
  }
  get isLogged(){
    return this.server.isLoggedIn
  }
}
