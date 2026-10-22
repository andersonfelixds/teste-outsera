import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, ProducerIntervalsResponse, AIInteractionsResponse } from './services/api.service';

@Component({
  imports: [CommonModule],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  intervals: ProducerIntervalsResponse | null = null;
  aiInteractions: AIInteractionsResponse | null = null;
  loading = true;
  error: string | null = null;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    console.log('📡 Fetching producer intervals...');
    this.api.getProducerIntervals().subscribe({
      next: (data) => {
        console.log('✅ Intervals received:', data);
        this.ngZone.run(() => {
          this.intervals = data;
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('❌ Intervals error:', err);
        this.ngZone.run(() => {
          this.error = 'Failed to load producer intervals';
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });

    console.log('📡 Fetching AI interactions...');
    this.api.getAIInteractions().subscribe({
      next: (data) => {
        console.log('✅ AI interactions received:', data);
        this.ngZone.run(() => {
          this.aiInteractions = data;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('❌ AI interactions error:', err);
      }
    });
  }
}
