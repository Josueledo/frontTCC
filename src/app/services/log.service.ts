import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Observable,
  BehaviorSubject,
  interval,
  map,
  catchError,
  of,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  private socket: WebSocket;
  private requestTimestamps: number[] = []; // Lista com timestamps das requisições
  public requestCount$ = new BehaviorSubject<number>(0); // Contador reativo
  logsPorMinuto: { [key: string]: number } = {};
  ofensasPorMinuto: { [key: string]: number } = {};
  public logsPorMinuto$ = new BehaviorSubject<{ [key: string]: number }>({});
  private allLogs: string[] = [];
  private logsSubject = new BehaviorSubject<string[]>([]);
  public logs$ = this.logsSubject.asObservable();
  private blockedIPs = new Set<string>();
  private blockedIPsSubject = new BehaviorSubject<Set<string>>(this.blockedIPs);

  blockedIPs$ = this.blockedIPsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.socket = new WebSocket('ws://localhost:8765');

    // Atualizar a contagem de requisições a cada 1 minuto
    interval(60000).subscribe(() => this.updateRequestCount());
  }

  getBlockedIPs(): Set<string> {
    return this.blockedIPs;
  }
  getAllLogs(): string[] {
    return this.allLogs;
  }
  checkServerStatus(): Observable<'online' | 'offline'> {
    return this.http
      .get('http://localhost:8080/health', { responseType: 'text' })
      .pipe(
        map(() => 'online' as const),
        catchError(() => of('offline' as const))
      );
  }

  getLogs(): Observable<string> {
    return new Observable((observer) => {
      this.socket.onopen = () =>
        console.log('Conectado ao servidor WebSocket!');

      this.socket.onmessage = (event) => {
        const agora = new Date();
        const minuto = agora.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        this.allLogs.push(event.data);
        this.logsSubject.next([...this.allLogs]); // emite cópia atualizada dos logs

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
  blockIP(ip: string) {
    this.blockedIPs.add(ip);
    this.blockedIPsSubject.next(new Set(this.blockedIPs));
  }

  unblockIP(ip: string) {
    this.blockedIPs.delete(ip);
    this.blockedIPsSubject.next(new Set(this.blockedIPs));
  }

  private updateRequestCount(): void {
    const now = Date.now();
    const fifteenMinutesAgo = now - 15 * 60 * 1000;

    // Remover requisições que são mais antigas que 15 minutos
    this.requestTimestamps = this.requestTimestamps.filter(
      (timestamp) => timestamp >= fifteenMinutesAgo
    );

    // Atualiza o contador reativo
    this.requestCount$.next(this.requestTimestamps.length);
  }
}
