import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { OlympicService } from './core/services/olympic.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public isOnline: boolean = navigator.onLine; // Track online status

  // Inject the OlympicService to handle data loading
  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    // Initial status check
    this.isOnline = navigator.onLine;

    // Listen to online event
    window.addEventListener('online', this.updateOnlineStatus.bind(this));

    // Listen to offline event
    window.addEventListener('offline', this.updateOnlineStatus.bind(this));

    // Use the OlympicService to fetch data when the component initializes
    this.olympicService
      .loadInitialData()
      .pipe(take(1)) // Take only the first emission and automatically complete the observable
      .subscribe({
        // Callback executed when data is successfully loaded
        next: (data) => {
          console.log('Données chargées:', data);
        },
        // Callback executed if an error occurs while fetching data
        error: (err) => {
          console.error('Erreur:', err.message);
        },
      });
  }

  updateOnlineStatus(): void {
    console.log('eeee');
    this.isOnline = navigator.onLine;
  }
}
