import { Component, input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  user = input<User>();

  constructor(private authService: AuthService, private router: Router, private userService: UserService) { }
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
}
