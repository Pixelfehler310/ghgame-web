import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import {
  GameState,
  LoadGameResponse,
  SaveGameResponse,
  UploadImageResponse,
} from '../models/game.models';

const API_BASE = 'https://ghgame-backend-fqheahc6b3efb7ek.francecentral-01.azurewebsites.net/api';
const USE_MOCK = true; // toggle to false to hit real backend later

@Injectable({ providedIn: 'root' })
export class GameService {
  private readonly http = inject(HttpClient);

  // simple in-memory mock store using new GameState shape
  private mockDb: Record<string, GameState> = {
    demo123: this.defaultState(),
  };

  private defaultState(): GameState {
    return {
      currentStageIndex: 1,
      inventory: [],
      progress: {},
      lastUpdatedISO: new Date().toISOString(),
    };
  }

  loadGame(id: string): Observable<LoadGameResponse> {
    if (USE_MOCK) {
      const state = this.mockDb[id] ?? this.defaultState();
      return of({ id, state }).pipe(delay(300));
    }
    return this.http.get<LoadGameResponse>(`${API_BASE}/loadGame`, { params: { id } });
  }

  saveGame(state: GameState): Observable<SaveGameResponse> {
    if (USE_MOCK) {
      const id = 'demo123';
      const saved: GameState = { ...state, lastUpdatedISO: new Date().toISOString() };
      this.mockDb[id] = saved;
      return of({ id, state: saved, saved: true }).pipe(delay(300));
    }
    return this.http.post<SaveGameResponse>(`${API_BASE}/saveGame`, state);
  }

  uploadImage(file: File): Observable<UploadImageResponse> {
    if (USE_MOCK) {
      // return a blob URL-like placeholder
      const url = `https://picsum.photos/seed/${encodeURIComponent(file.name)}/128`;
      return of({ url }).pipe(delay(300));
    }
    const form = new FormData();
    form.append('image', file, file.name);
    return this.http.post<UploadImageResponse>(`${API_BASE}/uploadImage`, form);
  }
}
