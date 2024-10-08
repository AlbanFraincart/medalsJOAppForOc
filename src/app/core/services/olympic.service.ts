import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { OlympicCountry } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  // URL for the Olympic data (fake api for now)
  private olympicUrl = './assets/mock/olympic.json';

  // Cache for the Olympic data, shared across multiple subscribers
  private olympicsCache$: Observable<OlympicCountry[]> | null = null;

  constructor(private http: HttpClient) {}

  /**
   Loads the initial Olympic data.
   If the data has already been loaded, it returns the cached version.
   Otherwise, it fetches the data from the provided URL.
   */
  loadInitialData(): Observable<OlympicCountry[]> {
    if (this.olympicsCache$) {
      return this.olympicsCache$;
    }

    // Fetch the data from the API and cache it using shareReplay
    this.olympicsCache$ = this.http.get<OlympicCountry[]>(this.olympicUrl).pipe(
      tap((data) => {
        console.log("Données chargées depuis l'API:", data);
      }),
      // Caches the latest value and shares it with future subscribers
      shareReplay(1),
      // Handles any errors that occur
      catchError((error) => this.handleError(error))
    );

    return this.olympicsCache$;
  }

  // Retrieves a specific country by its ID.
  getCountryById(id: number): Observable<OlympicCountry | null> {
    return this.loadInitialData().pipe(
      map((countries: OlympicCountry[]) => {
        const country = countries.find((c) => c.id === id);
        if (!country) {
          // If no country is found, throw an error
          throw new Error(`Le pays avec l'ID ${id} est introuvable.`);
        }
        return country;
      }),
      // Handle any errors that occur during the process
      catchError((error) => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';

    console.error(
      `Erreur de serveur, code : ${error.status}, ` +
        `message : ${error.message}`
    );

    // Customize error messages based on the status code
    switch (error.status) {
      case 404:
        errorMessage = 'Les données olympiques sont introuvables (404).';
        break;
      case 500:
        errorMessage = 'Une erreur de serveur est survenue (500).';
        break;
      case 403:
        errorMessage = 'Accès refusé (403).';
        break;
      default:
        errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
    }

    // Return the formatted error message
    return throwError(() => new Error(errorMessage));
  }
}
