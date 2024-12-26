import { Component, OnInit } from '@angular/core';
import { UserCardComponent } from "../user-card/user-card.component";
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';
import { friend } from '../../interfaces/friend';
import { AuthService } from '../../services/auth.service';
import { FriendService } from '../../services/friend.service';
import { FriendItemComponent } from '../friend-item/friend-item.component';
import { FriendResponse } from '../../interfaces/friend-response';
import { UserResponse } from '../../interfaces/user-response';

@Component({
  selector: 'app-friend',
  standalone: true,
  imports: [UserCardComponent, FriendItemComponent],
  templateUrl: './friend.component.html',
  styleUrl: './friend.component.css'
})
export class FriendComponent implements OnInit {
  friends: FriendResponse[] = [];
  notFriends: UserResponse[] = [];
  pendingRequests: FriendResponse[] = [];
  
  constructor(private friendService: FriendService, private userService: UserService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadFriends();
    this.loadNotFriends();
    this.loadPendingRequests();
  }

  loadFriends(): void {
    this.friendService.getFriends().subscribe(data => {
      this.friends = data;
    });
  }

  loadNotFriends(): void {
    this.friendService.getNotFriends().subscribe(data => {
      this.notFriends = data;
    });
  }

  loadPendingRequests(): void {
    this.friendService.getPendingRequests().subscribe(data => {
      this.pendingRequests = data;
    });
  }

  sendFriendRequest(friendId: number): void {
    this.friendService.sendFriendRequest(friendId).subscribe(() => {
      alert('Friend request sent!');
      this.loadNotFriends();
    });
  }

  respondToRequest(requestId: number, response: string): void {
    this.friendService.respondToRequest(requestId, response).subscribe(() => {
      alert(`Friend request ${response}`);
      this.loadPendingRequests();
      this.loadFriends();
    });
  }
}
