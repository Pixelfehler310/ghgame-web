import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ghg-upload-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overlay" role="dialog" aria-modal="true">
      <div class="sheet">
        <div class="header flex align-items-center justify-content-between">
          <h3 class="m-0">Bild hochladen</h3>
          <button class="p-button p-component p-button-text" (click)="cancel.emit()">
            Schließen
          </button>
        </div>
        <div class="content">
          <input type="file" (change)="onSelect($event)" [accept]="acceptAttr" />
          <div class="mt-3" *ngIf="error" style="color: var(--red-400,#ff5a5a)">{{ error }}</div>
          <div class="preview mt-3 border-round" *ngIf="previewUrl">
            <img [src]="previewUrl" alt="Vorschau" />
          </div>
        </div>
        <div class="footer mt-3">
          <button
            class="p-button p-component p-button-primary w-full"
            (click)="emitSave()"
            [disabled]="!file"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: flex-end;
        justify-content: center;
      }
      .sheet {
        width: 100%;
        max-width: 720px;
        background: var(--surface-0, #1a1f29);
        color: var(--text-color, #e6e6e6);
        padding: 1rem;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
      }
      .preview {
        width: 100%;
        aspect-ratio: 1 / 1;
        background: var(--surface-100, #2a2f3a);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .preview img {
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        display: block;
      }
    `,
  ],
})
export class UploadModalComponent {
  @Input() accept: string[] = ['image/png', 'image/jpeg'];
  @Input() maxSizeMB = 5;
  @Output() save = new EventEmitter<File>();
  @Output() cancel = new EventEmitter<void>();

  file: File | null = null;
  previewUrl: string | null = null;
  error: string | null = null;

  get acceptAttr() {
    return this.accept.join(',');
  }

  onSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    const f = input.files && input.files[0];
    this.error = null;
    if (!f) {
      this.file = null;
      this.previewUrl = null;
      return;
    }
    if (!this.accept.includes(f.type)) {
      this.error = 'Ungültiger Dateityp';
      this.file = null;
      this.previewUrl = null;
      return;
    }
    if (f.size > this.maxSizeMB * 1024 * 1024) {
      this.error = `Datei zu groß (max. ${this.maxSizeMB} MB)`;
      this.file = null;
      this.previewUrl = null;
      return;
    }
    this.file = f;
    this.previewUrl = URL.createObjectURL(f);
  }

  emitSave() {
    if (this.file) this.save.emit(this.file);
  }
}
