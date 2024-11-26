import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LocalStreamService } from '../../services/local-stream.service';

@Component({
  selector: 'app-video-call',
  standalone: true,
  imports: [],
  templateUrl: './video-call.component.html',
  styleUrl: './video-call.component.css'
})
export class VideoCallComponent implements OnInit, OnDestroy {
  @ViewChild('localVideo') localVideo!: ElementRef;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef;

  isStarted: boolean = false;
  isSearching: boolean = false;

  constructor(private localStreamService: LocalStreamService) {
  }

  ngOnInit() {
    this.localStreamService.getLocalStream().then(stream => {
      this.localVideo.nativeElement.srcObject = stream;
    });
  }

  ngOnDestroy(): void {
    this.localStreamService.close();
  }

  onChangeStatus() {
    this.isStarted = !this.isStarted;
  }
  
}
