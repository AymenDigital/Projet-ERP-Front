import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from 'app/shared/models/Employee';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
 
  private apiUrl = 'http://localhost:8084/rh/resource';

  constructor(private http: HttpClient) { 

  }
/******* API InternalResource ********/
 // Get All InetrnalResource
getItems(): Observable<Employee[]> {
  return this.http.get<Employee[]>(this.apiUrl + '/getAll').pipe(
    catchError(this.handleError)
  );
}

getItem(id: number): Observable<Employee> {
  const url = `${this.apiUrl}/get/${id}`;
  return this.http.get<Employee>(url).pipe(
    catchError(this.handleError)
  );
}

 // DELETE  Resource by id
 deleteItem(id: number): Observable<Employee> {
  const url = `${this.apiUrl+'/delete'}/${id}`;
  return this.http.delete<Employee>(url).pipe(
    catchError(this.handleError)
  );
}
/******* API ExternalResource ********/
 // Get All ExternaResource
getItemsExternal(): Observable<Employee[]> {
  return this.http.get<Employee[]>(this.apiUrl + '/getAllResourcesExterne').pipe(
    catchError(this.handleError)
  );
}

/******* API BackOfficeResource ********/
 // Get All BackOfficeResource
getItemsBackOffice(): Observable<Employee[]> {
  return this.http.get<Employee[]>(this.apiUrl + '/getAllResourcesBackOffice').pipe(
    catchError(this.handleError)
  );
}
getItemResponsable():Observable<Employee[]>{
  return this.http.get<Employee[]>(this.apiUrl + '/chefs').pipe(
    catchError(this.handleError))
}
getItemNoResponsable():Observable<Employee[]>{
  return this.http.get<Employee[]>(this.apiUrl + '/Nochefs').pipe(
    catchError(this.handleError))
}

private handleError(error: HttpErrorResponse) {
  if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error.message);
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong.
    console.error(
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error}`);
  }
  // Return an observable with a user-facing error message.
  return throwError(
    'Something bad happened; please try again later.');
}

  
}
