import { Component } from '@angular/core';
import {HomeComponent} from "../../components/home/home.component";
import {LoginComponent} from "../../components/login/login.component";
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-default-layout',
  standalone: true,
    imports: [
        HomeComponent,
        LoginComponent
    ],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.css'
})
export class DefaultLayoutComponent {

  constructor(private authService: AuthService) { }

  loggedIn(): boolean {
    return this.authService.loggedIn();
  }

}
