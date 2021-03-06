import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { WebClient, ClientState } from '../client';
import { SoundManager } from '../sound';
import { DecksService } from 'app/decks.service';
import { AuthenticationService } from '../user/authentication.service';


const feedbackBody = 'Please write about any bugs, suggestions, etc that came to mind while playing the game.';

@Component({
  selector: 'ccg-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {
  public feedbackUrl = `mailto:william.ritson@gmail.com?subject=Card Game Feedback&body=${feedbackBody}`;

  constructor(
    private router: Router,
    public client: WebClient,
    public decks: DecksService,
    public soundManager: SoundManager,
    public auth: AuthenticationService
  ) {
    if (client.getState() !== ClientState.UnAuth && client.getState() !== ClientState.Waiting)
      client.returnToLobby();
  }

  public join() {
    this.client.join();
  }

  public fullscreen() {
    let fsRequester: any = document.documentElement;
    if (fsRequester.mozRequestFullScreen) {
      fsRequester.mozRequestFullScreen();
    } else if (fsRequester.webkitRequestFullScreen) {
      fsRequester.webkitRequestFullScreen();
    } else if (fsRequester.requestFullscreen) {
      fsRequester.requestFullscreen();
    }
  }

  public showMultiplayer() {
    return this.client.isConnected();
  }

  public inLobby() {
    return this.client.getState() === ClientState.InLobby;
  }

  @HostListener('window:beforeunload')
  public exit() {
    if (this.client.getState() === ClientState.InQueue)
      this.client.leaveQueue();
    this.client.exitGame(true);
    return null;
  }

  ngOnInit() { }

  public getState() {
    if (!this.client)
      return 0;
    return this.client.getState();
  }

}

