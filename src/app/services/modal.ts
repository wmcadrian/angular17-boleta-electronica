import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ModalConfig {
  tipo: 'exito' | 'error';
  titulo: string;
  mensaje: string;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalState = new BehaviorSubject<ModalConfig | null>(null);

  get modalState$(): Observable<ModalConfig | null> {
    return this.modalState.asObservable();
  }

  mostrar(config: ModalConfig): void {
    this.modalState.next(config);
  }

  cerrar(): void {
    this.modalState.next(null);
  }
}
