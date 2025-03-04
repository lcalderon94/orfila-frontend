// actuacion.interface.ts

export interface Actuacion {
    fechaRegistro: Date;
    tipoAsistencia: string;
    sujetoPrincipal: string;
    tipoPerito: string;
    responsable: string; // DNI del perito
    nActuacion: string;
    fechaInicio?: Date;
    nAutopsia?: string;      // Solo cuando el tipo es 'Levantamiento de cadáver-autopsia'
    observacionActuacion?: string;
    prioridad?: boolean;
    tasa?: string;          // Solo para 'Lesiones de tráfico (pericia extrajudicial)'
    estado?: 'abierta' | 'finalizada';
    sujetos?: string[];     // Para sujetos múltiples
  }
  
  export enum TipoTasaPericial {
    SIN_INGRESO = 'Pericia lesiones sin ingreso hospitalario',
    INGRESO_MENOR_72 = 'Pericia lesiones con ingreso hospitalario igual o inferior a 72 horas',
    INGRESO_MAYOR_72 = 'Pericia lesiones con ingreso hospitalario superior a 72 horas'
  }
  
  export enum TipoAsistencia {
    ANALISIS_GENETICO = 'Análisis Genético',
    AUTOPSIA = 'Levantamiento de cadáver-autopsia',
    INFORME_SOCIAL = 'Informe social genérico',
    VALORACION_PSICOLOGICA = 'Valoración psicológica general',
    LESIONES_TRAFICO = 'Lesiones de tráfico (pericia extrajudicial)',
    DELITOS_LIBERTAD_SEXUAL = 'Delitos contra la Libertad Sexual',
    MUERTE_SUBITA = 'Muerte Súbita',
    PERICIA_PSICOLOGICA = 'Pericia Psicológica'
  }
  
  export enum TipoPerito {
    MEDICO_FORENSE = 'Médico Forense',
    PSICOLOGO = 'Psicólogo',
    TRABAJADOR_SOCIAL = 'Trabajador Social',
    FACULTATIVO = 'Facultativo',
    EDUCADOR_SOCIAL = 'Educador Social'
  }

  export const MOCK_ACTUACIONES: Actuacion[] = [
    {
      fechaRegistro: new Date('2022-07-27'),
      tipoAsistencia: TipoAsistencia.ANALISIS_GENETICO,
      sujetoPrincipal: 'Maria Isabel Rodriguez Alvarez',
      tipoPerito: TipoPerito.MEDICO_FORENSE,
      responsable: '30000332C',
      nActuacion: '1505',
    },
    {
      fechaRegistro: new Date('2022-07-26'),
      tipoAsistencia: TipoAsistencia.AUTOPSIA,
      sujetoPrincipal: 'Juan Pérez',
      tipoPerito: TipoPerito.MEDICO_FORENSE,
      responsable: '46888715H',
      nActuacion: '1506',
    },
    {
      fechaRegistro: new Date('2022-07-26'),
      tipoAsistencia: TipoAsistencia.INFORME_SOCIAL,
      sujetoPrincipal: 'Antonio Orozco',
      tipoPerito: TipoPerito.TRABAJADOR_SOCIAL,
      responsable: '30000332C',
      nActuacion: '1507',
    },
    {
      fechaRegistro: new Date('2022-07-26'),
      tipoAsistencia: TipoAsistencia.VALORACION_PSICOLOGICA,
      sujetoPrincipal: 'Maria Isabel Rodriguez Alvarez',
      tipoPerito: TipoPerito.PSICOLOGO,
      responsable: '30000328W',
      nActuacion: '1508',
    },
    {
      fechaRegistro: new Date('2022-07-25'),
      tipoAsistencia: TipoAsistencia.LESIONES_TRAFICO,
      sujetoPrincipal: 'Santiago López',
      tipoPerito: TipoPerito.MEDICO_FORENSE,
      responsable: '46888715H',
      nActuacion: '1509',
    },
  ];