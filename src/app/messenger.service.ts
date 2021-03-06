import { Injectable } from '@angular/core';
import { Messenger } from './messenger';
import { AuthenticationService } from './user/authentication.service';

@Injectable()
export class MessengerService {

  private messenger: Messenger = new Messenger();

  constructor(
    auth: AuthenticationService
  ) {
    auth.onAuth(user => {
      if (!user) return;
      this.setMessengerID(user.mpToken);
    });
  }

  private setMessengerID(id: string) {
    this.messenger.setID(id);
  }

  public getMessenger() {
    return this.messenger;
  }

}
