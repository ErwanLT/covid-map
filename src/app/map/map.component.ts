import {Component, AfterViewInit, Input} from '@angular/core';
import * as L from 'leaflet';
import {MarkerService} from '../services/marker.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Data} from './data/data';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  private map;

  informationCovid = [];

  constructor(private markerService: MarkerService, private httpClient: HttpClient) {
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.getCovidData();
  }

  private getCovidData(): void {
    const optionRequete = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      params: new HttpParams()
    };

    this.httpClient.get<any>('https://coronavirus-19-api.herokuapp.com/countries', optionRequete).subscribe((data: Data[]) => {
      console.log(data);
      this.informationCovid = data;
      this.informationCovid.shift();

      this.markerService.makeCapitalMarkers(this.map, this.informationCovid);
    });

  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [48.866667, 2.333333],
      zoom: 4
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

}
