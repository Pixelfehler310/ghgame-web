// import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { CardModule } from 'primeng/card';
// import { InputTextModule } from 'primeng/inputtext';
// import { ButtonModule } from 'primeng/button';
// import { GameState } from '../../../models/game.models';

// @Component({
//   selector: 'ghg-save-game',
//   standalone: true,
//   imports: [CommonModule, FormsModule, CardModule, InputTextModule, ButtonModule],
//   template: `
//     <p-card header="Save Game" subheader="State">
//       <div class="p-fluid formgrid grid">
//         <div class="col-12">
//           <label class="block mb-1">Name</label>
//           <input pInputText [(ngModel)]="local.name" placeholder="Player name" />
//         </div>
//         <div class="col-12">
//           <label class="block mb-1">Score</label>
//           <input type="number" pInputText [(ngModel)]="local.score" />
//         </div>
//         <div class="col-12">
//           <button
//             pButton
//             label="Save"
//             icon="pi pi-save"
//             class="p-button-primary"
//             (click)="emitSave()"
//             [disabled]="loading"
//           ></button>
//         </div>
//       </div>
//     </p-card>
//   `,
// })
// export class SaveGameComponent {
//   @Input() loading = false;
//   @Input() set state(value: GameState | null) {
//     this.local = { name: '', score: 0, ...(value ?? {}) } as GameState;
//   }
//   @Output() save = new EventEmitter<GameState>();

//   protected local: GameState = { name: '', score: 0 };

//   emitSave() {
//     this.save.emit(this.local);
//   }
// }
