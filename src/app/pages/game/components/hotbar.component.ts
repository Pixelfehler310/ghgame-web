import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryItemDef } from '../../../models/game.models';

type HotbarSlot = { type: 'item'; item?: InventoryItemDef } | { type: 'more'; more: number };

@Component({
  selector: 'ghg-hotbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hotbar shadow-2 p-2" role="listbox" aria-label="Inventarleiste" #container>
      <!-- Hidden measuring slot to get real computed width -->
      <div class="slot border-round measure" aria-hidden="true"></div>
      <div class="slots flex justify-content-center gap-2">
        <ng-container *ngFor="let slot of visibleSlots; let i = index">
          <div
            class="slot border-round"
            role="option"
            [attr.aria-label]="
              slot.type === 'more' ? 'Weitere Items: +' + slot.more : 'Slot ' + (i + 1)
            "
            aria-selected="false"
          >
            <span *ngIf="slot.type === 'item'">{{ slot.item?.name || 'Item' }}</span>
            <span *ngIf="slot.type === 'more'">+{{ slot.more }}</span>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [
    `
      .hotbar {
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        bottom: max(8px, env(safe-area-inset-bottom));
        background: rgba(26, 31, 41, 0.7);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(148, 163, 184, 0.18);
        border-radius: var(--radius-pixel);
        z-index: 30;
      }
      .slots {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem; /* matches gap-2 */
      }
      .slot {
        width: clamp(52px, 6vw, 72px);
        height: clamp(52px, 6vw, 72px);
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(0, 0, 0, 0.12))
            no-repeat,
          var(--panel, #1a1f29);
        color: var(--muted, #a8b0bf);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), inset 0 -2px 6px rgba(0, 0, 0, 0.35);
        border: 1px solid rgba(148, 163, 184, 0.18);
        transition: transform 160ms ease, box-shadow 160ms ease;
      }
      .slot:hover {
        transform: translateY(-1px);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), inset 0 -3px 8px rgba(0, 0, 0, 0.4);
      }
      .measure {
        position: absolute;
        visibility: hidden;
        pointer-events: none;
      }
    `,
  ],
})
export class HotbarComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() items: InventoryItemDef[] = [];
  @Input() hardCap = 9; // optional maximum

  @ViewChild('container') containerRef?: ElementRef<HTMLDivElement>;

  visibleSlots: HotbarSlot[] = [];

  private resizeObserver?: ResizeObserver;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      // Recompute when items array changes
      queueMicrotask(() => this.computeSlots());
    }
  }

  ngAfterViewInit(): void {
    this.computeSlots();
    const el = this.containerRef?.nativeElement;
    if ('ResizeObserver' in window && el) {
      this.resizeObserver = new ResizeObserver(() => this.computeSlots());
      this.resizeObserver.observe(el);
    } else {
      // fallback: window resize
      window.addEventListener('resize', this.computeSlots);
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver && this.containerRef?.nativeElement) {
      this.resizeObserver.unobserve(this.containerRef.nativeElement);
    }
    window.removeEventListener('resize', this.computeSlots);
  }

  private computeSlots = () => {
    const container = this.containerRef?.nativeElement;
    if (!container) return;

    const measure = container.querySelector('.measure') as HTMLElement | null;
    const slotsRow = container.querySelector('.slots') as HTMLElement | null;
    let containerWidth = slotsRow?.clientWidth || container.clientWidth;
    if (!containerWidth || containerWidth < 50) {
      // Fallback to viewport width minus some safe gutters
      containerWidth = Math.max(
        0,
        Math.min(window.innerWidth, document.documentElement.clientWidth || window.innerWidth) - 32
      );
    }

    // Derive slot width from the measuring element
    let slotWidth = 64; // reasonable default
    if (measure) slotWidth = measure.clientWidth || slotWidth;

    // Get gap from computed styles
    let gap = 8;
    if (slotsRow) {
      const cs = getComputedStyle(slotsRow);
      const colGap = parseFloat(cs.columnGap || '0');
      gap = isNaN(colGap) ? gap : colGap;
    }

    // Calculate capacity (number of slots that can fit)
    const capacity = Math.max(
      1,
      Math.min(this.hardCap, Math.floor((containerWidth + gap) / (slotWidth + gap)))
    );

    const items = this.items || [];
    const slots: HotbarSlot[] = [];
    if (items.length <= capacity) {
      const count = Math.min(items.length, capacity);
      for (let i = 0; i < count; i++) {
        slots.push({ type: 'item', item: items[i] });
      }
      // Fill remaining with empty placeholders so the bar keeps its size
      for (let i = count; i < capacity; i++) {
        slots.push({ type: 'item' });
      }
    } else {
      // Reserve last for "+X"
      const showItems = Math.max(0, capacity - 1);
      for (let i = 0; i < showItems; i++) {
        slots.push({ type: 'item', item: items[i] });
      }
      slots.push({ type: 'more', more: items.length - showItems });
    }

    this.visibleSlots = slots;
  };
}
