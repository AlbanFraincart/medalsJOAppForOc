import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public olympics$: Observable<OlympicCountry[] | null> | undefined;
  public chartData: any[] = [];
  public view: [number, number] = [700, 400];
  public colorScheme = 'cool';
  private subscription: Subscription = new Subscription();
  public totalCountries: number = 0;
  public totalMedals: number = 0;
  public totalOlympics: number = 0;
  private allData: OlympicCountry[] = [];

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe((olympics) => {
      if (olympics) {
        this.allData = olympics;
        this.prepareChartData(olympics);
        this.calculateTotals(olympics);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  prepareChartData(olympics: OlympicCountry[]): void {
    this.chartData = olympics.map((country) => {
      console.log('country', country);
      const totalMedals = country.participations.reduce(
        (sum, participation) => sum + participation.medalsCount,
        0
      );
      return {
        name: country.country,
        value: totalMedals,
        id: country.id, // for navigation
      };
    });
  }

  onSelect(data: any): void {
    const country = this.allData.find(
      (country) => country.country === data.name
    );
    if (country) {
      this.router.navigate(['/country', country.id], {
        state: { countryData: country },
      });
    }
  }

  calculateTotals(olympics: OlympicCountry[]): void {
    this.totalCountries = olympics.length;
    this.totalMedals = olympics.reduce((sum, country) => {
      return (
        sum +
        country.participations.reduce(
          (countrySum, participation) => countrySum + participation.medalsCount,
          0
        )
      );
    }, 0);

    this.totalOlympics = olympics.reduce((sum, country) => {
      console.log('country', country);
      console.log('sum', sum);
      return sum + country.participations.length;
    }, 0);
  }
}
