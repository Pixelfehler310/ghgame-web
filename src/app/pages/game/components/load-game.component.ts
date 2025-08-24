// import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { CardModule } from 'primeng/card';
// import { InputTextModule } from 'primeng/inputtext';
// import { ButtonModule } from 'primeng/button';

// @Component({
//   selector: 'ghg-load-game',
//   standalone: true,
//   imports: [CommonModule, FormsModule, CardModule, InputTextModule, ButtonModule],
//   template: `
//     <p-card header="Load Game" subheader="Fetch by ID" [style]="{ marginBottom: '1rem' }">
//       <div class="formgrid grid">
//         <div class="col">
//           <span class="p-input-icon-left w-full">
//             <i class="pi pi-search"></i>
//             <input pInputText class="w-full" placeholder="Game ID" [(ngModel)]="model" />
//           </span>
//         </div>
//         <div class="col-12 sm:col-3">
//           <button
//             pButton
//             label="Load"
//             icon="pi pi-download"
//             (click)="emitLoad()"
//             [disabled]="loading"
//           ></button>
//         </div>
//       </div>
//     </p-card>
//   `,
// })
// export class LoadGameComponent {
//   @Input() loading = false;
//   @Input() set gameId(value: string) {
//     this.model = value ?? '';
//   }
//   @Output() load = new EventEmitter<string>();

//   protected model = '';

//   emitLoad() {
//     if (!this.model) return;
//     this.load.emit(this.model);
//   }
// }
