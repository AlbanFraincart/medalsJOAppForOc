import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { OlympicCountry } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympicsCache$: Observable<OlympicCountry[]> | null = null;

  constructor(private http: HttpClient) {}

  loadInitialData(): Observable<OlympicCountry[]> {
    if (this.olympicsCache$) {
      return this.olympicsCache$;
    }

    this.olympicsCache$ = this.http.get<OlympicCountry[]>(this.olympicUrl).pipe(
      tap((data) => {
        console.log("Données chargées depuis l'API:", data);
      }),
      shareReplay(1),
      catchError((error) => this.handleError(error))
    );

    return this.olympicsCache$;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';

    console.error(
      `Erreur de serveur, code : ${error.status}, ` +
        `message : ${error.message}`
    );

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

    return throwError(() => new Error(errorMessage));
  }
}
