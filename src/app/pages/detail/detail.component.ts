import { Component, HostListener, OnInit } from '@angular/core';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { ActivatedRoute, Router } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  // Country data for the selected Olympic country
  countryData: OlympicCountry | null = null;

  // Data to be displayed on the line chart
  lineChartData: any[] = [];

  // Total number of entries, medals, and athletes for the country
  totalEntries: number = 0;
  totalMedals: number = 0;
  totalAthletes: number = 0;

  // Chart view dimensions (width, height)
  view: [number, number] = [700, 400];
  // Chart settings for displaying axes, labels, legends, etc.
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

  constructor(
    private router: Router, // Router to navigate between pages
    private route: ActivatedRoute, // To retrieve route parameters (e.g., country ID)
    private olympicService: OlympicService
  ) {}

  // Listener for window resize event to adjust chart size
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setChartView();
  }

  ngOnInit(): void {
    // Retrieve country data from the browser's history state if available
    const state = history.state as { countryData: OlympicCountry };

    if (state && state.countryData) {
      this.countryData = state.countryData;
      this.prepareLineChartData();
      this.calculateTotals();
      this.setChartView();
    } else {
      // If country data is not available, retrieve it by ID from the route parameters
      const countryId = +this.route.snapshot.paramMap.get('id')!;
      this.olympicService.getCountryById(countryId).subscribe({
        next: (country) => {
          this.countryData = country;
          this.prepareLineChartData();
          this.calculateTotals();
          this.setChartView();
        },
        error: (err) => {
          console.error('Erreur lors du chargement des données:', err.message);
          // Redirect to the home page with an error message if data retrieval fails
          this.router.navigate(['/'], {
            state: { errorMessage: err.message },
          });
        },
      });
    }
  }

  // Adjust the chart view dimensions based on window width
  setChartView(): void {
    const width = window.innerWidth; // Get the current window width
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

    // Set the view dimensions (width, height)
    this.view = [chartWidth, chartHeight];
  }

  // Prepare the data for the line chart
  prepareLineChartData(): void {
    if (this.countryData) {
      // Map the country's participation data to a format usable by the chart
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

  // Calculate the totals for entries, medals, and athletes
  calculateTotals(): void {
    if (this.countryData) {
      // Total number of participations (entries)
      this.totalEntries = this.countryData.participations.length;

      // Total number of medals won
      this.totalMedals = this.countryData.participations.reduce(
        (sum, participation) => sum + participation.medalsCount,
        0
      );

      // Total number of athletes participated
      this.totalAthletes = this.countryData.participations.reduce(
        (sum, participation) => sum + participation.athleteCount,
        0
      );
    }
  }

  // Navigate back to the home page
  goBack(): void {
    this.router.navigate(['/']);
  }
}
