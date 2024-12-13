import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserProfile } from '../interfaces/profile.interface';

@Injectable({
  providedIn: 'root'
})
export class MockAuthService {
  private mockUsers: UserProfile[] = [
    {
      id: '1',
      nombre: 'Carolina',
      apellidos: 'Aranda Ramírez',
      iml: 'IML y CCrF de Ciudad Real y Toledo',
      rol: 'Director IML',
      contextos: [
        {
          id: '1',
          iml: 'IML y CCrF de Ciudad Real y Toledo',
          cargo: 'Director IML',
          esContextoPrimario: true
        }
      ]
    },
    {
      id: '2',
      nombre: 'María Isabel',
      apellidos: 'Rodríguez Álvarez',
      iml: 'IML y CCrF de Ciudad Real y Toledo',
      rol: 'Médico Forense',
      contextos: [
        {
          id: '2',
          iml: 'IML y CCrF de Ciudad Real y Toledo',
          cargo: 'Médico Forense',
          esContextoPrimario: true
        }
      ]
    },
    {
      id: '3',
      nombre: 'Todo',
      apellidos: 'Álvarez Córdoba',
      iml: 'IML y CCrF de Ciudad Real y Toledo',
      rol: 'Administrativo IML',
      contextos: [
        {
          id: '3',
          iml: 'IML y CCrF de Ciudad Real y Toledo',
          cargo: 'Administrativo',
          esContextoPrimario: true
        }
      ]
    }
  ];

  private currentProfileSubject = new BehaviorSubject<UserProfile | null>(this.mockUsers[0]);

  constructor() {}

  getMockUsers(): UserProfile[] {
    return this.mockUsers;
  }

  getCurrentProfile(): Observable<UserProfile | null> {
    return this.currentProfileSubject.asObservable();
  }

  switchUser(userId: string) {
    const user = this.mockUsers.find(u => u.id === userId);
    if (user) {
      this.currentProfileSubject.next(user);
    }
  }
}