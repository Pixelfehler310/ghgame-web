import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'ghg-avatar-preview',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `
    <p-card header="Avatar Preview">
      <img [src]="url" alt="avatar" style="max-width: 128px; border-radius: 8px;" />
    </p-card>
  `,
})
export class AvatarPreviewComponent {
  @Input() url: string | undefined;
}
