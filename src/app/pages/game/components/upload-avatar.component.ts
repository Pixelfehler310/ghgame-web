import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'ghg-upload-avatar',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `
    <p-card header="Avatar" subheader="Upload an image" [style]="{ marginBottom: '1rem' }">
      <div class="flex align-items-center gap-2">
        <input
          type="file"
          (change)="onFileSelected($event)"
          accept="image/*"
          [disabled]="loading"
        />
        <small class="text-500">Selecting a file uploads automatically</small>
      </div>
    </p-card>
  `,
})
export class UploadAvatarComponent {
  @Input() loading = false;
  @Output() select = new EventEmitter<File>();
  @Output() upload = new EventEmitter<File>();

  protected file: File | null = null;

  onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    this.file = input.files && input.files.length ? input.files[0] : null;
    if (this.file) {
      // emit select for parent state and immediately trigger upload (no explicit button)
      this.select.emit(this.file);
      this.upload.emit(this.file);
    }
  }
}
