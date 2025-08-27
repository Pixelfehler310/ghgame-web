import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { UploadService } from '../../services/upload.service';
import {
  DialogChunk,
  GameConfig,
  GameState,
  InventoryItemDef,
  QuestionInput,
  Stage,
} from '../../models/game.models';
import STAGES_DATA from './stages.data';
import { getItemIconSrc } from '../../models/game.models';
import { SpeechBubbleComponent } from './components/speech-bubble.component';
import { ItemHeroComponent } from './components/item-hero.component';
import { StageFormComponent } from './components/stage-form.component';
import { UploadModalComponent } from './components/upload-modal.component';
import { HotbarComponent } from './components/hotbar.component';
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
    HotbarComponent,
  ],
  template: `
    <section class="game p-fluid">
      <div class="game-container">
        <!-- Toast container for top-right messages -->
        <p-toast position="top-right"></p-toast>

        <!-- Overall layout: header, content (grows), footer/hotbar -->
        <div class="game-inner">
          <header class="game-header" role="banner">
            <div class="header-left">
              <strong>{{ state?.currentStageIndex || 1 }}/{{ config.totalStages }}</strong>
            </div>
            <div class="header-right">
              <strong role="timer" aria-live="polite">{{ countdown }}</strong>
            </div>
          </header>

          <div class="game-content">
            <div class="stack">
              <ghg-item-hero [imageUrl]="itemImageUrl" [name]="itemName"></ghg-item-hero>

              <!-- content-body holds the speech bubble (flex grow and scroll) and the form -->
              <div class="content-body">
                <div class="speech-area">
                  <ghg-speech-bubble
                    [avatarUrl]="npcAvatarUrl"
                    [messages]="dialogMessages"
                    [question]="currentStage?.question?.prompt"
                  ></ghg-speech-bubble>
                </div>

                <div class="gap-below-bubble"></div>

                <ghg-stage-form
                  [inputSchema]="formSchema"
                  [uploadRequired]="!!currentStage?.upload?.required"
                  [uploaded]="hasUpload"
                  [inlineMessageText]="inlineMessageMode ? inlineMessageText : null"
                  [inlineSeverity]="inlineMessageMode ? inlineSeverity : 'info'"
                  (submitted)="handleSubmit($event)"
                  (openUpload)="handleOpenUpload()"
                ></ghg-stage-form>
              </div>
            </div>
          </div>

          <footer class="game-footer">
            <ghg-hotbar
              [items]="state?.inventory || []"
              [hardCap]="config.hotbarSlots"
            ></ghg-hotbar>
          </footer>
        </div>

        <ghg-upload-modal
          *ngIf="showUpload"
          [accept]="currentStage?.upload?.acceptMime || ['image/png', 'image/jpeg']"
          [maxSizeMB]="currentStage?.upload?.maxSizeMB || 5"
          (save)="handleUploadSaved($event)"
          (cancel)="showUpload = false"
        ></ghg-upload-modal>
      </div>
    </section>
  `,
  styles: [
    `
      /* Full-height column layout: header, content, footer */
      .game-container {
        max-width: 100%;
        margin: 0 auto;
        padding: 0; /* handled per area */
        height: 100vh; /* fill viewport */
        display: flex;
        align-items: stretch;
      }

      .game-inner {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        width: 100%;
      }

      .game-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        gap: 1rem;
        color: var(--muted);
        background: rgba(26, 31, 41, 0.05);
        border-bottom: 1px solid rgba(148, 163, 184, 0.06);
        font-variant-numeric: tabular-nums;
      }

      .game-content {
        /* this region grows to fill available space between header and footer */
        flex: 1 1 auto;
        min-height: 0; /* allow children to shrink for overflow handling */
        padding: 1rem;
        overflow: hidden; /* child scroll will handle overflow */
        display: flex;
        align-items: stretch;
        max-height: calc(100vh - 120px); /* prevent overflow on very small viewports */
      }

      .stack {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
      }

      /* content-body holds the speech bubble (flexible) and the form */
      .content-body {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        min-height: 0; /* important for children overflow */
        width: 100%;
        align-items: center;
      }

      .speech-area {
        flex: 1 1 auto;
        min-height: 0; /* allow overflow correctly inside flex */
        width: 100%;
        overflow: auto; /* scroll when speech bubble content exceeds available height */
        display: flex;
        justify-content: center;
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
        .game-content {
          max-width: 75vw; /* leaves ~12,5% margins on each side for large screens */
          margin: 0 auto;
        }
      }

      .game-footer {
        border-top: 1px solid rgba(148, 163, 184, 0.06);
        padding: 0.5rem 1rem;
      }
    `,
  ],
})
export class GameComponent implements OnInit, OnDestroy {
  private readonly api = inject(GameService);
  private readonly uploads = inject(UploadService);
  private readonly messageService = inject(MessageService);

  loading = signal(false);
  state: GameState | null = null;
  config: GameConfig = { totalStages: 24, deadlineISO: '2025-09-30T21:59:59.000Z', hotbarSlots: 9 };
  countdown = '00:00:00:00'; // dd:hh:mm:ss
  private countdownTimer: any;
  npcAvatarUrl = 'img/plushie_neutral.PNG';
  stages: Stage[] = STAGES_DATA || [];
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

  handleLoad() {
    this.loading.set(true);
    this.api.loadGame().subscribe({
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
    this.handleLoad();
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
    console.warn('Trying to submit answer:', answer);

    if (!this.currentStage) return;
    const uploadRequired = !!this.currentStage.upload?.required;
    if (uploadRequired && !this.hasUpload) {
      this.showMessage('Bitte lade zuerst ein Bild hoch.', 'warn');
      return;
    }
    // For uploadOnly stages we skip answer evaluation entirely.
    const skipAnswer = this.currentStage.question.input.kind === 'uploadOnly';
    let isCorrect = true;
    if (!skipAnswer) {
      isCorrect = this.evaluateAnswer(answer, this.currentStage.question.check);
    }
    if (!isCorrect) {
      this.showMessage('Das ist leider nicht korrekt. Versuch es nochmal.', 'error');
      return;
    }
    // Success: add item (once) then advance
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
    this.showMessage(
      skipAnswer ? 'Bild akzeptiert! Weiter geht’s.' : 'Korrekt! Weiter geht’s.',
      'success'
    );
    this.advanceStage();
  }
  handleOpenUpload() {
    // Placeholder: would open upload modal in future
    this.showUpload = true;
  }

  handleUploadSaved(url: string) {
    // upload already completed in modal; just mark state and advance if needed
    this.hasUpload = true;
    this.showUpload = false;
    this.showMessage('Bild hochgeladen.', 'success');
    if (this.currentStage?.question.input.kind === 'uploadOnly') {
      this.handleSubmit(null);
    }
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
      this.itemImageUrl =
        this.currentStage.assets?.itemImage ||
        getItemIconSrc(this.currentStage.item) ||
        'img/plushie_neutral.PNG';
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
