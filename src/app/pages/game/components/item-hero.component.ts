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
        padding: 0.5rem;
      }
      .image {
        /* smaller media on all screens */
        width: min(50vw, 300px);
        aspect-ratio: 1 / 1;
        margin: 0 auto 0.75rem;
        background: var(--panel, #1a1f29);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(148, 163, 184, 0.2);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
      }
      img {
        /* image inside slightly smaller to reduce visual dominance */
        width: 80%;
        height: 80%;
        object-fit: contain;
        display: block;
      }
      .title {
        margin: 0;
        font-weight: 700;
        /* larger associated text */
        font-size: clamp(1.1rem, 2.2vw, 1.5rem);
        color: var(--text);
        letter-spacing: 0.02em;
      }
    `,
  ],
})
export class ItemHeroComponent {
  @Input() imageUrl?: string;
  @Input() name?: string;
  placeholder = 'https://picsum.photos/seed/item-hero/512';
}
