import { Component } from '@angular/core';
import { ElectronicInvoice } from "./electronic-invoice/electronic-invoice";
import { Header } from "../header/header";
import { Summary } from "./summary/summary";

@Component({
  selector: 'app-main',
  imports: [ElectronicInvoice, Header, Summary],
  templateUrl: './main.html',
  styles: ``,
})
export class Main {}
