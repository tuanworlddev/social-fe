import { Component, input } from '@angular/core';
import { User } from '../../interfaces/user';
import { FriendService } from '../../services/friend.service';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css'
})
export class UserCardComponent {
  user = input.required<User>();

  constructor(private friendService: FriendService) { }

  addFriend(friendId: number) {
    this.friendService.addFriend(friendId).subscribe((response) => {
      console.log(response);
    });
  }

}
