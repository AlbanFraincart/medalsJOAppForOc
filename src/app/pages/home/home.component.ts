import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public chartData: any[] = [];
  public view: [number, number] = [700, 400];
  public colorScheme = 'cool';
  private subscription: Subscription = new Subscription();
  public totalCountries: number = 0;
  public totalMedals: number = 0;
  public totalOlympics: number = 0;
  private allData: OlympicCountry[] = [];

  public isLoading = true;

  public errorMessage: string | null = null;

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.subscription.add(
      this.olympicService
        .loadInitialData()
        .pipe(take(1))
        .subscribe({
          next: (olympics) => {
            this.isLoading = false;
            if (olympics && olympics.length > 0) {
              this.allData = olympics;
              this.prepareChartData(olympics);
              this.calculateTotals(olympics);
              this.setChartView();
            } else {
              this.errorMessage = 'Aucune donnée disponible.';
            }
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage =
              err.message || 'Une erreur est survenue. Veuillez réessayer.';
          },
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    console.log('event', event);
    this.setChartView();
  }

  setChartView(): void {
    const width = window.innerWidth;
    let chartWidth = 700;
    let chartHeight = 400;

    if (width <= 480) {
      chartWidth = 320;
      chartHeight = 350;
    } else if (width <= 720) {
      chartWidth = 500;
      chartHeight = 350;
    } else {
      chartWidth = 700;
      chartHeight = 400;
    }

    this.view = [chartWidth, chartHeight];
  }

  prepareChartData(olympics: OlympicCountry[]): void {
    this.chartData = olympics.map((country) => {
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
      return sum + country.participations.length;
    }, 0);
  }
}
