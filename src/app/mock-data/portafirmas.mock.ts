// src/app/mock-data/portafirmas.mock.ts

export interface DocumentoFirma {
    aplicacion: string;
    titulo: string;
    tramitador: string;
    estado: string;
    progreso: string;
    fechaAlta: Date;
    hasIcon?: boolean;
  }



export const DOCUMENTOS_FIRMA_MOCK: DocumentoFirma[] = [
  {
    aplicacion: 'IMLZ',
    titulo: 'DocumentoTextoLibre165753333329-Lopez-Santiago-02003379/9900001',
    tramitador: 'ARANDA RAMIREZ, CAROLINA',
    estado: 'Pendiente de firma',
    progreso: '0/1',
    fechaAlta: new Date('2022-07-11')
  },
  {
    aplicacion: 'IMLZ',
    titulo: 'DocumentoTextoLibre165563820014-Caruso-Damiano-',
    tramitador: 'ARANDA RAMIREZ, CAROLINA',
    estado: 'Pendiente de firma',
    progreso: '0/1',
    fechaAlta: new Date('2022-06-28')
  },
  {
    aplicacion: 'IMLZ',
    titulo: 'InformeRemisionDeMuestras165640682927-Lopez-Santiago-02003379/9900001',
    tramitador: 'Álvarez Córdoba, Todo',
    estado: 'Pendiente de firma',
    progreso: '0/2',
    fechaAlta: new Date('2022-06-01')
  },
  {
    aplicacion: 'IMLZ',
    titulo: 'SeñalamientoReconocimiento165354357234-Luis-Luis-02003770000001',
    tramitador: 'ARANDA RAMIREZ, CAROLINA',
    estado: 'Pendiente de firma',
    progreso: '0/1',
    fechaAlta: new Date('2022-05-26')
  },
  {
    aplicacion: 'IMLZ',
    titulo: 'CarnetdeconsultaI65434534637-Lopez-Santiago-02003379/9900001',
    tramitador: 'ARANDA RAMIREZ, CAROLINA',
    estado: 'Pendiente de firma',
    progreso: '0/1',
    fechaAlta: new Date('2022-05-25')
  },
  {
    aplicacion: 'IMLZ',
    titulo: 'CarnetdeconsultaI653438478005-Lopez-Santiago-02003379/9900001',
    tramitador: 'ARANDA RAMIREZ, CAROLINA',
    estado: 'Pendiente de firma',
    progreso: '0/1',  
    fechaAlta: new Date('2022-05-25')
  },
  {
    aplicacion: 'IMLZ',
    titulo: 'ModificacionFechaCitacionI65343517906-Lopez-Santiago-02003379/9900001',
    tramitador: 'ARANDA RAMIREZ, CAROLINA', 
    estado: 'Pendiente de firma',
    progreso: '0/1',
    fechaAlta: new Date('2022-05-25')
  },
  {
    aplicacion: 'IMLZ',
    titulo: 'CarnetdeconsultaI65341917915-Lopez-Santiago-02003379/9900001',
    tramitador: 'ARANDA RAMIREZ, CAROLINA',
    estado: 'Pendiente de firma', 
    progreso: '0/1',
    fechaAlta: new Date('2022-05-25')
  },
  {
    aplicacion: 'IMLZ',
    titulo: 'AcusederecibodepeticionpericialI65334104448-Lopez-Santiago-02003379/9900001',
    tramitador: 'ARANDA RAMIREZ, CAROLINA',
    estado: 'Pendiente de firma',
    progreso: '0/1',
    fechaAlta: new Date('2022-05-25')
  }
];