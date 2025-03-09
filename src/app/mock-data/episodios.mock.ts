// src/app/mock-data/episodios.mock.ts
import { Episodio, Sujeto } from '../services/episodio.service';

export const MOCK_EPISODIOS: Episodio[] = [
    {
        nEpisodio: 'EP81180',
        tipoSolicitante: 'juzgado',
        direccionSubdireccion: 'IML y CCrF de Palencia, Salamanca y Valladolid',
        tipoOrganismo: 'Juzgado de lo Penal',
        organismo: 'Jdo. de lo Penal Nº 1 de Avila (Ávila)',
        tipoProcedimiento: 'Procedimiento Abreviado',
        nAnio: '123',
        anio: '2023',
        numeroAtestadoAnio: '456',
        anioAtestado: '2023',
        fechaHecho: '2023-05-15',
        nig: ['2807900', '220', '0000123', '2023', 'PA'],
        juzgadoGuardia: false,
        violenciaGenero: false,
        testigoProtegido: false,
        causaConPreso: false,
        secretoSumario: false,
        violenciaDomestica: false,
        urgente: false,
        descripcionEpisodio: 'Descripción del episodio de ejemplo',
        organoAseguradora: 'Jdo. de lo Penal Nº 1 de Avila (Ávila)',
        admResponsable: '02460888A',
        nExpediente: 'EX2013550',
        sujeto: 'Juan Pérez'
      },
      {
        nEpisodio: 'EP81175',
        tipoSolicitante: 'juzgado',
        direccionSubdireccion: 'Sección 1ª de la A. Prov. Ciudad Real',
        tipoOrganismo: 'Juzgado',
        organismo: 'Sección 1ª de la A. Prov. Ciudad Real',
        tipoProcedimiento: 'ABS - Abstención / Recusación Jueces',
        nAnio: '1234591',
        anio: '2022',
        numeroAtestadoAnio: '',
        anioAtestado: '',
        fechaHecho: '2022-07-15 09:15',
        nig: [],
        juzgadoGuardia: false,
        violenciaGenero: false,
        testigoProtegido: false,
        causaConPreso: false,
        secretoSumario: false,
        violenciaDomestica: false,
        urgente: false,
        descripcionEpisodio: '',
        organoAseguradora: 'Sección 1ª de la A. Prov. Ciudad Real',
        admResponsable: '02468888H',
        nExpediente: 'EX2013547',
        sujeto: 'Amadorrr Rivas Merengue'
      },
      {
        nEpisodio: 'EP81173',
        tipoSolicitante: 'juzgado',
        direccionSubdireccion: 'Sección 1ª de la A. Prov. Ciudad Real',
        tipoOrganismo: 'Juzgado',
        organismo: 'Sección 1ª de la A. Prov. Ciudad Real',
        tipoProcedimiento: 'ABS - Abstención / Recusación Jueces',
        nAnio: '1234599',
        anio: '2022',
        numeroAtestadoAnio: '',
        anioAtestado: '',
        fechaHecho: '2022-07-05 08:01',
        nig: [],
        juzgadoGuardia: false,
        violenciaGenero: false,
        testigoProtegido: false,
        causaConPreso: false,
        secretoSumario: false,
        violenciaDomestica: false,
        urgente: false,
        descripcionEpisodio: '',
        organoAseguradora: 'Sección 1ª de la A. Prov. Ciudad Real',
        admResponsable: 'EX2013546',
        nExpediente: 'EX2013546',
        sujeto: 'Antonio Sanche Trolas'
      },
      {
        nEpisodio: 'EP81171',
        tipoSolicitante: 'Aseguradora',
        direccionSubdireccion: 'ZURICH INSURANCE PLC.',
        tipoOrganismo: 'Aseguradora',
        organismo: 'ZURICH INSURANCE PLC. - VIA AUGUSTA, 200 08021 BARCELONA',
        tipoProcedimiento: 'ABS - Abstención / Recusación Secretarios Judiciales',
        nAnio: '',
        anio: '',
        numeroAtestadoAnio: '',
        anioAtestado: '',
        fechaHecho: '',
        nig: [],
        juzgadoGuardia: false,
        violenciaGenero: false,
        testigoProtegido: false,
        causaConPreso: false,
        secretoSumario: false,
        violenciaDomestica: false,
        urgente: false,
        descripcionEpisodio: '',
        organoAseguradora: 'ZURICH INSURANCE PLC.',
        admResponsable: '',
        nExpediente: 'EX2013543',
        sujeto: 'Jimmy Floyd Hasselbaink'
      },
      {
        nEpisodio: 'EP81168',
        tipoSolicitante: 'juzgado',
        direccionSubdireccion: 'Sección 1ª de la A. Prov. Albacete',
        tipoOrganismo: 'Juzgado',
        organismo: 'Sección 1ª de la A. Prov. Albacete',
        tipoProcedimiento: 'ASS - Abstención Secretarios Judiciales',
        nAnio: '',
        anio: '',
        numeroAtestadoAnio: '',
        anioAtestado: '',
        fechaHecho: '',
        nig: [],
        juzgadoGuardia: false,
        violenciaGenero: false,
        testigoProtegido: false,
        causaConPreso: false,
        secretoSumario: false,
        violenciaDomestica: false,
        urgente: false,
        descripcionEpisodio: '',
        organoAseguradora: 'Sección 1ª de la A. Prov. Albacete',
        admResponsable: '',
        nExpediente: 'EX2013541',
        sujeto: 'Luis'
      },
      {
        nEpisodio: 'EP81100',
        tipoSolicitante: 'juzgado',
        direccionSubdireccion: 'IML y CCrF de Palencia, Salamanca y Valladolid',
        tipoOrganismo: 'Juzgado de Primera Instancia',
        organismo: 'Jdo. de Primera Instancia Nº 2 de Valladolid',
        tipoProcedimiento: 'Juicio Verbal',
        nAnio: '234',
        anio: '2023',
        numeroAtestadoAnio: '',
        anioAtestado: '',
        fechaHecho: '2023-03-10',
        nig: [],
        juzgadoGuardia: false,
        violenciaGenero: false,
        testigoProtegido: false,
        causaConPreso: false,
        secretoSumario: false,
        violenciaDomestica: false,
        urgente: false,
        descripcionEpisodio: 'Episodio con sujeto duplicado caso 1',
        organoAseguradora: 'Jdo. de Primera Instancia Nº 2 de Valladolid',
        admResponsable: '02460999B',
        nExpediente: 'EX2023050',
        sujeto: 'Manuel Gómez Sánchez'
      },
      {
        nEpisodio: 'EP81101',
        tipoSolicitante: 'juzgado',
        direccionSubdireccion: 'IML y CCrF de Palencia, Salamanca y Valladolid',
        tipoOrganismo: 'Juzgado de Instrucción',
        organismo: 'Jdo. de Instrucción Nº 3 de Salamanca',
        tipoProcedimiento: 'Diligencias Urgentes',
        nAnio: '421',
        anio: '2023',
        numeroAtestadoAnio: '',
        anioAtestado: '',
        fechaHecho: '2023-04-05',
        nig: [],
        juzgadoGuardia: true,
        violenciaGenero: false,
        testigoProtegido: false,
        causaConPreso: false,
        secretoSumario: false,
        violenciaDomestica: false,
        urgente: true,
        descripcionEpisodio: 'Episodio con sujeto duplicado caso 1',
        organoAseguradora: 'Jdo. de Instrucción Nº 3 de Salamanca',
        admResponsable: '02460999C',
        nExpediente: 'EX2023075',
        sujeto: 'Manuel Gómez Sánchez'
      },

      // CASO 2: Mismo nombre/apellido, diferentes tipos identificación (para unificar)
      {
        nEpisodio: 'EP81102',
        tipoSolicitante: 'juzgado',
        direccionSubdireccion: 'IML y CCFF de Sevilla',
        tipoOrganismo: 'Juzgado de lo Penal',
        organismo: 'Jdo. de lo Penal Nº 4 de Sevilla',
        tipoProcedimiento: 'Procedimiento Abreviado',
        nAnio: '587',
        anio: '2023',
        numeroAtestadoAnio: '789',
        anioAtestado: '2023',
        fechaHecho: '2023-06-20',
        nig: [],
        juzgadoGuardia: false,
        violenciaGenero: false,
        testigoProtegido: false,
        causaConPreso: false,
        secretoSumario: false,
        violenciaDomestica: false,
        urgente: false,
        descripcionEpisodio: 'Episodio con sujeto caso 2: diferentes tipos identificación',
        organoAseguradora: 'Jdo. de lo Penal Nº 4 de Sevilla',
        admResponsable: '02461000D',
        nExpediente: 'EX2023101',
        sujeto: 'Ana Martínez Crespo'
      },
      {
        nEpisodio: 'EP81103',
        tipoSolicitante: 'juzgado',
        direccionSubdireccion: 'IML y CCFF de Sevilla',
        tipoOrganismo: 'Juzgado de lo Social',
        organismo: 'Jdo. de lo Social Nº 2 de Sevilla',
        tipoProcedimiento: 'Procedimiento Ordinario',
        nAnio: '632',
        anio: '2023',
        numeroAtestadoAnio: '',
        anioAtestado: '',
        fechaHecho: '2023-07-12',
        nig: [],
        juzgadoGuardia: false,
        violenciaGenero: false,
        testigoProtegido: false,
        causaConPreso: false,
        secretoSumario: false,
        violenciaDomestica: false,
        urgente: false,
        descripcionEpisodio: 'Episodio con sujeto caso 2: diferentes tipos identificación',
        organoAseguradora: 'Jdo. de lo Social Nº 2 de Sevilla',
        admResponsable: '02461000E',
        nExpediente: 'EX2023130',
        sujeto: 'Ana Martínez Crespo'
      },

      // CASO 3: Errores en nombres/apellidos - sin tildes (para unificar)
      {
        nEpisodio: 'EP81104',
        tipoSolicitante: 'juzgado',
        direccionSubdireccion: 'IML y CCFF de Madrid',
        tipoOrganismo: 'Juzgado de Instrucción',
        organismo: 'Jdo. de Instrucción Nº 5 de Madrid',
        tipoProcedimiento: 'Diligencias Previas',
        nAnio: '842',
        anio: '2023',
        numeroAtestadoAnio: '321',
        anioAtestado: '2023',
        fechaHecho: '2023-09-03',
        nig: [],
        juzgadoGuardia: false,
        violenciaGenero: false,
        testigoProtegido: false,
        causaConPreso: false,
        secretoSumario: false,
        violenciaDomestica: false,
        urgente: false,
        descripcionEpisodio: 'Episodio con sujeto caso 3: con tildes',
        organoAseguradora: 'Jdo. de Instrucción Nº 5 de Madrid',
        admResponsable: '02461000F',
        nExpediente: 'EX2023201',
        sujeto: 'José Fernández López'
      },
      {
        nEpisodio: 'EP81105',
        tipoSolicitante: 'juzgado',
        direccionSubdireccion: 'IML y CCFF de Madrid',
        tipoOrganismo: 'Juzgado de Instrucción',
        organismo: 'Jdo. de Instrucción Nº 7 de Madrid',
        tipoProcedimiento: 'Juicio Inmediato Faltas',
        nAnio: '953',
        anio: '2023',
        numeroAtestadoAnio: '456',
        anioAtestado: '2023',
        fechaHecho: '2023-09-15',
        nig: [],
        juzgadoGuardia: true,
        violenciaGenero: false,
        testigoProtegido: false,
        causaConPreso: false,
        secretoSumario: false,
        violenciaDomestica: false,
        urgente: true,
        descripcionEpisodio: 'Episodio con sujeto caso 3: sin tildes',
        organoAseguradora: 'Jdo. de Instrucción Nº 7 de Madrid',
        admResponsable: '02461000G',
        nExpediente: 'EX2023245',
        sujeto: 'Jose Fernandez Lopez'
      },

      // CASO 4: Sujeto ya unificado (para probar el indicador visual)
      {
        nEpisodio: 'EP81106',
        tipoSolicitante: 'juzgado',
        direccionSubdireccion: 'IML y CCFF de Barcelona',
        tipoOrganismo: 'Juzgado de lo Contencioso',
        organismo: 'Jdo. de lo Contencioso Nº 2 de Barcelona',
        tipoProcedimiento: 'Procedimiento Abreviado',
        nAnio: '753',
        anio: '2023',
        numeroAtestadoAnio: '',
        anioAtestado: '',
        fechaHecho: '2023-10-18',
        nig: [],
        juzgadoGuardia: false,
        violenciaGenero: false,
        testigoProtegido: false,
        causaConPreso: false,
        secretoSumario: false,
        violenciaDomestica: false,
        urgente: false,
        descripcionEpisodio: 'Episodio con sujeto caso 4: ya unificado',
        organoAseguradora: 'Jdo. de lo Contencioso Nº 2 de Barcelona',
        admResponsable: '02461000H',
        nExpediente: 'EX2023301',
        sujeto: 'Elena García Ruiz'
      },

      // CASO 5: Sujetos indocumentados con mismo nombre
      {
        nEpisodio: 'EP81107',
        tipoSolicitante: 'juzgado',
        direccionSubdireccion: 'IML y CCFF de Valencia',
        tipoOrganismo: 'Juzgado de Instrucción',
        organismo: 'Jdo. de Instrucción Nº 3 de Valencia',
        tipoProcedimiento: 'Diligencias Previas',
        nAnio: '854',
        anio: '2023',
        numeroAtestadoAnio: '567',
        anioAtestado: '2023',
        fechaHecho: '2023-06-05',
        nig: [],
        juzgadoGuardia: false,
        violenciaGenero: false,
        testigoProtegido: false,
        causaConPreso: false,
        secretoSumario: false,
        violenciaDomestica: false,
        urgente: false,
        descripcionEpisodio: 'Episodio con sujeto caso 5: indocumentado',
        organoAseguradora: 'Jdo. de Instrucción Nº 3 de Valencia',
        admResponsable: '02461000I',
        nExpediente: 'EX2023401',
        sujeto: 'Mohammed Al Hassan'
      },
      {
        nEpisodio: 'EP81108',
        tipoSolicitante: 'juzgado',
        direccionSubdireccion: 'IML y CCFF de Valencia',
        tipoOrganismo: 'Juzgado de Instrucción',
        organismo: 'Jdo. de Instrucción Nº 5 de Valencia',
        tipoProcedimiento: 'Diligencias Previas',
        nAnio: '921',
        anio: '2023',
        numeroAtestadoAnio: '589',
        anioAtestado: '2023',
        fechaHecho: '2023-07-12',
        nig: [],
        juzgadoGuardia: false,
        violenciaGenero: false,
        testigoProtegido: false,
        causaConPreso: false,
        secretoSumario: false,
        violenciaDomestica: false,
        urgente: false,
        descripcionEpisodio: 'Episodio con sujeto caso 5: indocumentado',
        organoAseguradora: 'Jdo. de Instrucción Nº 5 de Valencia',
        admResponsable: '02461000J',
        nExpediente: 'EX2023450',
        sujeto: 'Mohammed Al Hassan'
      },

      // CASO 6: Un episodio con múltiples sujetos, algunos duplicados
      {
        nEpisodio: 'EP81109',
        tipoSolicitante: 'juzgado',
        direccionSubdireccion: 'IML y CCFF de Ciudad Real y Toledo',
        tipoOrganismo: 'Juzgado de Instrucción',
        organismo: 'Jdo. de Instrucción Nº 2 de Ciudad Real',
        tipoProcedimiento: 'Diligencias Previas',
        nAnio: '1024',
        anio: '2023',
        numeroAtestadoAnio: '675',
        anioAtestado: '2023',
        fechaHecho: '2023-08-20',
        nig: [],
        juzgadoGuardia: false,
        violenciaGenero: false,
        testigoProtegido: false,
        causaConPreso: false,
        secretoSumario: false,
        violenciaDomestica: false,
        urgente: false,
        descripcionEpisodio: 'Episodio con múltiples sujetos, algunos duplicados',
        organoAseguradora: 'Jdo. de Instrucción Nº 2 de Ciudad Real',
        admResponsable: '02461000K',
        nExpediente: 'EX2013555',
        sujeto: 'Santiaga Ruano (y otros)'
      }
    ];

