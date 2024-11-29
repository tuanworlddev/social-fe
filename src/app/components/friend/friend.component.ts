import { Component, OnInit } from '@angular/core';
import { UserCardComponent } from "../user-card/user-card.component";
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';
import { friend } from '../../interfaces/friend';
import { AuthService } from '../../services/auth.service';
import { FriendService } from '../../services/friend.service';
import { FriendItemComponent } from '../friend-item/friend-item.component';

@Component({
  selector: 'app-friend',
  standalone: true,
  imports: [UserCardComponent, FriendItemComponent],
  templateUrl: './friend.component.html',
  styleUrl: './friend.component.css'
})
export class FriendComponent implements OnInit {
  friends: friend[] = [];
  users: User[] = [];

  constructor(private friendService: FriendService, private userService: UserService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userService.getAllUser().subscribe((response) => {
      this.users = response.data;

      this.authService.getCurrentUser().subscribe((currentUser) => {
        if (currentUser) {

          this.friendService.getAllFriends().subscribe((response) => {
            this.friends = response.data;
            console.log(this.friends);
            

            this.users = this.users.filter(
              (user) =>
                user.id !== currentUser.id &&
                !this.friends.some((friend) => friend.friend.id === user.id)
            );
            console.log("Filtered Users:", this.users);
          });
        }
      });
    });
  }

}
