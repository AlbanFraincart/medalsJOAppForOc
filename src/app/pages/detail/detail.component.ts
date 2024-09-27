import { Component, OnInit } from '@angular/core';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  countryData: OlympicCountry | null = null;
  lineChartData: any[] = [];
  totalEntries: number = 0;
  totalMedals: number = 0;
  totalAthletes: number = 0;

  view: [number, number] = [700, 400];
  public colorScheme = 'cool';
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Année';
  showYAxisLabel = true;
  yAxisLabel = 'Médailles';
  autoScale = false;
  yScaleMin = 0;
  yScaleMax = 200;


  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const state = history.state as { countryData: OlympicCountry };

    if (state && state.countryData) {
      this.countryData = state.countryData;
      this.prepareLineChartData();
      this.calculateTotals();

    } else {
      // Si les données ne sont pas disponibles 
      // const countryId = +this.route.snapshot.paramMap.get('id')!;
      // voir pour mettre service en secours
      // this.olympicService.getCountryById(countryId).subscribe(country => {
      //   this.countryData = country;
      //   this.prepareLineChartData();
      // this.calculateTotals();
      // });

      console.log('Aucune donnée de pays disponible');
      this.router.navigate(['/']);
    }
  }

  prepareLineChartData(): void {
    if (this.countryData) {
      this.lineChartData = [
        {
          name: this.countryData.country,
          series: this.countryData.participations.map((participation) => ({
            name: participation.year.toString(),
            value: participation.medalsCount,
          })),
        },
      ];
    }
  }

  calculateTotals(): void {
    if (this.countryData) {
      this.totalEntries = this.countryData.participations.length;
      this.totalMedals = this.countryData.participations.reduce(
        (sum, participation) => sum + participation.medalsCount,
        0
      );
      this.totalAthletes = this.countryData.participations.reduce(
        (sum, participation) => sum + participation.athleteCount,
        0
      );
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
