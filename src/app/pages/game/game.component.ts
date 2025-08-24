import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { GameService } from '../../services/game.service';
import { GameConfig, GameState, InventoryItemDef } from '../../models/game.models';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, PanelModule, CardModule],
  template: `
    <section class="game p-fluid">
      <div class="grid gap-3 align-items-start justify-content-center">
        <div class="col-12">
          <p-panel header="GHG Adventure" [toggleable]="false">
            <div class="flex align-items-center justify-content-between flex-wrap gap-3">
              <div class="flex align-items-center gap-2">
                <span class="text-500">Stage</span>
                <strong>{{ state?.currentStageIndex || 1 }}/{{ config.totalStages }}</strong>
              </div>
              <div class="text-right">
                <span class="text-500 mr-2">Countdown</span>
                <strong aria-live="polite">{{ countdown }}</strong>
              </div>
            </div>
          </p-panel>
        </div>

        <!-- Desktop: NPC left, Main content right -->
        <div class="col-12 lg:col-3">
          <p-card header="NPC Panel">
            <div class="text-500">NpcPanel placeholder (avatar, name, mood)</div>
          </p-card>
        </div>

        <div class="col-12 lg:col-9">
          <div class="grid">
            <div class="col-12">
              <p-card header="Item Hero">
                <div class="text-500">ItemHero placeholder (item image + name)</div>
              </p-card>
            </div>
            <div class="col-12">
              <p-card header="Speech Bubble">
                <div class="text-500" style="min-height: 200px">
                  SpeechBubble placeholder (scrollable story/dialog)
                </div>
              </p-card>
            </div>
            <div class="col-12">
              <p-card header="Stage Form">
                <div class="text-500">StageForm placeholder (answer input + upload trigger)</div>
              </p-card>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="hotbar shadow-2 border-round p-2 flex justify-content-center gap-2">
            <ng-container *ngFor="let slot of visibleHotbar; let i = index">
              <div class="slot border-round" [attr.aria-label]="'Slot ' + (i + 1)">
                <span *ngIf="slot.type === 'item'">{{ slot.item?.name || 'Item' }}</span>
                <span *ngIf="slot.type === 'more'">+{{ slot.more }}</span>
              </div>
            </ng-container>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .hotbar {
        position: relative;
      }
      .slot {
        width: 72px;
        height: 72px;
        background: var(--surface-200, #2a2f3a);
        color: var(--text-color-secondary, #a8b0bf);
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
})
export class GameComponent implements OnInit, OnDestroy {
  private readonly api = inject(GameService);

  loading = signal(false);
  state: GameState | null = null;
  config: GameConfig = { totalStages: 24, deadlineISO: '2025-09-30T21:59:59.000Z', hotbarSlots: 9 };
  countdown = '00:00:00:00'; // dd:hh:mm:ss
  private countdownTimer: any;

  handleLoad(id: string) {
    if (!id) return;
    this.loading.set(true);
    this.api.loadGame(id).subscribe({
      next: (res: any) => {
        if (res?.state) this.state = res.state;
      },
      error: () => {},
      complete: () => this.loading.set(false),
    });
  }

  ngOnInit() {
    this.handleLoad('demo123');
    this.startCountdown();
  }

  ngOnDestroy() {
    if (this.countdownTimer) clearInterval(this.countdownTimer);
  }

  get visibleHotbar() {
    const items = this.state?.inventory ?? [];
    const visible = Math.min(items.length, 8);
    const slots: Array<{ type: 'item' | 'more'; item?: InventoryItemDef; more?: number }> = [];
    for (let i = 0; i < Math.min(visible, this.config.hotbarSlots); i++) {
      if (i < items.length) slots.push({ type: 'item', item: items[i] });
      else slots.push({ type: 'item' });
    }
    if (items.length >= 10) {
      slots.push({ type: 'more', more: items.length - 8 });
    } else if (this.config.hotbarSlots - slots.length > 0) {
      // fill remaining slots up to 9
      while (slots.length < this.config.hotbarSlots) slots.push({ type: 'item' });
    }
    return slots;
  }

  private startCountdown() {
    const deadline = new Date(this.config.deadlineISO).getTime();
    const update = () => {
      const now = Date.now();
      let ms = Math.max(0, deadline - now);
      const days = Math.floor(ms / 86400000);
      ms %= 86400000;
      const hours = Math.floor(ms / 3600000);
      ms %= 3600000;
      const mins = Math.floor(ms / 60000);
      ms %= 60000;
      const secs = Math.floor(ms / 1000);
      this.countdown = `${days.toString().padStart(2, '0')}:${hours
        .toString()
        .padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    update();
    this.countdownTimer = setInterval(update, 1000);
  }
}
