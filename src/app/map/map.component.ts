import {Component, AfterViewInit} from '@angular/core';
import * as L from 'leaflet';
import {MarkerService} from '../services/marker.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Data} from './data/data';
import {ShapeService} from '../services/shape.service';

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

  private countries;

  private population;

  informationCovid = [];

  constructor(private markerService: MarkerService,
              private httpClient: HttpClient,
              private shapeService: ShapeService) {
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
      this.informationCovid = data;
      this.informationCovid.shift();

      this.markerService.makeCapitalMarkers(this.map, this.informationCovid);
      this.shapeService.getCountriesShapes().subscribe(countries => {
        this.countries = countries;
        this.initCountriesLayer();
      });
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

  private initCountriesLayer(): void {

    this.httpClient.get('/assets/data/population.json').subscribe(population => {
      this.population = population;
      for (const pop of this.population) {
        for (const info of this.informationCovid) {
          if (info.country === pop.country) {
            const percentage = (info.active / pop.population) * 100;
            info.pourcentage = percentage || 0;
          }
        }
      }
      const layerGroup = [];

      for (const country of this.countries.features){
        let colorToFill = '#FFFFFF';

        for (const data of this.informationCovid){
          if (data.country === country.properties.ADMIN){
            if (data.pourcentage < 0.2){
              colorToFill = '#6DB65B';
            } else if (data.pourcentage >= 0.2 && data.pourcentage < 0.4) {
              colorToFill = '#206b0b';
            } else if (data.pourcentage >= 0.4 && data.pourcentage < 0.6){
              colorToFill = '#EBBD34';
            } else if (data.pourcentage >= 0.6 && data.pourcentage < 0.8){
              colorToFill = '#b77c36';
            } else if (data.pourcentage >= 0.8 && data.pourcentage < 1){
              colorToFill = '#eb6e34';
            } else if (data.pourcentage > 1 && data.pourcentage < 2){
              colorToFill = '#D13028';
            } else {
              colorToFill = '#700404';
            }

            const countrieLayer = L.geoJSON(country, {
              style: (feature) => ({
                weight: 3,
                opacity: 0.5,
                color: '#008f68',
                fillOpacity: 0.5,
                fillColor: colorToFill
              })
            });

            layerGroup.push(countrieLayer);
          }
        }
      }

      const countries = L.layerGroup(layerGroup);

      const overlayMaps = {
        'Taux de contamination': countries
      };

      L.control.layers(this.map.title, overlayMaps).addTo(this.map);
    });


  }

}
