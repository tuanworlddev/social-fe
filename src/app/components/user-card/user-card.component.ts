import { Component, input } from '@angular/core';
import { FriendService } from '../../services/friend.service';
import { UserResponse } from '../../interfaces/user-response';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css'
})
export class UserCardComponent {
  user = input.required<UserResponse>();

  constructor(private friendService: FriendService) { }

  sendFriendRequest(friendId: number): void {
    this.friendService.sendFriendRequest(friendId).subscribe(() => {
      alert('Friend request sent!');
    });
  }

}
