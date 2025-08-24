import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ghg-item-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hero">
      <div class="image border-round">
        <img [src]="imageUrl || placeholder" [alt]="name || 'Item'" />
      </div>
      <h2 class="title">{{ name || 'Item Name' }}</h2>
    </div>
  `,
  styles: [
    `
      .hero {
        text-align: center;
      }
      .image {
        width: min(70vw, 420px);
        aspect-ratio: 1 / 1;
        margin: 0 auto 0.75rem;
        background: var(--surface-50, #1a1f29);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      img {
        width: 90%;
        height: 90%;
        object-fit: contain;
        display: block;
      }
      .title {
        margin: 0;
        font-weight: 700;
      }
    `,
  ],
})
export class ItemHeroComponent {
  @Input() imageUrl?: string;
  @Input() name?: string;
  placeholder = 'https://picsum.photos/seed/item-hero/512';
}
