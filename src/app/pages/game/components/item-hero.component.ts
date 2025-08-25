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
        width: min(62vw, 360px);
        aspect-ratio: 1 / 1;
        margin: 0 auto 0.75rem;
        background: var(--surface-50, #1a1f29);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      img {
        width: 88%;
        height: 88%;
        object-fit: contain;
        display: block;
      }
      .title {
        margin: 0;
        font-weight: 700;
        font-size: 1rem;
      }
    `,
  ],
})
export class ItemHeroComponent {
  @Input() imageUrl?: string;
  @Input() name?: string;
  placeholder = 'https://picsum.photos/seed/item-hero/512';
}
