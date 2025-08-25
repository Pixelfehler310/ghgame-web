import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestionInput } from '../../../models/game.models';

@Component({
  selector: 'ghg-stage-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="emitSubmit()" class="p-fluid">
      <!-- Dynamic input rendering -->
      <ng-container [ngSwitch]="inputSchema?.kind">
        <!-- Text -->
        <div *ngSwitchCase="'text'" class="field">
          <input
            type="text"
            class="p-inputtext p-component w-full"
            [(ngModel)]="model"
            name="answerText"
            [placeholder]="$any(inputSchema)?.placeholder || 'Antwort eingeben'"
            [attr.minlength]="$any(inputSchema)?.minLength || null"
            [attr.maxlength]="$any(inputSchema)?.maxLength || null"
            aria-label="Textantwort"
            required
          />
        </div>

        <!-- Number -->
        <div *ngSwitchCase="'number'" class="field">
          <input
            type="number"
            class="p-inputtext p-component w-full"
            [(ngModel)]="model"
            name="answerNumber"
            [attr.min]="$any(inputSchema)?.min ?? null"
            [attr.max]="$any(inputSchema)?.max ?? null"
            [attr.step]="$any(inputSchema)?.step ?? null"
            aria-label="Zahl"
            required
          />
        </div>

        <!-- Choice (single) -->
        <div *ngSwitchCase="'choice'" class="field">
          <select
            class="p-inputtext p-component w-full"
            [(ngModel)]="model"
            name="answerChoice"
            [multiple]="$any(inputSchema)?.multiple"
            aria-label="Auswahl"
          >
            <option *ngFor="let opt of $any(inputSchema)?.options || []" [ngValue]="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>

        <!-- Boolean -->
        <div *ngSwitchCase="'boolean'" class="field">
          <div class="flex align-items-center gap-3">
            <label class="flex align-items-center gap-2"
              ><input type="radio" name="answerBool" [value]="true" [(ngModel)]="model" />
              {{ $any(inputSchema)?.trueLabel || 'Ja' }}</label
            >
            <label class="flex align-items-center gap-2"
              ><input type="radio" name="answerBool" [value]="false" [(ngModel)]="model" />
              {{ $any(inputSchema)?.falseLabel || 'Nein' }}</label
            >
          </div>
        </div>

        <!-- Fallback -->
        <div *ngSwitchDefault class="text-500">
          Unbekannter Eingabetyp – bitte später implementieren.
        </div>
      </ng-container>

      <!-- Upload trigger and status -->
      <div class="flex align-items-center justify-content-between mt-3">
        <button
          type="button"
          class="p-button p-component p-button-text"
          (click)="openUpload.emit()"
        >
          <span class="p-button-label">Bild hochladen</span>
        </button>
        <small class="text-500" *ngIf="uploadRequired">
          {{ uploaded ? '1 Bild hinzugefügt' : 'Upload erforderlich' }}
        </small>
      </div>

      <div class="mt-3">
        <button
          type="submit"
          class="p-button p-component p-button-primary w-full"
          [disabled]="uploadRequired && !uploaded"
        >
          <span class="p-button-label">Antwort prüfen</span>
        </button>
      </div>
    </form>
  `,
})
export class StageFormComponent {
  @Input() inputSchema?: QuestionInput;
  @Input() uploadRequired = true;
  @Input() uploaded = false;
  @Output() submit = new EventEmitter<any>();
  @Output() openUpload = new EventEmitter<void>();

  model: any = '';

  emitSubmit() {
    this.submit.emit(this.model);
  }
}
