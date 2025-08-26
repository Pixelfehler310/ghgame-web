import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { QuestionInput } from '../../../models/game.models';
import { TooltipModule } from 'primeng/tooltip';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
  selector: 'ghg-stage-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule,
    MessageModule,
    TagModule,
    ButtonModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
  template: `
    <form #f="ngForm" (ngSubmit)="onSubmit(f)" class="p-fluid form-shell">
      <!-- Optional single inline message above the input -->
      <p-message
        *ngIf="inlineMessageText"
        [severity]="inlineSeverity"
        [text]="inlineMessageText"
      ></p-message>

      <!-- Dynamic input rendering with inline submit icon button -->
      <ng-container [ngSwitch]="inputSchema?.kind">
        <!-- Text -->
        <div *ngSwitchCase="'text'" class="field">
          <p-inputgroup>
            <input
              type="text"
              pInputText
              [(ngModel)]="model"
              name="answerText"
              [placeholder]="$any(inputSchema)?.placeholder || 'Antwort eingeben'"
              [attr.minlength]="$any(inputSchema)?.minLength || null"
              [attr.maxlength]="$any(inputSchema)?.maxLength || null"
              aria-label="Textantwort"
              required
              [ngClass]="{ 'p-invalid': isControlInvalid(f, 'answerText') }"
            />
            <p-inputgroup-addon>
              <span
                class="tooltip-wrapper"
                [pTooltip]="
                  uploadRequired && !uploaded ? 'Bitte lade zuerst ein Bild hoch.' : undefined
                "
                tooltipPosition="top"
                appendTo="body"
              >
                <button
                  type="submit"
                  pButton
                  icon="pi pi-check"
                  class="p-button-success p-button-icon-only"
                  [disabled]="uploadRequired && !uploaded"
                  [attr.aria-label]="'Antwort prüfen'"
                ></button>
              </span>
            </p-inputgroup-addon>
          </p-inputgroup>
        </div>

        <!-- Number -->
        <div *ngSwitchCase="'number'" class="field">
          <p-inputgroup>
            <input
              type="number"
              pInputText
              [(ngModel)]="model"
              name="answerNumber"
              [attr.min]="$any(inputSchema)?.min ?? null"
              [attr.max]="$any(inputSchema)?.max ?? null"
              [attr.step]="$any(inputSchema)?.step ?? null"
              aria-label="Zahl"
              required
              [ngClass]="{ 'p-invalid': isControlInvalid(f, 'answerNumber') }"
            />
            <p-inputgroup-addon>
              <span
                class="tooltip-wrapper"
                [pTooltip]="
                  uploadRequired && !uploaded ? 'Bitte lade zuerst ein Bild hoch.' : undefined
                "
                tooltipPosition="top"
                appendTo="body"
              >
                <button
                  type="submit"
                  pButton
                  icon="pi pi-check"
                  class="p-button-success p-button-icon-only"
                  [disabled]="uploadRequired && !uploaded"
                  [attr.aria-label]="'Antwort prüfen'"
                ></button>
              </span>
            </p-inputgroup-addon>
          </p-inputgroup>
        </div>

        <!-- Choice (single/multiple) -->
        <div *ngSwitchCase="'choice'" class="field">
          <p-inputgroup>
            <select
              class="p-inputtext p-component"
              [(ngModel)]="model"
              name="answerChoice"
              [multiple]="$any(inputSchema)?.multiple"
              aria-label="Auswahl"
              [required]="!$any(inputSchema)?.multiple"
              [ngClass]="{ 'p-invalid': isControlInvalid(f, 'answerChoice') }"
            >
              <option *ngFor="let opt of $any(inputSchema)?.options || []" [ngValue]="opt.value">
                {{ opt.label }}
              </option>
            </select>
            <p-inputgroup-addon>
              <span
                class="tooltip-wrapper"
                [pTooltip]="
                  uploadRequired && !uploaded ? 'Bitte lade zuerst ein Bild hoch.' : undefined
                "
                tooltipPosition="top"
                appendTo="body"
              >
                <button
                  type="submit"
                  pButton
                  icon="pi pi-check"
                  class="p-button-success p-button-icon-only"
                  [disabled]="uploadRequired && !uploaded"
                  [attr.aria-label]="'Antwort prüfen'"
                ></button>
              </span>
            </p-inputgroup-addon>
          </p-inputgroup>
        </div>

        <!-- Boolean -->
        <div *ngSwitchCase="'boolean'" class="field">
          <div class="flex align-items-center gap-3">
            <label class="flex align-items-center gap-2"
              ><input type="radio" name="answerBool" [value]="true" [(ngModel)]="model" required />
              {{ $any(inputSchema)?.trueLabel || 'Ja' }}</label
            >
            <label class="flex align-items-center gap-2"
              ><input type="radio" name="answerBool" [value]="false" [(ngModel)]="model" required />
              {{ $any(inputSchema)?.falseLabel || 'Nein' }}</label
            >
            <span class="flex-auto"></span>
            <span
              class="tooltip-wrapper"
              [pTooltip]="
                uploadRequired && !uploaded ? 'Bitte lade zuerst ein Bild hoch.' : undefined
              "
              tooltipPosition="top"
              appendTo="body"
            >
              <button
                type="submit"
                pButton
                icon="pi pi-check"
                class="p-button-success p-button-icon-only"
                [disabled]="uploadRequired && !uploaded"
                [attr.aria-label]="'Antwort prüfen'"
              ></button>
            </span>
          </div>
        </div>

        <!-- Fallback -->
        <div *ngSwitchDefault class="text-500">
          Unbekannter Eingabetyp – bitte später implementieren.
        </div>
      </ng-container>

      <!-- Upload trigger and status -->
      <div class="flex align-items-center gap-3 mt-3 upload-row">
        <button
          type="button"
          pButton
          icon="pi pi-upload"
          label="Bild hochladen"
          (click)="openUpload.emit()"
        ></button>
        <p-tag
          *ngIf="uploadRequired"
          [severity]="uploaded ? 'success' : 'warning'"
          [value]="uploaded ? '1 Bild hinzugefügt' : 'Upload erforderlich'"
        ></p-tag>
      </div>

      <!-- No separate submit row; submit is inline as an icon button -->
    </form>
  `,
  styles: [
    `
      .form-shell {
        max-width: 440px;
      }
      .control-inline {
        display: flex;
      }
      .control-inline > :where(input, p-dropdown, p-multiselect) {
        width: 100%;
      }
      .tooltip-wrapper {
        display: inline-block;
      }
      /* Keep disabled distinct without fighting theme */
      button[disabled] {
        cursor: not-allowed;
        opacity: 0.6;
      }
      /* Make inline icon button compact and aligned within inputgroup */
      :host ::ng-deep .p-inputgroup > .p-button {
        min-width: 3rem;
      }
    `,
  ],
})
export class StageFormComponent {
  @Input() inputSchema?: QuestionInput;
  @Input() uploadRequired = true;
  @Input() uploaded = false;
  /** Optional single inline message to show above the input */
  @Input() inlineMessageText: string | null = null;
  @Input() inlineSeverity: 'success' | 'info' | 'warn' | 'error' = 'info';
  @Output() submit = new EventEmitter<any>();
  @Output() openUpload = new EventEmitter<void>();

  model: any = '';

  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.inlineMessageText = 'Bitte fülle das Feld aus.';
      this.inlineSeverity = 'warn';
      return;
    }
    this.inlineMessageText = null;
    this.submit.emit(this.model);
  }

  isControlInvalid(form: NgForm, name: string): boolean {
    const c = form.controls[name];
    return !!c && c.invalid && (c.dirty || c.touched || form.submitted);
  }
}
