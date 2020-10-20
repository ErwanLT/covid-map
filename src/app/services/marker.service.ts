import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import {PopUpService} from './pop-up.service';
import {Data} from '../map/data/data';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  constructor(private http: HttpClient, private popupService: PopUpService) {
  }

  capitals = '/assets/data/capitals.geojson';

  static ScaledRadius(val: number, maxVal: number): number {
    return 20 * (val / maxVal);
  }

  makeCapitalMarkers(map: L.Map, information: Data[]): void {
    this.http.get(this.capitals).subscribe((res: any) => {
      for (const c of res.features) {
        const lat = c.geometry.coordinates[0];
        const lon = c.geometry.coordinates[1];
        const marker = L.marker([lon, lat]);

        for (const d of information){
          if (d.country === c.properties.country){
            c.activeCase = d.active;
            c.totalCase = d.cases;
            c.deaths = d.deaths;
            c.recovered = d.recovered;
          }
        }

        marker.bindPopup(this.popupService.makeCapitalPopup(c));
        marker.addTo(map);
      }
    });
  }
}
