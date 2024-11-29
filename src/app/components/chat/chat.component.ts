import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Friend {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastMessage: string;
}

interface Message {
  id: number;
  content: string;
  timestamp: Date;
  isSent: boolean;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {

  friends: Friend[] = [
    {
      id: 1,
      name: "John Doe",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      status: "online",
      lastMessage: "Hey, how are you?"
    },
    {
      id: 2,
      name: "Jane Smith",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      status: "away",
      lastMessage: "See you tomorrow!"
    },
    {
      id: 3,
      name: "Mike Johnson",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      status: "offline",
      lastMessage: "Thanks for your help"
    }
  ];

  messages: Message[] = [
    {
      id: 1,
      content: "Hey, how are you?",
      timestamp: new Date(Date.now() - 3600000),
      isSent: false
    },
    {
      id: 2,
      content: "I'm doing great, thanks! How about you?",
      timestamp: new Date(Date.now() - 3000000),
      isSent: true
    },
    {
      id: 3,
      content: "Pretty good! Working on some new projects.",
      timestamp: new Date(Date.now() - 2400000),
      isSent: false
    }
  ];

  filteredFriends: Friend[] = [];
  selectedFriend: Friend | null = null;
  searchQuery: string = "";
  newMessage: string = "";

  ngOnInit() {
    this.filteredFriends = this.friends;
  }

  filterFriends() {
    this.filteredFriends = this.friends.filter(friend =>
      friend.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  selectFriend(friend: Friend) {
    this.selectedFriend = friend;
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const message: Message = {
      id: this.messages.length + 1,
      content: this.newMessage,
      timestamp: new Date(),
      isSent: true
    };

    this.messages.push(message);
    this.newMessage = "";
  }
}
