import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user';
import { WebSocketService } from '../../services/web-socket.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  currentUser?: User;

  constructor(private authService: AuthService, private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.currentUser = user;
      }
    });
    this.webSocketService.connect();
  }
}
