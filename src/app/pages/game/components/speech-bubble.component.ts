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
    <div class="flex align-items-start gap-3">
      <img
        *ngIf="avatarUrl"
        [src]="avatarUrl"
        alt="NPC avatar"
        class="border-round"
        style="width:56px;height:56px;object-fit:cover"
      />
      <div class="bubble p-3 border-round" #bubble>
        <div class="message" *ngFor="let m of messages">
          <p class="m-0">{{ m.text }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .bubble {
        background: var(--surface-50, #1a1f29);
        color: var(--text-color, #e6e6e6);
        max-height: 40vh;
        overflow: auto;
        width: 100%;
      }
      .message + .message {
        margin-top: 0.75rem;
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
