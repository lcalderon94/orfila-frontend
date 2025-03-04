// src/app/mock-data/sujetos.mock.ts

import { Sujeto } from '../services/episodio.service';

export const SUJETOS_MOCK: Sujeto[] = [
  {
    nombreIml: 'IML y CCFF de Ciudad Real y Toledo',
    numExpediente: 'EX2013555',
    tipoIdentificacion: 'NIF',
    numIdentificacion: '51928493J',
    nombre: 'Santiaga',
    apellido1: 'Ruano',
    apellido2: '',
    unificado: false
  },
  {
    nombreIml: 'IML y CCFF de Ciudad Real y Toledo', 
    numExpediente: 'EX2013549',
    tipoIdentificacion: 'DNI',
    numIdentificacion: '51928493J',
    nombre: 'Santiaga',
    apellido1: 'López',
    apellido2: '',
    fechaNacimiento: new Date('1978-09-03'),
    unificado: false
  }
];