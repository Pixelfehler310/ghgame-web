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
  Stage,
} from '../../models/game.models';
import stagesData from './stages.mock.json';
import { SpeechBubbleComponent } from './components/speech-bubble.component';
import { ItemHeroComponent } from './components/item-hero.component';
import { StageFormComponent } from './components/stage-form.component';
import { UploadModalComponent } from './components/upload-modal.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-game',
  standalone: true,
  providers: [MessageService],
  imports: [
    CommonModule,
    FormsModule,
    NgIf,
    SpeechBubbleComponent,
    ItemHeroComponent,
    StageFormComponent,
    UploadModalComponent,
    ToastModule,
  ],
  template: `
    <section class="game p-fluid">
      <div class="game-container">
        <!-- Toast container for top-right messages -->
        <p-toast position="top-right"></p-toast>
        <!-- HUD in corners -->
        <div class="hud">
          <div class="hud-left">
            <strong>{{ state?.currentStageIndex || 1 }}/{{ config.totalStages }}</strong>
          </div>
          <div class="hud-right">
            <strong role="timer" aria-live="polite">{{ countdown }}</strong>
          </div>
        </div>

        <div class="content-center">
          <div class="stack">
            <ghg-item-hero [imageUrl]="itemImageUrl" [name]="itemName"></ghg-item-hero>

            <!-- TODO messages via prime ng message service + p toast? -->
            <ghg-speech-bubble
              [avatarUrl]="npcAvatarUrl"
              [messages]="dialogMessages"
            ></ghg-speech-bubble>

            <div class="gap-below-bubble"></div>

            <ghg-stage-form
              [inputSchema]="formSchema"
              [uploadRequired]="!!currentStage?.upload?.required"
              [uploaded]="hasUpload"
              [inlineMessageText]="inlineMessageMode ? inlineMessageText : null"
              [inlineSeverity]="inlineMessageMode ? inlineSeverity : 'info'"
              (submit)="handleSubmit($event)"
              (openUpload)="handleOpenUpload()"
            ></ghg-stage-form>
          </div>
        </div>

        <div
          class="hotbar shadow-2 p-2 flex justify-content-center gap-2"
          role="listbox"
          aria-label="Inventarleiste"
        >
          <ng-container *ngFor="let slot of visibleHotbar; let i = index">
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

        <ghg-upload-modal
          *ngIf="showUpload"
          [accept]="['image/png', 'image/jpeg']"
          [maxSizeMB]="5"
          (save)="handleUploadSaved($event)"
          (cancel)="showUpload = false"
        ></ghg-upload-modal>

        <!-- Spacer so content doesn’t sit under the fixed hotbar -->
        <div class="bottom-spacer" aria-hidden="true"></div>
      </div>
    </section>
  `,
  styles: [
    `
      .game-container {
        max-width: 100%;
        margin: 0 auto;
        padding: 1rem;
      }
      /* HUD pinned to corners */
      .hud {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 48px;
        pointer-events: none;
        z-index: 20;
      }
      .hud-left,
      .hud-right {
        position: absolute;
        top: 8px;
        padding: 6px 10px;
        color: var(--muted);
        font-variant-numeric: tabular-nums;
        background: rgba(26, 31, 41, 0.5);
        border: 1px solid rgba(148, 163, 184, 0.18);
        border-radius: var(--radius-ui);
      }
      .hud-left {
        left: 8px;
      }
      .hud-right {
        right: 8px;
      }

      .content-center {
        width: 100%;
        margin: 72px auto 0; /* leave room for HUD */
        padding: 0 1rem;
      }
      .stack {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .stack > * + * {
        margin-top: 1rem;
      }
      .gap-below-bubble {
        height: 0.75rem;
      }
      @media (min-width: 1024px) {
        .stack > * + * {
          margin-top: 1.25rem;
        }
        .gap-below-bubble {
          height: 1rem;
        }
        .content-center {
          max-width: 60vw; /* leaves ~20% margins on each side for large screens */
        }
      }
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
      .bottom-spacer {
        height: 88px;
      }
    `,
  ],
})
export class GameComponent implements OnInit, OnDestroy {
  private readonly api = inject(GameService);
  private readonly messageService = inject(MessageService);

