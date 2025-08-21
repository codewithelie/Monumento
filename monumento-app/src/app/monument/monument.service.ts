import { Injectable } from '@angular/core';
import { Monument, MonumentData } from './monument.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, tap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonumentService {

  constructor(private http: HttpClient) { }

  getAllMonuments(): Observable<MonumentData[]> {
    
    return this.http.get<Monument<MonumentData[]>>('http://localhost:3000/api/monuments').pipe(

      map((response: Monument<any>) => response.data), 
      tap((response : MonumentData[] ) => console.log(response)),

      catchError ( (error) => {
        console.log(error)
        return of([])
      })

    )
  }

  getMonumentById(monumentId: number): Observable<MonumentData|undefined> {
    return this.http.get<MonumentData>(`api/monuments/${monumentId}`).pipe(

      tap((response : MonumentData ) => console.log(response)),
      
      catchError ( (error) => {
        console.log(error)
        return of(undefined)
      })

    )
  }

  editMonument(monument: MonumentData): Observable<null> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type' : 'application/json'  })
    };

    return this.http.put<null>('api/monuments', monument, httpOptions).pipe(
      tap((response) => console.log(response)),
      catchError ( (error) => {
        console.log(error)
        return of(null)
      })
    )

  }

  searchMonumentList(term: string): Observable<MonumentData[]> {
    return this.http.get<MonumentData[]>(`api/monuments?name=${term}`).pipe(
      tap((response : MonumentData[] ) => console.log(response)),
      catchError ( (error) => {
        console.log(error)
        return of([])
      })
    )
  }

  getAllCountry() {
    return [
      'France',
      'États-Unis',
      'Italie',
      'Royaume-Uni',
      'Inde',
      'Brésil',
      'Égypte',
      'Pérou',
      'Grèce'
    ]
  }
}
