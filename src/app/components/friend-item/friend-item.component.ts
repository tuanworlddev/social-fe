import { Component, input } from '@angular/core';
import { User } from '../../interfaces/user';
import { friend } from '../../interfaces/friend';
import { FriendService } from '../../services/friend.service';

@Component({
  selector: 'app-friend-item',
  standalone: true,
  imports: [],
  templateUrl: './friend-item.component.html',
  styleUrl: './friend-item.component.css'
})
export class FriendItemComponent {
  friend = input.required<friend>();

  constructor(private friendService: FriendService) { }

  confrimFriend(friendId: number) {
    this.friendService.confirmFriend(friendId).subscribe((response) => {
      console.log(response);
    });
  }
}
