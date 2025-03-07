// src/app/mock-data/tareas.mock.ts

import { Tarea } from '../components/tareas/tareas.component';




interface TareaCompleta {
  tarea: Tarea;
  episodio: Episodio;
  sujetos: Sujeto[];
  actuacion: Actuacion;
}

export interface Actuacion {
  fechaRegistro: Date;
  tipoAsistencia: string;
  sujetoPrincipal: string;
  tipoPerito: string;
  responsable: string;
  nActuacion: string;
  fechaInicio?: Date;
  observacionActuacion?: string;
  estado: 'abierta' | 'finalizada';
  prioridad: boolean;
  sujetos: string[];
  hojaEvolucion?: HojaEvolucion[];
  documentosAsociados?: DocumentoAsociado[];
  citaciones?: CitacionActuacion[];
}

export interface HojaEvolucion {
  fecha: Date;
  usuario: string;
  detalle: string;
}

export interface DocumentoAsociado {
  id: string;
  nombre: string;
  tipo: string;
  estado: string;
  fechaCreacion: Date;
  autor: string;
  descLexnet?: string;
  numAnio?: string;
  numEpisodio: string;
  autorInforme?: string;
}

export interface CitacionActuacion {
  fecha: Date;
  hora: string;
  lugar: string;
  perito: string;
  observaciones?: string;
}

export interface Sujeto {
  nombreIml: string;
  numExpediente: string;
  tipoIdentificacion: string;
  numIdentificacion: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  fechaNacimiento?: string | Date;
  unificado?: boolean;
}

export interface Episodio {
  nEpisodio: string;
  tipoSolicitante: string;
  direccionSubdireccion: string;
  tipoOrganismo: string;
  organismo: string;
  tipoProcedimiento: string;
  nAnio: string;
  anio: string;
  numeroAtestadoAnio: string;
  anioAtestado: string;
  fechaHecho: string;
  nig: string[];
  juzgadoGuardia: boolean;
  violenciaGenero: boolean;
  testigoProtegido: boolean;
  causaConPreso: boolean;
  secretoSumario: boolean;
  violenciaDomestica: boolean;
  urgente: boolean;
  descripcionEpisodio: string;
  organoAseguradora: string;
  admResponsable: string;
  nExpediente: string;
  sujeto: string;
}

enum TipoPerito {
  MEDICO_FORENSE = 'Médico Forense',
  PSICOLOGO = 'Psicólogo',
  TRABAJADOR_SOCIAL = 'Trabajador Social',
  FACULTATIVO = 'Facultativo',
  EDUCADOR_SOCIAL = 'Educador Social'
}

enum TipoAsistencia {
  ANALISIS_GENETICO = 'Análisis Genético',
  AUTOPSIA = 'Levantamiento de cadáver-autopsia',
  INFORME_SOCIAL = 'Informe social genérico',
  VALORACION_PSICOLOGICA = 'Valoración psicológica general',
  LESIONES_TRAFICO = 'Lesiones de tráfico (pericia extrajudicial)',
  DELITOS_LIBERTAD_SEXUAL = 'Delitos contra la Libertad Sexual',
  MUERTE_SUBITA = 'Muerte Súbita',
  PERICIA_PSICOLOGICA = 'Pericia Psicológica'
}

enum TipoTasaPericial {
  SIN_INGRESO = 'Pericia lesiones sin ingreso hospitalario',
  INGRESO_MENOR_72 = 'Pericia lesiones con ingreso hospitalario igual o inferior a 72 horas',
  INGRESO_MAYOR_72 = 'Pericia lesiones con ingreso hospitalario superior a 72 horas'
}

