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
import { SelectModule } from 'primeng/select';

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
    SelectModule,
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
        <!-- Upload-only stage: only show the image upload button, large and centered -->
        <div
          *ngSwitchCase="'uploadOnly'"
          class="field upload-only-wrapper flex flex-column align-items-center gap-3"
        >
          <button
            type="button"
            pButton
            class="upload-only-btn"
            [icon]="uploaded ? 'pi pi-check-circle' : 'pi pi-image'"
            [label]="uploaded ? 'Bild hochgeladen' : 'Bild hochladen'"
            [ngClass]="uploaded ? 'p-button-success' : 'upload-pending'"
            (click)="openUpload.emit()"
            [pTooltip]="uploaded ? 'Bild bereits hochgeladen' : 'Bitte lade ein Bild hoch'"
            tooltipPosition="top"
            appendTo="body"
            aria-label="Bild hochladen"
          ></button>
          <p class="m-0 text-500 small-hint" *ngIf="!uploaded">Ohne Bild kein Fortschritt.</p>
          <p class="m-0 text-500 small-hint" *ngIf="uploaded">Du kannst das Bild ersetzen.</p>
          <button
            type="submit"
            pButton
            icon="pi pi-check"
            label="Weiter"
            class="p-button-success"
            [disabled]="uploadRequired && !uploaded"
            aria-label="Weiter"
          ></button>
        </div>
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
              style="width:100%; flex:1 1 0; min-width:0;"
            />
            <!-- Upload addon with clear state & tooltip -->
            <p-inputgroup-addon>
              <button
                type="button"
                pButton
                [icon]="uploaded ? 'pi pi-check-circle' : 'pi pi-image'"
                class="p-button-icon-only"
                [ngClass]="
                  uploadRequired
                    ? uploaded
                      ? 'p-button-success'
                      : 'p-button-warning p-button-outlined'
                    : 'p-button-secondary p-button-outlined'
                "
                [pTooltip]="
                  uploaded
                    ? 'Bild bereits hochgeladen'
                    : uploadRequired
                    ? 'Bild hier hochladen — zwingend erforderlich'
                    : 'Bild optional hochladen'
                "
                tooltipPosition="top"
                appendTo="body"
                (click)="openUpload.emit()"
                aria-label="Bild hochladen"
              ></button>
            </p-inputgroup-addon>
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
              style="width:100%; flex:1 1 0; min-width:0;"
            />
            <p-inputgroup-addon>
              <button
                type="button"
                pButton
                [icon]="uploaded ? 'pi pi-check-circle' : 'pi pi-image'"
                class="p-button-icon-only"
                [ngClass]="
                  uploadRequired
                    ? uploaded
                      ? 'p-button-success'
                      : 'p-button-warning p-button-outlined'
                    : 'p-button-secondary p-button-outlined'
                "
                [pTooltip]="
                  uploaded
                    ? 'Bild bereits hochgeladen'
                    : uploadRequired
                    ? 'Bild hier hochladen — zwingend erforderlich'
                    : 'Bild optional hochladen'
                "
                tooltipPosition="top"
                appendTo="body"
                (click)="openUpload.emit()"
                aria-label="Bild hochladen"
              ></button>
            </p-inputgroup-addon>
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

        <!-- Choice (single only now) -->
        <div *ngSwitchCase="'choice'" class="field">
          <p-inputgroup>
            <p-select
              [(ngModel)]="model"
              name="answerChoice"
              [options]="$any(inputSchema)?.options || []"
              optionLabel="label"
              optionValue="value"
              [showClear]="true"
              [placeholder]="$any(inputSchema)?.placeholder || 'Option wählen'"
              [style]="{ width: '100%', flex: '1 1 0', minWidth: '0' }"
              class="w-full"
              [ngClass]="{ 'p-invalid': f.submitted && !model }"
            ></p-select>
            <p-inputgroup-addon>
              <button
                type="button"
                pButton
                [icon]="uploaded ? 'pi pi-check-circle' : 'pi pi-image'"
                class="p-button-icon-only"
                [ngClass]="
                  uploadRequired
                    ? uploaded
                      ? 'p-button-success'
                      : 'p-button-warning p-button-outlined'
                    : 'p-button-secondary p-button-outlined'
                "
                [pTooltip]="
                  uploaded
                    ? 'Bild bereits hochgeladen'
                    : uploadRequired
                    ? 'Bild hier hochladen — zwingend erforderlich'
                    : 'Bild optional hochladen'
                "
                tooltipPosition="top"
                appendTo="body"
                (click)="openUpload.emit()"
                aria-label="Bild hochladen"
              ></button>
            </p-inputgroup-addon>
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

        <!-- Fallback -->
        <div *ngSwitchDefault class="text-500">
          Unbekannter Eingabetyp – bitte später implementieren.
        </div>
      </ng-container>

      <!-- Upload moved into inputgroup as addon -->

      <!-- No separate submit row; submit is inline as an icon button -->
    </form>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        min-width: 0; /* allow flex parents to not clip */
        flex: 1 1 auto;
      }
      .upload-only-wrapper {
        text-align: center;
      }
      .upload-only-btn {
        font-size: 1.05rem;
        padding: 1.1rem 1.4rem;
      }
      .upload-pending {
        border: 2px dashed var(--yellow-400, #facc15) !important;
        background: rgba(250, 204, 21, 0.08) !important;
        color: var(--yellow-400, #facc15) !important;
      }
      .upload-pending .pi {
        color: var(--yellow-400, #facc15);
      }
      .form-shell {
        max-width: 30rem; /* cap field width for clean layout */
        width: 100%;
        margin-inline: auto; /* center inside available space */
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
      /* Ensure the main field (input/select) takes remaining space */
      :host ::ng-deep .p-inputgroup {
        width: 100%;
        display: flex;
      }
      :host ::ng-deep .p-inputgroup > input.p-inputtext,
      :host ::ng-deep .p-inputgroup > select.p-inputtext,
      :host ::ng-deep .p-inputgroup > p-select,
      :host ::ng-deep .p-inputgroup > p-multiSelect,
      :host ::ng-deep .p-inputgroup > .p-select,
      :host ::ng-deep .p-inputgroup > .p-multiselect {
        flex: 1 1 auto;
        min-width: 0; /* prevent overflow */
      }
      :host ::ng-deep .p-inputgroup > input.p-inputtext,
      :host ::ng-deep .p-inputgroup > .p-select,
      :host ::ng-deep .p-inputgroup > .p-multiselect {
        width: 100%;
      }
      :host ::ng-deep .p-inputgroup-addon {
        flex: 0 0 auto; /* addons shouldn't steal width */
      }
      :host ::ng-deep .p-inputgroup-addon > .p-button {
        /* keep addons compact so the field remains wide */
        min-width: 2.75rem;
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
    // Upload-only progression: allow submit when an upload exists (or not required)
    if (this.inputSchema?.kind === 'uploadOnly') {
      if (this.uploadRequired && !this.uploaded) {
        this.inlineMessageText = 'Bitte lade zuerst ein Bild hoch.';
        this.inlineSeverity = 'warn';
        return;
      }
      this.inlineMessageText = null;
      this.submit.emit(this.model);
      return;
    }
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
