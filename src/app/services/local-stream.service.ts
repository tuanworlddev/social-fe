import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStreamService {
  private localStream?: MediaStream;

  private constraints = {
    video: true,
    audio: false
  };

  constructor() { }

  async getLocalStream() {
    this.localStream = await navigator.mediaDevices.getUserMedia(this.constraints);
    return this.localStream;
  }

  close() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = undefined;
    }
  }
  
}
