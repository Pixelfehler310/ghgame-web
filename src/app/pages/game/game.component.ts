import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';
import {
  DialogChunk,
  GameConfig,
  GameState,
  InventoryItemDef,
  QuestionInput,
} from '../../models/game.models';
import { SpeechBubbleComponent } from './components/speech-bubble.component';
import { ItemHeroComponent } from './components/item-hero.component';
import { StageFormComponent } from './components/stage-form.component';
import { UploadModalComponent } from './components/upload-modal.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIf,
    SpeechBubbleComponent,
    ItemHeroComponent,
    StageFormComponent,
    UploadModalComponent,
  ],
  template: `
    <section class="game p-fluid">
      <div class="container">
        <div class="topbar flex align-items-center justify-content-between gap-3">
          <div class="flex align-items-center gap-2">
            <strong>{{ state?.currentStageIndex || 1 }}/{{ config.totalStages }}</strong>
          </div>
          <div class="text-right">
            <strong aria-live="polite">{{ countdown }}</strong>
          </div>
        </div>

        <div class="stack">
          <ghg-item-hero [imageUrl]="itemImageUrl" [name]="itemName"></ghg-item-hero>

          <ghg-speech-bubble
            [avatarUrl]="npcAvatarUrl"
            [messages]="dialogMessages"
          ></ghg-speech-bubble>

          <ghg-stage-form
            [inputSchema]="formSchema"
            [uploadRequired]="true"
            [uploaded]="hasUpload"
            (submit)="handleSubmit($event)"
            (openUpload)="handleOpenUpload()"
          ></ghg-stage-form>
        </div>

        <div class="hotbar shadow-2 border-round p-2 flex justify-content-center gap-2 mt-4">
          <ng-container *ngFor="let slot of visibleHotbar; let i = index">
            <div class="slot border-round" [attr.aria-label]="'Slot ' + (i + 1)">
              <span *ngIf="slot.type === 'item'">{{ slot.item?.name || 'Item' }}</span>
              <span *ngIf="slot.type === 'more'">+{{ slot.more }}</span>
            </div>
          </ng-container>
        </div>

        <ghg-upload-modal
          *ngIf="showUpload"
          [accept]="['image/png', 'image/jpeg']"
          [maxSizeMB]="5"
          (save)="handleUploadSaved($event)"
          (cancel)="showUpload = false"
        ></ghg-upload-modal>
      </div>
    </section>
  `,
  styles: [
    `
      .container {
        max-width: 1040px;
        margin: 0 auto;
        padding: 1rem;
      }
      .topbar {
        opacity: 0.9;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }
      .stack > * + * {
        margin-top: 1rem;
      }
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
  npcAvatarUrl = 'img/plushie_neutral.PNG';
  dialogMessages: DialogChunk[] = [
    { id: 'm1', text: 'Willkommen im Abenteuer!', mood: 'happy' },
    { id: 'm2', text: 'Löse die Aufgabe und lade ein Bild hoch.' },
  ];
  itemImageUrl = 'img/plushie_neutral.PNG';
  itemName = 'Beispiel-Item';
  formSchema: QuestionInput = { kind: 'text', placeholder: 'Deine Antwort...' } as any;
  hasUpload = false;
  showUpload = false;

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

  // Stage form handlers (placeholders)
  handleSubmit(answer: any) {
    // Placeholder: mark upload required gating not satisfied -> just log
    console.log('submit answer', answer);
  }
  handleOpenUpload() {
    // Placeholder: would open upload modal in future
    this.showUpload = true;
  }
  handleUploadSaved(file: File) {
    // Later: upload to backend and store thumbnail in progress
    console.log('upload saved', file?.name);
    this.hasUpload = true;
    this.showUpload = false;
  }
}
