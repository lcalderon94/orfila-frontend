// src/app/interfaces/profile.interface.ts
// Crea la carpeta interfaces si no existe
export interface UserProfile {
    id: string;
    nombre: string;
    apellidos: string;
    iml: string;
    rol: string;
    contextos: Contexto[];
  }
  
  export interface Contexto {
    id: string;
    iml: string;
    cargo: string;
    esContextoPrimario: boolean;
  }