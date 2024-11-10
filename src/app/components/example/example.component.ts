import { AfterContentChecked, AfterViewChecked, Component, ElementRef, ViewChild } from '@angular/core';
import { WebSocketService } from '../../services/web-socket.service';
import { FormsModule } from '@angular/forms';
import { Message } from '../../models/message';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './example.component.html',
  styleUrl: './example.component.css'
})
export class ExampleComponent implements AfterViewChecked {
  @ViewChild('messageContainer') messageContainer!: ElementRef;

  messageInput: string = '';
  messages: Message[] = [];

  constructor(private webSocketService: WebSocketService) {
    this.webSocketService.getMessages().subscribe((msg) => {
      this.messages.push({ content: msg, time: new Date() });
      //this.scrollToBottom();
    });
  }

  sendMessage(): void {
    if (this.messageInput.trim()) {
      this.webSocketService.sendMessage(this.messageInput);
      this.messageInput = '';
    }
  }

  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

}
