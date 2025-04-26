import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private socket: WebSocket;
  private requestTimestamps: number[] = []; // Lista com timestamps das requisições
  public requestCount$ = new BehaviorSubject<number>(0); // Contador reativo
  logsPorMinuto: { [key: string]: number } = {};
  ofensasPorMinuto: { [key: string]: number } = {};
  public logsPorMinuto$ = new BehaviorSubject<{ [key: string]: number }>({});


  constructor() {
    this.socket = new WebSocket('ws://localhost:8765');

    // Atualizar a contagem de requisições a cada 1 minuto
    interval(60000).subscribe(() => this.updateRequestCount());
  }

  getLogs(): Observable<string> {
    
    return new Observable(observer => {
      this.socket.onopen = () => console.log('Conectado ao servidor WebSocket!');

      this.socket.onmessage = (event) => {
        const agora = new Date();
        const minuto = agora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
        this.logsPorMinuto[minuto] = (this.logsPorMinuto[minuto] || 0) + 1;
      
        // Limitar aos últimos 10 minutos
        const chaves = Object.keys(this.logsPorMinuto);
        if (chaves.length > 10) {
          const maisAntiga = chaves.sort()[0];
          delete this.logsPorMinuto[maisAntiga];
        }

        console.log('Novo log recebido:', event.data);
        observer.next(event.data);

        this.requestTimestamps.push(Date.now()); // Adiciona o horário da requisição
        this.updateRequestCount(); // Atualiza a contagem de requisições
        this.logsPorMinuto$.next({ ...this.logsPorMinuto });

      };

      this.socket.onerror = (error) => {
        console.error('Erro na conexão WebSocket:', error);
        observer.error(error);
      };

      this.socket.onclose = () => {
        console.log('Conexão WebSocket fechada');
        observer.complete();
      };

      return () => {
        console.log('🔴 Desconectando do WebSocket');
        this.socket.close();
      };
    });
  }

  private updateRequestCount(): void {
    const now = Date.now();
    const fifteenMinutesAgo = now - 15 * 60 * 1000;

    // Remover requisições que são mais antigas que 15 minutos
    this.requestTimestamps = this.requestTimestamps.filter(timestamp => timestamp >= fifteenMinutesAgo);

    // Atualiza o contador reativo
    this.requestCount$.next(this.requestTimestamps.length);
  }
}
