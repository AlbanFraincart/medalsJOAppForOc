import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { graphicPieData } from 'src/app/core/models/graphic';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  // Chart data to be displayed
  public chartData: graphicPieData[] = [];

  // Chart dimensions (width, height)
  public view: [number, number] = [700, 400];
  public colorScheme = 'cool';

  // Subscription to handle observables, if multiple asynchronous subscriptions in future, allows easy cleanup
  private subscription: Subscription = new Subscription();

  // Totals for displaying statistics
  public totalCountries: number = 0;
  public totalMedals: number = 0;
  public totalOlympics: number = 0;

  // Holds all the fetched Olympic data
  private allData: OlympicCountry[] = [];

  public isLoading = true;

  // Error message to display in case of an error
  public errorMessage: string | null = null;

  constructor(private olympicService: OlympicService, private router: Router) { }

  ngOnInit(): void {
    // Check if an error message was passed through the router's state
    const state = history.state as { errorMessage?: string };

    if (state && state.errorMessage) {
      this.errorMessage = state.errorMessage;
    }
    this.loadData();
  }

  loadData(): void {
    // Set loading state to true and clear any previous error message
    this.isLoading = true;
    this.errorMessage = null;

    // Subscribe to the Olympic data from the service
    this.subscription.add(
      this.olympicService
        .loadInitialData()
        .pipe(take(1)) // Only take the first emission (auto unsubscribe)
        .subscribe({
          next: (olympics) => {
            this.isLoading = false;
            if (olympics && olympics.length > 0) {
              this.allData = olympics; // Store all fetched data
              this.prepareChartData(olympics); // Prepare the chart data
              this.calculateTotals(olympics); // Calculate totals for display
              this.setChartView(); // Set chart view dimensions
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
    this.subscription.unsubscribe(); // Unsubscribe from all subscriptions to prevent memory leaks
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
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

  /**
    Prepare data to be displayed in the chart
    Maps the Olympic data to the required format for the chart
   */
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

  /**
   * Event handler for selecting a country in the chart
   * Navigates to the detail page of the selected country
   */
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

  //Calculate the total number of countries, medals, and Olympic participations

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
