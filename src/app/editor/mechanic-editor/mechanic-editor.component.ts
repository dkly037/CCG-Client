import { Component, OnInit, Input } from '@angular/core';
import { mechanicList, MechanicData } from '../../game_model/cards/mechanicList';
import { SpellData, cardList } from '../../game_model/cards/cardList';
import { Mechanic } from '../../game_model/mechanic';
import { triggerList } from '../../game_model/cards/triggerList';
import { targeterList } from '../../game_model/cards/targeterList';
import { MatSelectChange } from '@angular/material';
import { buildParameters } from '../../game_model/cards/parameters';
import { Card } from '../../game_model/card';

@Component({
  selector: 'ccg-mechanic-editor',
  templateUrl: './mechanic-editor.component.html',
  styleUrls: ['./mechanic-editor.component.scss']
})
export class MechanicEditorComponent {

  public mechanicList = mechanicList;
  @Input() public card: SpellData;

  constructor() {
    // this.mechanics = this.mechanicList.getConstructors(this.card.cardType);
  }

  public changeMechanic(data: MechanicData, event: MatSelectChange) {
    let paramTypes = mechanicList.getParameters(data)
      .map(param => param.type);
    data.parameters = buildParameters(paramTypes, [], cardList).map(param => {
        if (typeof param !== 'function')
          return param;
        const card = param() as Card;
        return card.getDataId();
    });
  }

  public add() {
    let validMechanics = mechanicList.getConstructors(this.card.cardType);
    if (validMechanics.length === 0)
      return;
    this.card.mechanics.push({
      id: validMechanics[0].getId(),
      parameters: [],
      trigger: { id: 'Play' },
      targeter: { id: 'Host', optional: false }
    });
  }

  public delete(index: number) {
    this.card.mechanics.splice(index, 1);
  }

  public setParam(mechanic: MechanicData, i: number, event) {
    if (typeof event === 'object' && event.target)
      mechanic.parameters[i] = event.target.value;
    else
      mechanic.parameters[i] = event;

  }

  public isTriggered(mechanic: MechanicData) {
    return mechanicList.isTriggered(mechanic);
  }

  public isTargeted(mechanic: MechanicData) {
    return mechanicList.isTargeted(mechanic);
  }

  public getTriggerIds() {
    return triggerList.getIds();
  }

  public getTargeterIds() {
    return targeterList.getIds(true);
  }

  public moveUp(index: number) {
    this.swap(index, index - 1);
  }

  public moveDown(index: number) {
    this.swap(index, index + 1);
  }

  private swap(i: number, j: number) {
    const temp = this.card.mechanics[i];
    this.card.mechanics[i] = this.card.mechanics[j];
    this.card.mechanics[j] = temp;
  }
}
