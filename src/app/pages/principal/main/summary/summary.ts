import { Component, inject } from '@angular/core';

import { NumberingService } from '../../../../services/numbering';

@Component({
  selector: 'app-summary',
  imports: [],
  templateUrl: './summary.html',
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class Summary {
  private numberingService = inject(NumberingService);

  onConfirmarEmitir(): void {
    this.numberingService.registrarEmision();
  }
}
