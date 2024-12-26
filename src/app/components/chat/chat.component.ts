import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FriendResponse } from '../../interfaces/friend-response';
import { FriendService } from '../../services/friend.service';
import { Message } from '../../interfaces/message';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';
import { WebSocketService } from '../../services/web-socket.service';

// interface Friend {
//   id: number;
//   name: string;
//   avatar: string;
//   status: 'online' | 'offline' | 'away';
//   lastMessage: string;
// }

// interface Message {
//   id: number;
//   content: string;
//   timestamp: Date;
//   isSent: boolean;
// }

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  user?: User;
  friends: FriendResponse[] = [];
  messages: Message[] = [];
  filteredFriends: FriendResponse[] = [];
  selectedFriend: FriendResponse | null = null;
  searchQuery: string = "";
  newMessage: string = "";

  constructor (private authService: AuthService, private friendService: FriendService, private messageService: MessageService, private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.user = user;
      }
    });
    this.friendService.getFriends().subscribe((friends => {
      this.friends = friends;
      this.filteredFriends = this.friends;
    }));
    this.webSocketService.messageSubject.subscribe(response => {
      const message = JSON.parse(response);
      if (this.selectedFriend?.friend.id === message.senderId) {
        this.messages.push(message);
        this.scrollToBottom();
      }
    });
    this.webSocketService.userStatusSubject.subscribe((response) => {
      const userStatus = JSON.parse(response);
      const friend = this.friends.find(friend => friend.friend.id === userStatus.userId);
      if (friend) {
        friend.friend.status = userStatus.status;
      }
    });
  }


  filterFriends() {
    this.filteredFriends = this.friends.filter(friend =>
      friend.friend.fullName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  selectFriend(friend: FriendResponse) {
    this.selectedFriend = friend;
    this.loadMessages();
  }

  loadMessages(): void {
    this.messageService.getMessages(this.user!.id, this.selectedFriend!.friend.id).subscribe((data) => {
      this.messages = data;
      this.scrollToBottom();
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.messageService.sendMessage(this.user!.id, this.selectedFriend!.friend.id, this.newMessage).subscribe((message) => {
        this.messages.push(message);
        this.newMessage = '';
        this.scrollToBottom();
      });
    }
  }

  scrollToBottom(): void {
    setTimeout(() => {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    }, 10);
  }
}
