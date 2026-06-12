import { Component, inject } from '@angular/core';

import { NumberingService } from '../../../../services/numbering';

@Component({
  selector: 'app-history',
  imports: [],
  templateUrl: './history.html',
  styles: ``,
})
export class History {
  protected numberingService = inject(NumberingService);
}
