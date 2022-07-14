import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, map} from 'rxjs';
import { Member } from './member';
import { MEMBERS } from './mock-members';
import { MessageService } from './message.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private membersUrl = 'api/members';

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
  ) { }

  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.membersUrl).pipe(
      tap(members => this.log(`社員データを取得しました`)),
      catchError(this.handleError<Member[]>('getMembers', []))
    );
  }

  getMember(id: number): Observable<Member | undefined> {
    const url = `${this.membersUrl}/${id}`;
    return this.http.get<Member>(url).pipe(
      tap(_ => this.log(`社員データ(id=${id})を取得しました`)),
      catchError(this.handleError<Member>(`getmember id=${id}`)),
    );
  }

  private log(message: string) {
    this.messageService.add(`MemberService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      this.log(`${operation} 失敗: ${error.message}`);
      return of(result as T);
    }
  }
}
