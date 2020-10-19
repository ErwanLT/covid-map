import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  constructor() { }

  makeCapitalPopup(data: any): string {
    return `` +
      `<div><span style="font-weight: bold;">Pays: </span>${ data.properties.country }</div>` +
      `<div><span style="font-weight: bold;">Capitale: </span>${ data.properties.city }</div>` +
      `<div><span style="font-weight: bold;">Cas: </span>${ data.activeCase }</div>` +
      `<div><span style="font-weight: bold;">Mort: </span>${ data.deaths }</div>` +
      `<div><span style="font-weight: bold;">Guéris: </span>${ data.recovered }</div>`;
  }
}
