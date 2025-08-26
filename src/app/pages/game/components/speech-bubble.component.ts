import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogChunk } from '../../../models/game.models';

@Component({
  selector: 'ghg-speech-bubble',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bubble-row">
      <img *ngIf="avatarUrl" [src]="avatarUrl" alt="NPC avatar" class="avatar border-round" />
      <div class="bubble p-3 border-round" #bubble>
        <div class="message" *ngFor="let m of messages">
          <p class="m-0">{{ m.text }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* row with avatar left and bubble expanding */
      .bubble-row {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: start;
        gap: 0.75rem;
        width: 100%;
        margin: 0 auto;
      }
      .avatar {
        width: 64px;
        height: 64px;
        object-fit: cover;
      }
      .bubble {
        background: var(--surface-50, #1a1f29);
        color: var(--text-color, #e6e6e6);
        max-height: 60vh;
        overflow: auto;
        width: 100%;
        max-width: 1400px; /* reasonable cap for ultra-wide */
        font-size: clamp(1.1rem, 1.8vw, 1.35rem);
        line-height: 1.7;
      }
      .message + .message {
        margin-top: 0.9rem;
      }
      /* On desktop, center the bubble with ~20% margins on each side */
      @media (min-width: 1024px) {
        .bubble-row {
          max-width: 60vw; /* leaves ~20% margins on both sides */
        }
      }
    `,
  ],
})
export class SpeechBubbleComponent implements AfterViewInit, OnChanges {
  @Input() messages: DialogChunk[] = [];
  @Input() avatarUrl?: string;
  @Input() autoScroll = true;

  @ViewChild('bubble') bubbleRef?: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['messages']) {
      // next tick to ensure DOM updated
      setTimeout(() => this.scrollToBottom());
    }
  }

  // TODO Next and prev mode without scrolling, space or tap to advance the text like a real game.
  private scrollToBottom() {
    if (!this.autoScroll) return;
    const el = this.bubbleRef?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }
}
