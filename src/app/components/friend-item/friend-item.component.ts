import { Component, input } from '@angular/core';
import { User } from '../../interfaces/user';
import { friend } from '../../interfaces/friend';
import { FriendService } from '../../services/friend.service';
import { FriendResponse } from '../../interfaces/friend-response';

@Component({
  selector: 'app-friend-item',
  standalone: true,
  imports: [],
  templateUrl: './friend-item.component.html',
  styleUrl: './friend-item.component.css'
})
export class FriendItemComponent {
  friend = input.required<FriendResponse>();

  constructor(private friendService: FriendService) { }

  respondToRequest(requestId: number, response: string): void {
    this.friendService.respondToRequest(requestId, response).subscribe(() => {
    });
  }

  deleteFriend() {
    
  }
}