  loading = signal(false);
  state: GameState | null = null;
  config: GameConfig = { totalStages: 24, deadlineISO: '2025-09-30T21:59:59.000Z', hotbarSlots: 9 };
  countdown = '00:00:00:00'; // dd:hh:mm:ss
  private countdownTimer: any;
  npcAvatarUrl = 'img/plushie_neutral.PNG';
  stages: Stage[] = (stagesData as unknown as Stage[]) || [];
  currentStage: Stage | null = null;
  currentStageIdx = 0;
  dialogMessages: DialogChunk[] = [];
  itemImageUrl = '';
  itemName = '';
  formSchema: QuestionInput = { kind: 'text' } as any;
  hasUpload = false;
  showUpload = false;
  // Message preferences: toggle between toast vs inline
  inlineMessageMode = false; // default to toasts for PrimeNG look & feel
  inlineMessageText: string | null = null;
  inlineSeverity: 'success' | 'info' | 'warn' | 'error' = 'info';

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
    // Initialize from mock data
    this.config.totalStages = this.stages.length || this.config.totalStages;
    this.setStageByIndex(0);
    // Optionally load mocked state
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
    if (!this.currentStage) return;
    const uploadRequired = !!this.currentStage.upload?.required;
    if (uploadRequired && !this.hasUpload) {
      // Form should already disable submit; silent guard
      this.showMessage('Bitte lade zuerst ein Bild hoch.', 'warn');
      return;
    }
    const isCorrect = this.evaluateAnswer(answer, this.currentStage.question.check);
    if (!isCorrect) {
      // No longer add messages to speech bubble; use toast/inline instead
      this.showMessage('Das ist leider nicht korrekt. Versuch es nochmal.', 'error');
      return;
    }
    // Correct: add item to inventory and advance
    if (!this.state) {
      this.state = {
        currentStageIndex: this.currentStage.index,
        inventory: [],
        progress: {},
        lastUpdatedISO: new Date().toISOString(),
      } as GameState;
    }
    const item = this.currentStage.item;
    if (!this.state.inventory.find((it) => it.id === item.id)) {
      this.state.inventory = [...this.state.inventory, item as InventoryItemDef];
    }
    this.showMessage('Korrekt! Weiter geht’s.', 'success');
    this.advanceStage();
  }
  handleOpenUpload() {
    // Placeholder: would open upload modal in future
    this.showUpload = true;
  }
  handleUploadSaved(file: File) {
    // Mock: mark as uploaded; real impl would call GameService.uploadImage
    console.log('upload saved', file?.name);
    this.hasUpload = true;
    this.showUpload = false;
  }

  private evaluateAnswer(answer: any, check: any): boolean {
    if (!check) return false;
    switch (check.mode) {
      case 'exact': {
        const expected = check.expected as any;
        // Normalize strings if case-insensitive
        const norm = (v: any) =>
          typeof v === 'string' && !check.caseSensitive ? v.trim().toLowerCase() : v;
        if (Array.isArray(expected)) {
          if (Array.isArray(answer)) {
            const a = answer.map(norm).sort();
            const e = expected.map(norm).sort();
            return a.length === e.length && a.every((v, i) => v === e[i]);
          }
          // scalar vs array: not exact
          return false;
        } else {
          return norm(answer) === norm(expected);
        }
      }
      case 'anyOf': {
        const expected: any[] = Array.isArray(check.expected) ? check.expected : [];
        if (Array.isArray(answer)) {
          return answer.some((v) => expected.includes(v));
        }
        return expected.includes(answer);
      }
      case 'range': {
        const num = typeof answer === 'number' ? answer : Number(answer);
        if (Number.isNaN(num)) return false;
        const { min = -Infinity, max = Infinity } = check as { min?: number; max?: number };
        return num >= min && num <= max;
      }
      case 'regex': {
        const str = String(answer ?? '');
        try {
          const re = new RegExp(check.pattern, check.flags || '');
          return re.test(str);
        } catch {
          return false;
        }
      }
      case 'coordinateWithin': {
        const a = answer as any;
        if (!a || typeof a.x !== 'number' || typeof a.y !== 'number') return false;
        const r = check.rect;
        return a.x >= r.minX && a.x <= r.maxX && a.y >= r.minY && a.y <= r.maxY;
      }
      default:
        // Unsupported in prototype: treat as not correct to avoid skipping
        return false;
    }
  }

  private setStageByIndex(idx: number) {
    this.currentStageIdx = idx;
    this.currentStage = this.stages[idx] || null;
    if (this.currentStage) {
      this.dialogMessages = this.currentStage.npcDialog;
      this.itemImageUrl = this.currentStage.item.iconUrl || 'img/plushie_neutral.PNG';
      this.itemName = this.currentStage.item.name;
      this.formSchema = this.currentStage.question.input as QuestionInput;
      this.hasUpload = false;
      if (!this.state) {
        this.state = {
          currentStageIndex: this.currentStage.index,
          inventory: [],
          progress: {},
          lastUpdatedISO: new Date().toISOString(),
        } as GameState;
      } else {
        this.state.currentStageIndex = this.currentStage.index;
      }
    }
  }

  private advanceStage() {
    const nextIdx = this.currentStageIdx + 1;
    if (nextIdx < this.stages.length) {
      this.setStageByIndex(nextIdx);
    } else {
      alert('Alle Mock-Stages abgeschlossen!');
    }
  }

  private showMessage(text: string, severity: 'success' | 'info' | 'warn' | 'error' = 'info') {
    if (this.inlineMessageMode) {
      this.inlineMessageText = text;
      this.inlineSeverity = severity;
      // Clear after a short delay
      setTimeout(() => {
        this.inlineMessageText = null;
        this.inlineSeverity = 'info';
      }, 3000);
    } else {
      this.messageService.add({ severity, summary: undefined, detail: text, life: 3000 });
    }
  }
}
