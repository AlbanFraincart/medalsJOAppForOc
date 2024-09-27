import { Component, OnInit } from '@angular/core';
import { OlympicCountry } from 'src/app/core/models/Olympic';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],

})
export class DetailComponent implements OnInit {
  countryData: OlympicCountry | null = null;

  ngOnInit(): void {
    const state = history.state as { countryData: OlympicCountry };

    if (state && state.countryData) {
      this.countryData = state.countryData;
      console.log('Données du pays:', this.countryData);
    } else {
      console.log('Aucune donnée de pays disponible');
    }
  }
}