// src/app/mock-data/tareas.mock.ts
export const MOCK_TAREAS: Tarea[] = [
  {
    organo: 'Jdo. de lo Penal Nº 1 de Salamanca',
    numEpisodio: '81329',
    tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
    numAnio: '000025/2022',
    tipoAsistencia: 'Análisis Genético',
    numExpediente: 'EX2017586',
    sujetos: ['Maria Isabel Rodriguez Alvarez', 'Juan Pérez'], // Ejemplo con múltiples sujetos
    responsable: '30000332C',
    prioridad: true
  },
  {
    organo: 'Sección 2ª de la A. Prov. Valladolid',
    numEpisodio: '81136',
    tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
    numAnio: '000002/2022',
    tipoAsistencia: 'Análisis Genético',
    numExpediente: 'EX2013527',
    sujetos: ['-'],
    responsable: '',
    grupal: true
  },
  {
    organo: 'Abog. CCAA de CASTILLA Y LEON',
    numEpisodio: '81336',
    tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
    numAnio: '000001/2022',
    tipoAsistencia: 'Informe social genérico',
    numExpediente: 'EX2013607',
    sujetos: ['Antonio Orozco'],
    responsable: '30000332C'
  },
  {
    organo: 'Jdo. de lo Penal Nº 1 de Salamanca',
    numEpisodio: '81320',
    tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
    numAnio: '000001/2022',
    tipoAsistencia: 'Autopsia',
    numExpediente: 'EX2013586',
    sujetos: ['Maria Isabel Rodriguez Alvarez'],
    responsable: '',
    nuevoDocumento: true
  },
  {
    organo: 'Jdo. de lo Penal Nº 1 de Salamanca',
    numEpisodio: '81305',
    tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
    numAnio: '000002/2022',
    tipoAsistencia: 'Valoración psicológica general',
    numExpediente: 'EX2013585',
    sujetos: ['Maria Isabel Rodriguez Alvarez'],
    responsable: '30000328W'
  }
  ];

  export const TAREAS_COMPLETAS: { [key: string]: TareaCompleta } = {
    '81329': {
      tarea: {
        organo: 'Jdo. de lo Penal Nº 1 de Salamanca',
        numEpisodio: '81329',
        tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
        numAnio: '000025/2022',
        tipoAsistencia: 'Análisis Genético',
        numExpediente: 'EX2017586',
        sujetos: ['Maria Isabel Rodriguez Alvarez', 'Juan Pérez'],
        responsable: '30000332C',
        prioridad: true
      },
      episodio: {
        nEpisodio: 'EP81329',
        tipoSolicitante: 'juzgado',
        direccionSubdireccion: 'IML y CCrF de Palencia, Salamanca y Valladolid',
        tipoOrganismo: 'Juzgado de lo Penal',
        organismo: 'Jdo. de lo Penal Nº 1 de Salamanca',
        tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
        nAnio: '000025',
        anio: '2022',
        numeroAtestadoAnio: '456',
        anioAtestado: '2022',
        fechaHecho: '2022-07-27',
        nig: ['2807900', '220', '0000123', '2022', 'ASS'],
        juzgadoGuardia: false,
        violenciaGenero: false,
        testigoProtegido: false,
        causaConPreso: false,
        secretoSumario: false,
        violenciaDomestica: false,
        urgente: true,
        descripcionEpisodio: 'Descripción detallada del episodio de ejemplo para análisis genético',
        organoAseguradora: 'Jdo. de lo Penal Nº 1 de Salamanca',
        admResponsable: '30000332C',
        nExpediente: 'EX2017586',
        sujeto: 'Maria Isabel Rodriguez Alvarez'
      },
      sujetos: [
        {
          nombreIml: 'IML y CCrF de Palencia, Salamanca y Valladolid',
          numExpediente: 'EX2017586',
          tipoIdentificacion: 'DNI',
          numIdentificacion: '12345678A',
          nombre: 'Maria Isabel',
          apellido1: 'Rodriguez',
          apellido2: 'Alvarez',
          fechaNacimiento: '1985-03-15'
        },
        {
          nombreIml: 'IML y CCrF de Palencia, Salamanca y Valladolid',
          numExpediente: 'EX2017587',
          tipoIdentificacion: 'DNI',
          numIdentificacion: '87654321B',
          nombre: 'Juan',
          apellido1: 'Pérez',
          apellido2: 'García',
          fechaNacimiento: '1982-08-22'
        }
      ],
      actuacion: {
        fechaRegistro: new Date('2022-07-27'),
        tipoAsistencia: 'Análisis Genético',
        sujetoPrincipal: 'Maria Isabel Rodriguez Alvarez',
        tipoPerito: 'Médico Forense',
        responsable: '30000332C',
        nActuacion: '1505',
        fechaInicio: new Date('2022-07-27'),
        observacionActuacion: 'Solicitud de análisis genético para determinación de parentesco',
        estado: 'abierta',
        prioridad: true,
        sujetos: ['Maria Isabel Rodriguez Alvarez', 'Juan Pérez'],
        hojaEvolucion: [
          {
            fecha: new Date('2022-07-27'),
            usuario: '30000332C',
            detalle: 'Inicio de la actuación pericial'
          },
          {
            fecha: new Date('2022-07-28'),
            usuario: '30000332C',
            detalle: 'Toma de muestras realizada'
          }
        ],
        documentosAsociados: [
          {
            id: 'DOC001',
            nombre: 'Informe_Preliminar.pdf',
            tipo: 'Informe',
            estado: 'Completado',
            fechaCreacion: new Date('2022-07-27'),
            autor: '30000332C',
            numEpisodio: '81329' // Añadido el campo numEpisodio
          },
          {
            id: 'DOC002',
            nombre: 'Solicitud_Análisis.pdf',
            tipo: 'Solicitud',
            estado: 'Firmado',
            fechaCreacion: new Date('2022-07-27'),
            autor: '30000332C',
            numEpisodio: '81329' // Añadido el campo numEpisodio
          }
        ],
        citaciones: [
          {
            fecha: new Date('2022-08-15'),
            hora: '10:00',
            lugar: 'Sala 3 - IML Salamanca',
            perito: '30000332C',
            observaciones: 'Traer documentación identificativa'
          }
        ]
      }
    },
    '81136': {
    tarea: {
      organo: 'Sección 2ª de la A. Prov. Valladolid',
      numEpisodio: '81136',
      tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
      numAnio: '000002/2022',
      tipoAsistencia: 'Análisis Genético',
      numExpediente: 'EX2013527',
      sujetos: ['-'],
      responsable: '',
      grupal: true
    },
    episodio: {
      nEpisodio: 'EP81136',
      tipoSolicitante: 'juzgado',
      direccionSubdireccion: 'IML y CCrF de Palencia, Salamanca y Valladolid',
      tipoOrganismo: 'Audiencia Provincial',
      organismo: 'Sección 2ª de la A. Prov. Valladolid',
      tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
      nAnio: '000002',
      anio: '2022',
      numeroAtestadoAnio: '',
      anioAtestado: '',
      fechaHecho: '2022-07-15',
      nig: ['2807900', '220', '0000124', '2022', 'ASS'],
      juzgadoGuardia: false,
      violenciaGenero: false,
      testigoProtegido: false,
      causaConPreso: false,
      secretoSumario: false,
      violenciaDomestica: false,
      urgente: false,
      descripcionEpisodio: 'Asistencia secretarios judiciales pendiente de asignación',
      organoAseguradora: 'Sección 2ª de la A. Prov. Valladolid',
      admResponsable: '',
      nExpediente: 'EX2013527',
      sujeto: '-'
    },
    sujetos: [], // No hay sujetos asociados aún
    actuacion: {
      fechaRegistro: new Date('2022-07-15'),
      tipoAsistencia: 'Análisis Genético',
      sujetoPrincipal: '-',
      tipoPerito: 'Médico Forense',
      responsable: '',
      nActuacion: '1506',
      fechaInicio: new Date('2022-07-15'),
      observacionActuacion: 'Pendiente de asignación de perito responsable',
      estado: 'abierta',
      prioridad: false,
      sujetos: ['-'],
      hojaEvolucion: [],
      documentosAsociados: [],
      citaciones: []
    }
  },
  '81336': {
    tarea: {
      organo: 'Abog. CCAA de CASTILLA Y LEON',
      numEpisodio: '81336',
      tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
      numAnio: '000001/2022',
      tipoAsistencia: 'Informe social genérico',
      numExpediente: 'EX2013607',
      sujetos: ['Antonio Orozco'],
      responsable: '30000332C'
    },
    episodio: {
      nEpisodio: 'EP81336',
      tipoSolicitante: 'juzgado',
      direccionSubdireccion: 'IML y CCrF de Palencia, Salamanca y Valladolid',
      tipoOrganismo: 'Abogacía',
      organismo: 'Abog. CCAA de CASTILLA Y LEON',
      tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
      nAnio: '000001',
      anio: '2022',
      numeroAtestadoAnio: '',
      anioAtestado: '',
      fechaHecho: '2022-07-20',
      nig: ['2807900', '220', '0000125', '2022', 'ASS'],
      juzgadoGuardia: false,
      violenciaGenero: false,
      testigoProtegido: false,
      causaConPreso: false,
      secretoSumario: false,
      violenciaDomestica: false,
      urgente: false,
      descripcionEpisodio: 'Solicitud de informe social para evaluación de caso',
      organoAseguradora: 'Abog. CCAA de CASTILLA Y LEON',
      admResponsable: '30000332C',
      nExpediente: 'EX2013607',
      sujeto: 'Antonio Orozco'
    },
    sujetos: [
      {
        nombreIml: 'IML y CCrF de Palencia, Salamanca y Valladolid',
        numExpediente: 'EX2013607',
        tipoIdentificacion: 'DNI',
        numIdentificacion: '23456789C',
        nombre: 'Antonio',
        apellido1: 'Orozco',
        apellido2: 'Sanz',
        fechaNacimiento: '1979-11-23'
      }
    ],
    actuacion: {
      fechaRegistro: new Date('2022-07-20'),
      tipoAsistencia: 'Informe social genérico',
      sujetoPrincipal: 'Antonio Orozco',
      tipoPerito: TipoPerito.TRABAJADOR_SOCIAL,
      responsable: '30000332C',
      nActuacion: '1507',
      fechaInicio: new Date('2022-07-20'),
      observacionActuacion: 'Evaluación social requerida por la Abogacía de la CCAA',
      estado: 'abierta',
      prioridad: false,
      sujetos: ['Antonio Orozco'],
      hojaEvolucion: [
        {
          fecha: new Date('2022-07-20'),
          usuario: '30000332C',
          detalle: 'Inicio de evaluación social'
        }
      ],
      documentosAsociados: [
        {
          id: 'DOC003',
          nombre: 'Solicitud_Informe_Social.pdf',
          tipo: 'Solicitud',
          estado: 'Firmado',
          fechaCreacion: new Date('2022-07-20'),
          autor: '30000332C',
          numEpisodio: '81336' // Añadido el campo numEpisodio
        }
      ],
      citaciones: [
        {
          fecha: new Date('2022-07-25'),
          hora: '11:30',
          lugar: 'Despacho 2 - IML Valladolid',
          perito: '30000332C',
          observaciones: 'Entrevista inicial evaluación social'
        }
      ]
    }
  },
  '81320': {
    tarea: {
      organo: 'Jdo. de lo Penal Nº 1 de Salamanca',
      numEpisodio: '81320',
      tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
      numAnio: '000001/2022',
      tipoAsistencia: TipoAsistencia.AUTOPSIA,
      numExpediente: 'EX2013586',
      sujetos: ['Maria Isabel Rodriguez Alvarez'],
      responsable: '',
      nuevoDocumento: true
    },
    episodio: {
      nEpisodio: 'EP81320',
      tipoSolicitante: 'juzgado',
      direccionSubdireccion: 'IML y CCrF de Palencia, Salamanca y Valladolid',
      tipoOrganismo: 'Juzgado de lo Penal',
      organismo: 'Jdo. de lo Penal Nº 1 de Salamanca',
      tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
      nAnio: '000001',
      anio: '2022',
      numeroAtestadoAnio: '',
      anioAtestado: '',
      fechaHecho: '2022-07-22',
      nig: ['2807900', '220', '0000126', '2022', 'ASS'],
      juzgadoGuardia: false,
      violenciaGenero: false,
      testigoProtegido: false,
      causaConPreso: false,
      secretoSumario: false,
      violenciaDomestica: false,
      urgente: false,
      descripcionEpisodio: 'Solicitud de autopsia pendiente de asignación',
      organoAseguradora: 'Jdo. de lo Penal Nº 1 de Salamanca',
      admResponsable: '',
      nExpediente: 'EX2013586',
      sujeto: 'Maria Isabel Rodriguez Alvarez'
    },
    sujetos: [
      {
        nombreIml: 'IML y CCrF de Palencia, Salamanca y Valladolid',
        numExpediente: 'EX2013586',
        tipoIdentificacion: 'DNI',
        numIdentificacion: '12345678A',
        nombre: 'Maria Isabel',
        apellido1: 'Rodriguez',
        apellido2: 'Alvarez',
        fechaNacimiento: '1985-03-15'
      }
    ],
    actuacion: {
      fechaRegistro: new Date('2022-07-22'),
      tipoAsistencia: TipoAsistencia.AUTOPSIA,
      sujetoPrincipal: 'Maria Isabel Rodriguez Alvarez',
      tipoPerito: TipoPerito.MEDICO_FORENSE,
      responsable: '',
      nActuacion: '1510',
      fechaInicio: new Date('2022-07-22'),
      observacionActuacion: 'Solicitud de autopsia pendiente de asignar perito',
      estado: 'abierta',
      prioridad: false,
      sujetos: ['Maria Isabel Rodriguez Alvarez'],
      documentosAsociados: [
        {
          id: 'DOC004',
          nombre: 'Solicitud_Autopsia.pdf',
          tipo: 'Solicitud',
          estado: 'Firmado',
          fechaCreacion: new Date('2022-07-22'),
          autor: '30000332C',
          numEpisodio: '81320' // Añadido el campo numEpisodio
        }
      ],
      citaciones: []
    }
  },
  '81305': {
    tarea: {
      organo: 'Jdo. de lo Penal Nº 1 de Salamanca',
      numEpisodio: '81305',
      tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
      numAnio: '000002/2022',
      tipoAsistencia: TipoAsistencia.VALORACION_PSICOLOGICA,
      numExpediente: 'EX2013585',
      sujetos: ['Maria Isabel Rodriguez Alvarez'],
      responsable: '30000328W'
    },
    episodio: {
      nEpisodio: 'EP81305',
      tipoSolicitante: 'juzgado',
      direccionSubdireccion: 'IML y CCrF de Palencia, Salamanca y Valladolid',
      tipoOrganismo: 'Juzgado de lo Penal',
      organismo: 'Jdo. de lo Penal Nº 1 de Salamanca',
      tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
      nAnio: '000002',
      anio: '2022',
      numeroAtestadoAnio: '',
      anioAtestado: '',
      fechaHecho: '2022-07-21',
      nig: ['2807900', '220', '0000127', '2022', 'ASS'],
      juzgadoGuardia: false,
      violenciaGenero: false,
      testigoProtegido: false,
      causaConPreso: false,
      secretoSumario: false,
      violenciaDomestica: false,
      urgente: false,
      descripcionEpisodio: 'Valoración psicológica general solicitada',
      organoAseguradora: 'Jdo. de lo Penal Nº 1 de Salamanca',
      admResponsable: '30000328W',
      nExpediente: 'EX2013585',
      sujeto: 'Maria Isabel Rodriguez Alvarez'
    },
    sujetos: [
      {
        nombreIml: 'IML y CCrF de Palencia, Salamanca y Valladolid',
        numExpediente: 'EX2013585',
        tipoIdentificacion: 'DNI',
        numIdentificacion: '12345678A',
        nombre: 'Maria Isabel',
        apellido1: 'Rodriguez',
        apellido2: 'Alvarez',
        fechaNacimiento: '1985-03-15'
      }
    ],
    actuacion: {
      fechaRegistro: new Date('2022-07-21'),
      tipoAsistencia: TipoAsistencia.VALORACION_PSICOLOGICA,
      sujetoPrincipal: 'Maria Isabel Rodriguez Alvarez',
      tipoPerito: TipoPerito.PSICOLOGO,
      responsable: '30000328W',
      nActuacion: '1511',
      fechaInicio: new Date('2022-07-21'),
      observacionActuacion: 'Valoración psicológica general en curso',
      estado: 'abierta',
      prioridad: false,
      sujetos: ['Maria Isabel Rodriguez Alvarez'],
      documentosAsociados: [
        {
          id: 'DOC005',
          nombre: 'Solicitud_Valoracion_Psicologica.pdf',
          tipo: 'Solicitud',
          estado: 'Firmado',
          fechaCreacion: new Date('2022-07-21'),
          autor: '30000328W',
          numEpisodio: '81305' // Añadido el campo numEpisodio
        }
      ],
      citaciones: [
        {
          fecha: new Date('2022-07-28'),
          hora: '09:00',
          lugar: 'Consulta 2 - IML Salamanca',
          perito: '30000328W',
          observaciones: 'Primera evaluación psicológica'
        }
      ]
    }
  }
  };