import { Injectable } from '@angular/core';
import { HttpClient} from "@angular/common/http";
import {HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {Todo} from "../todo";
import {catchError} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class TodosService {

  constructor(private _http: HttpClient) { }

  getTodos(): Observable<any> {
    return this._http.get('/api/v1/todos');
  }

  saveTodo(todo: Todo): Observable<Todo>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    }
    return this._http.post<Todo>('/api/v1/todo', JSON.stringify(todo), httpOptions);
  }

  // Update todo
  updateTodo(todo): Observable<Todo>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    }
    return this._http.put<Todo>('/api/v1/todo/'+todo._id, JSON.stringify(todo), httpOptions);
  }


  deleteTodo(id): Observable<any>{
    return this._http.delete('/api/v1/todo/'+id);
  }
}
