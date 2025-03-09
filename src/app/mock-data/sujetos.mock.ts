// src/app/mock-data/sujetos.mock.ts

import { Sujeto } from '../services/episodio.service';

export const SUJETOS_MOCK: Sujeto[] = [
  // Datos existentes (conservados)
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
  },
  
  // CASO 1: Mismo DNI, diferentes expedientes (para unificar)
  {
    nombreIml: 'IML y CCFF de Palencia, Salamanca y Valladolid',
    numExpediente: 'EX2023050',
    tipoIdentificacion: 'DNI',
    numIdentificacion: '75123456X',
    nombre: 'Manuel',
    apellido1: 'Gómez',
    apellido2: 'Sánchez',
    fechaNacimiento: new Date('1982-03-15'),
    unificado: false
  },
  {
    nombreIml: 'IML y CCFF de Palencia, Salamanca y Valladolid',
    numExpediente: 'EX2023075',
    tipoIdentificacion: 'DNI',
    numIdentificacion: '75123456X',
    nombre: 'Manuel',
    apellido1: 'Gómez',
    apellido2: 'Sánchez',
    fechaNacimiento: new Date('1982-03-15'),
    unificado: false
  },
  
  // CASO 2: Mismo nombre/apellido, diferentes tipos identificación (para unificar)
  {
    nombreIml: 'IML y CCFF de Sevilla',
    numExpediente: 'EX2023101',
    tipoIdentificacion: 'DNI',
    numIdentificacion: '29876543L',
    nombre: 'Ana',
    apellido1: 'Martínez',
    apellido2: 'Crespo',
    fechaNacimiento: new Date('1975-07-22'),
    unificado: false
  },
  {
    nombreIml: 'IML y CCFF de Sevilla',
    numExpediente: 'EX2023130',
    tipoIdentificacion: 'NIF',
    numIdentificacion: '29876543L',
    nombre: 'Ana',
    apellido1: 'Martínez',
    apellido2: 'Crespo',
    fechaNacimiento: new Date('1975-07-22'),
    unificado: false
  },
  
  // CASO 3: Errores en nombres/apellidos - sin tildes (para unificar)
  {
    nombreIml: 'IML y CCFF de Madrid',
    numExpediente: 'EX2023201',
    tipoIdentificacion: 'DNI',
    numIdentificacion: '05432198K',
    nombre: 'José',
    apellido1: 'Fernández',
    apellido2: 'López',
    fechaNacimiento: new Date('1990-10-05'),
    unificado: false
  },
  {
    nombreIml: 'IML y CCFF de Madrid',
    numExpediente: 'EX2023245',
    tipoIdentificacion: 'DNI',
    numIdentificacion: '05432198K',
    nombre: 'José',
    apellido1: 'Fernandez',  // Sin tilde
    apellido2: 'Lopez',      // Sin tilde
    fechaNacimiento: new Date('1990-10-05'),
    unificado: false
  },
  
  // CASO 4: Sujeto ya unificado (para probar el indicador visual)
  {
    nombreIml: 'IML y CCFF de Barcelona',
    numExpediente: 'EX2023301',
    tipoIdentificacion: 'NIE',
    numIdentificacion: 'X1234567Z',
    nombre: 'Elena',
    apellido1: 'García',
    apellido2: 'Ruiz',
    fechaNacimiento: new Date('1988-12-03'),
    unificado: true
  },
  
  // CASO 5: Sujetos indocumentados con mismo nombre (para probar filtro "Solo indocumentados")
  {
    nombreIml: 'IML y CCFF de Valencia',
    numExpediente: 'EX2023401',
    tipoIdentificacion: 'INDOCUMENTADO',
    numIdentificacion: '',
    nombre: 'Mohammed',
    apellido1: 'Al',
    apellido2: 'Hassan',
    fechaNacimiento: new Date('1995-06-18'),
    unificado: false
  },
  {
    nombreIml: 'IML y CCFF de Valencia',
    numExpediente: 'EX2023450',
    tipoIdentificacion: 'INDOCUMENTADO',
    numIdentificacion: '',
    nombre: 'Mohammed',
    apellido1: 'Al',
    apellido2: 'Hassan',
    fechaNacimiento: new Date('1995-06-18'),
    unificado: false
  }
];