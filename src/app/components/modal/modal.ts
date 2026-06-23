import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.html',
})
export class Modal {
  tipo = input<'exito' | 'error'>('exito');
  titulo = input('');
  mensaje = input('');

  cerrado = output<void>();

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cerrado.emit();
    }
  }
}
