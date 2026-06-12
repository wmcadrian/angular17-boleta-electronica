import { Component } from '@angular/core';
import { Information } from "./information/information";
import { Concepts } from './concepts/concepts';
import { History } from '../history/history';

@Component({
  selector: 'app-electronic-invoice',
  imports: [Information, Concepts, History],
  templateUrl: './electronic-invoice.html',
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class ElectronicInvoice { }
