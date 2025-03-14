// src/app/mock-data/portafirmas.mock.ts

export interface DocumentoFirma {
  id: string;
  aplicacion: string;
  titulo: string;
  tramitador: string;
  estado: string;
  progreso: string;
  fechaAlta: Date;
  documentoId?: string; // Campo para vincular con el ID del documento en gestión documental
  motivoRechazo?: string;
}



export const DOCUMENTOS_FIRMA_MOCK: DocumentoFirma[] = [
  {
    id: '1',
    aplicacion: 'IMLZ',
    titulo: 'DocumentoTextoLibre165753333329-Lopez-Santiago-02003379/9900001',
    tramitador: 'ARANDA RAMIREZ, CAROLINA',
    estado: 'Pendiente de firma',
    progreso: '0/1',
    fechaAlta: new Date('2022-07-11')
  },
  {
    id: '2',
    aplicacion: 'IMLZ',
    titulo: 'DocumentoTextoLibre165563820014-Caruso-Damiano-',
    tramitador: 'ARANDA RAMIREZ, CAROLINA',
    estado: 'Pendiente de firma',
    progreso: '0/1',
    fechaAlta: new Date('2022-06-28')
  },
  {
    id: '3',
    aplicacion: 'IMLZ',
    titulo: 'InformeRemisionDeMuestras165640682927-Lopez-Santiago-02003379/9900001',
    tramitador: 'Álvarez Córdoba, Todo',
    estado: 'Pendiente de firma',
    progreso: '0/2',
    fechaAlta: new Date('2022-06-01')
  },
  {
    id: '4',
    aplicacion: 'IMLZ',
    titulo: 'SeñalamientoReconocimiento165354357234-Luis-Luis-02003770000001',
    tramitador: 'ARANDA RAMIREZ, CAROLINA',
    estado: 'Pendiente de firma',
    progreso: '0/1',
    fechaAlta: new Date('2022-05-26')
  },
  {
    id: '5',
    aplicacion: 'IMLZ',
    titulo: 'CarnetdeconsultaI65434534637-Lopez-Santiago-02003379/9900001',
    tramitador: 'ARANDA RAMIREZ, CAROLINA',
    estado: 'Pendiente de firma',
    progreso: '0/1',
    fechaAlta: new Date('2022-05-25')
  },
  {
    id: '6',
    aplicacion: 'IMLZ',
    titulo: 'CarnetdeconsultaI653438478005-Lopez-Santiago-02003379/9900001',
    tramitador: 'ARANDA RAMIREZ, CAROLINA',
    estado: 'Pendiente de firma',
    progreso: '0/1',  
    fechaAlta: new Date('2022-05-25')
  },
  {
    id: '7',
    aplicacion: 'IMLZ',
    titulo: 'ModificacionFechaCitacionI65343517906-Lopez-Santiago-02003379/9900001',
    tramitador: 'ARANDA RAMIREZ, CAROLINA', 
    estado: 'Pendiente de firma',
    progreso: '0/1',
    fechaAlta: new Date('2022-05-25')
  },
  {
    id: '8',
    aplicacion: 'IMLZ',
    titulo: 'CarnetdeconsultaI65341917915-Lopez-Santiago-02003379/9900001',
    tramitador: 'ARANDA RAMIREZ, CAROLINA',
    estado: 'Pendiente de firma', 
    progreso: '0/1',
    fechaAlta: new Date('2022-05-25')
  },
  {
    id: '9',
    aplicacion: 'IMLZ',
    titulo: 'AcusederecibodepeticionpericialI65334104448-Lopez-Santiago-02003379/9900001',
    tramitador: 'ARANDA RAMIREZ, CAROLINA',
    estado: 'Pendiente de firma',
    progreso: '0/1',
    fechaAlta: new Date('2022-05-25')
  },
  {
    id: '10',
    aplicacion: 'IMLZ',
    titulo: 'Informe_Preliminar.pdf',
    tramitador: 'ARANDA RAMIREZ, CAROLINA',
    estado: 'Pendiente de firma',
    progreso: '0/1',
    fechaAlta: new Date('2022-07-27')
  }

];