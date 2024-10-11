import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DetailComponent } from './pages/detail/detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { OfflineComponent } from './pages/offline/offline.component';

@NgModule({
  declarations: [
    AppComponent, // Root component of the application
    HomeComponent, // Component for the homepage
    NotFoundComponent, // Component for 404 (page not found)
    DetailComponent, // Component for displaying country details
    OfflineComponent, // Component to manage offline status
  ],
  imports: [
    BrowserModule, // Basic module for browser rendering
    AppRoutingModule, // Module for routing between pages
    NgxChartsModule, // Module for rendering charts
    BrowserAnimationsModule, // Support for animations in Angular
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()), // Provides HttpClient with support for interceptors
  ],
  bootstrap: [AppComponent], // Defines the root component that will be bootstrapped
})
export class AppModule { }
