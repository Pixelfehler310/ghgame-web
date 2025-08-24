import { Component, Input } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'ghg-response-panel',
  standalone: true,
  imports: [CommonModule, CardModule, JsonPipe],
  template: `
    <p-card header="Response">
      <pre class="m-0">{{ data | json }}</pre>
    </p-card>
  `,
})
export class ResponsePanelComponent {
  @Input() data: any;
}
