import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProducerInterval {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export interface ProducerIntervalsResponse {
  min: ProducerInterval[];
  max: ProducerInterval[];
}

export interface AIInteraction {
  id: number;
  timestamp: string;
  tool_name: string;
  skill_name: string;
  prompt: string;
  result: string;
}

export interface AIInteractionsResponse {
  interactions: AIInteraction[];
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  getProducerIntervals(): Observable<ProducerIntervalsResponse> {
    return this.http.get<ProducerIntervalsResponse>('http://localhost:3000/awards/producers/intervals');
  }

  getAIInteractions(): Observable<AIInteractionsResponse> {
    return this.http.get<AIInteractionsResponse>('http://localhost:3000/ai/');
  }
}
