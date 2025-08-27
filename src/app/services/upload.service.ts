import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { UploadImageResponse } from '../models/game.models';

const API_BASE = 'https://ghgame-backend-fqheahc6b3efb7ek.francecentral-01.azurewebsites.net/api';
const USE_MOCK = false; // toggle to false to hit real backend later

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly http = inject(HttpClient);

  uploadImage(file: File): Observable<UploadImageResponse> {
    if (USE_MOCK) {
      const url = `https://picsum.photos/seed/${encodeURIComponent(file.name)}/256`;
      return of({ url }).pipe(delay(300));
    }
    // Backend expects multipart/form-data with a binary part; map to field name 'image'
    const form = new FormData();
    form.append('image', file, file.name);
    return this.http.post<UploadImageResponse>(`${API_BASE}/uploadImage`, form);
  }
}
