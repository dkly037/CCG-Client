import { Injectable } from '@angular/core';
import { cardList, CardData } from '../game_model/cards/cardList';
import * as uuid from 'uuid';
import { CardType } from '../game_model/card';
import { UnitType } from '../game_model/unit';
import { CollectionService } from '../collection.service';

@Injectable()
export class EditorDataService {
  private static localStorageKey = 'ccg-cards';

  private cards: Array<CardData> = [];

  constructor(
    private collectionService: CollectionService
  ) {
    this.loadData();
    setInterval(() => this.saveData(), 10000);
  }

  public createCard(name: string) {
    const id: string = uuid.v4();
    const data = {
      name: name,
      id: id,
      imageUrl: 'person.png',
      cost: {
        energy: 0,
        synthesis: 0,
        growth: 0,
        decay: 0,
        renewal: 0
      },
      mechanics: [],
      targeter: { id: 'Untargeted', optional: false },
      hostTargeter: { id: 'FriendlyUnit', optional: false  },
      cardType: CardType.Unit,
      life: 1,
      damage: 1,
      power: 1,
      empowerCost: 1,
      type: UnitType.Human
    } as CardData;
    this.cards.push(data);
  }

  public getCard(id: string) {
    return this.cards.find(card => card.id === id);
  }

  public getCards() {
    return this.cards;
  }

  public saveData() {
    localStorage.setItem(EditorDataService.localStorageKey, JSON.stringify({ cards: this.cards }));
    this.addToCollection();
  }

  private loadData() {
    const jsonStr = localStorage.getItem(EditorDataService.localStorageKey);
    if (!jsonStr) return;
    const data = JSON.parse(jsonStr);
    this.cards = data.cards;
    this.addToCollection();
  }

  private addToCollection() {
    for (let card of this.cards) {
      cardList.addFactory(cardList.buildCardFactory(card));
      this.collectionService.getCollection().addCardPlayset(card.id);
    }
  }

}