export const MOCK_SUJETOS: Map<string, Sujeto[]> = new Map([
  // Episodios originales (mantenidos)
  ['EP81180', [
      {
        nombreIml: 'IML y CCrF de Palencia, Salamanca y Valladolid',
        numExpediente: 'EX2013550',
        tipoIdentificacion: 'DNI',
        numIdentificacion: '12345678A',
        nombre: 'Juan',
        apellido1: 'Pérez',
        apellido2: 'García',
        fechaNacimiento: '1980-01-01',
        unificado: false
      }
  ]],
  ['EP81175', [
      {
        nombreIml: 'Sección 1ª de la A. Prov. Ciudad Real',
        numExpediente: 'EX2013547',
        tipoIdentificacion: 'DNI',
        numIdentificacion: '87654321B',
        nombre: 'Amadorrr',
        apellido1: 'Rivas',
        apellido2: 'Merengue',
        fechaNacimiento: '1990-12-25',
        unificado: false
      }
  ]],
  ['EP81173', [
      {
        nombreIml: 'Sección 1ª de la A. Prov. Ciudad Real',
        numExpediente: 'EX2013546',
        tipoIdentificacion: 'DNI',
        numIdentificacion: '11111111C',
        nombre: 'Antonio',
        apellido1: 'Sanche',
        apellido2: 'Trolas',
        fechaNacimiento: '1985-06-15',
        unificado: false
      }
  ]],

  // CASO 1: Mismo DNI, diferentes expedientes (para unificar)
  ['EP81100', [
      {
        nombreIml: 'IML y CCrF de Palencia, Salamanca y Valladolid',
        numExpediente: 'EX2023050',
        tipoIdentificacion: 'DNI',
        numIdentificacion: '75123456X',
        nombre: 'Manuel',
        apellido1: 'Gómez',
        apellido2: 'Sánchez',
        fechaNacimiento: '1982-03-15',
        unificado: false
      }
  ]],
  ['EP81101', [
      {
        nombreIml: 'IML y CCrF de Palencia, Salamanca y Valladolid',
        numExpediente: 'EX2023075',
        tipoIdentificacion: 'DNI',
        numIdentificacion: '75123456X',
        nombre: 'Manuel',
        apellido1: 'Gómez',
        apellido2: 'Sánchez',
        fechaNacimiento: '1982-03-15',
        unificado: false
      }
  ]],
  
  // CASO 2: Mismo nombre/apellido, diferentes tipos identificación (para unificar)
  ['EP81102', [
      {
        nombreIml: 'IML y CCFF de Sevilla',
        numExpediente: 'EX2023101',
        tipoIdentificacion: 'DNI',
        numIdentificacion: '29876543L',
        nombre: 'Ana',
        apellido1: 'Martínez',
        apellido2: 'Crespo',
        fechaNacimiento: '1975-07-22',
        unificado: false
      }
  ]],
  ['EP81103', [
      {
        nombreIml: 'IML y CCFF de Sevilla',
        numExpediente: 'EX2023130',
        tipoIdentificacion: 'NIF',
        numIdentificacion: '29876543L',
        nombre: 'Ana',
        apellido1: 'Martínez',
        apellido2: 'Crespo',
        fechaNacimiento: '1975-07-22',
        unificado: false
      }
  ]],
  
  // CASO 3: Errores en nombres/apellidos - sin tildes (para unificar)
  ['EP81104', [
      {
        nombreIml: 'IML y CCFF de Madrid',
        numExpediente: 'EX2023201',
        tipoIdentificacion: 'DNI',
        numIdentificacion: '05432198K',
        nombre: 'José',
        apellido1: 'Fernández',
        apellido2: 'López',
        fechaNacimiento: '1990-10-05',
        unificado: false
      }
  ]],
  ['EP81105', [
      {
        nombreIml: 'IML y CCFF de Madrid',
        numExpediente: 'EX2023245',
        tipoIdentificacion: 'DNI',
        numIdentificacion: '05432198K',
        nombre: 'José',
        apellido1: 'Fernandez',  // Sin tilde
        apellido2: 'Lopez',      // Sin tilde
        fechaNacimiento: '1990-10-05',
        unificado: false
      }
  ]],
  
  // CASO 4: Sujeto ya unificado (para probar el indicador visual)
  ['EP81106', [
      {
        nombreIml: 'IML y CCFF de Barcelona',
        numExpediente: 'EX2023301',
        tipoIdentificacion: 'NIE',
        numIdentificacion: 'X1234567Z',
        nombre: 'Elena',
        apellido1: 'García',
        apellido2: 'Ruiz',
        fechaNacimiento: '1988-12-03',
        unificado: true
      }
  ]],
  
  // CASO 5: Sujetos indocumentados con mismo nombre (para probar filtro "Solo indocumentados")
  ['EP81107', [
      {
        nombreIml: 'IML y CCFF de Valencia',
        numExpediente: 'EX2023401',
        tipoIdentificacion: 'INDOCUMENTADO',
        numIdentificacion: '',
        nombre: 'Mohammed',
        apellido1: 'Al',
        apellido2: 'Hassan',
        fechaNacimiento: '1995-06-18',
        unificado: false
      }
  ]],
  ['EP81108', [
      {
        nombreIml: 'IML y CCFF de Valencia',
        numExpediente: 'EX2023450',
        tipoIdentificacion: 'INDOCUMENTADO',
        numIdentificacion: '',
        nombre: 'Mohammed',
        apellido1: 'Al',
        apellido2: 'Hassan',
        fechaNacimiento: '1995-06-18',
        unificado: false
      }
  ]],
  
  // CASO 6: Un episodio con múltiples sujetos, algunos duplicados
  ['EP81109', [
      {
        nombreIml: 'IML y CCFF de Ciudad Real y Toledo',
        numExpediente: 'EX2013555',
        tipoIdentificacion: 'NIF',
        numIdentificacion: '51928493J',
        nombre: 'Santiaga',
        apellido1: 'Ruano',
        apellido2: '',
        fechaNacimiento: '1978-09-03',
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
        fechaNacimiento: '1978-09-03',
        unificado: false
      },
      {
        nombreIml: 'IML y CCFF de Ciudad Real y Toledo',
        numExpediente: 'EX2013570',
        tipoIdentificacion: 'DNI',
        numIdentificacion: '76543210M',
        nombre: 'Carlos',
        apellido1: 'Martín',
        apellido2: 'Vega',
        fechaNacimiento: '1983-11-14',
        unificado: false
      }
  ]]

]);