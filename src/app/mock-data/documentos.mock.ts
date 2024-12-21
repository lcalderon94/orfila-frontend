// src/app/mock-data/documentos.mock.ts
interface Documento {
    fechaCreacion: Date;
    tipo: string;
    nombre: string;
    descLexnet: string;
    numAnio: string;
    numEpisodio: string;
    autorInforme: string;
    estado: string;
  }
  
  export const MOCK_DOCUMENTOS: Documento[] = [
    {
        fechaCreacion: new Date('2022-07-27'),
        tipo: 'Documento texto libre (Documentos Genérico)',
        nombre: 'DocumentoTextoLibre165892352',
        descLexnet: 'Documentotextollibre165892352/3890-Lopez-Santiago-',
        numAnio: '',
        numEpisodio: 'EP81177',
        autorInforme: '02460888A',
        estado: 'Completado'
      },
      {
        fechaCreacion: new Date('2022-07-27'),
        tipo: 'Documento texto libre (Documentos Genérico)',
        nombre: 'DocumentoTextoLibre165891602',
        descLexnet: 'Documentotextollibre165891602/8930-Lopez-Santiago-',
        numAnio: '',
        numEpisodio: 'EP81177',
        autorInforme: '02460888A',
        estado: 'Firmado'
      },
      {
        fechaCreacion: new Date('2022-07-27'),
        tipo: 'Documento texto libre (Documentos Genérico)',
        nombre: 'DocumentoTextoLibre165891600',
        descLexnet: 'Documentotextollibre165891600/6826-Lopez-Santiago-',
        numAnio: '',
        numEpisodio: 'EP81177',
        autorInforme: '02460888A',
        estado: 'Firmado'
      },
      {
        fechaCreacion: new Date('2022-07-27'),
        tipo: 'Documento texto libre (Documentos Genérico)',
        nombre: 'DocumentoTextoLibre165891422',
        descLexnet: 'Documentotextollibre165891422/738--3502ks799900001',
        numAnio: '9870876/2022',
        numEpisodio: 'EP81158',
        autorInforme: '46888715H',
        estado: 'Firmado'
      },
      {
        fechaCreacion: new Date('2022-07-27'),
        tipo: 'Informe de estado (Informes Periciales Clínica)',
        nombre: 'InformeEstado165891502',
        descLexnet: 'Informedeestado165891502/5019-Lopez-Santiago-02003379/9900001',
        numAnio: '33333333/2022',
        numEpisodio: 'EP81142',
        autorInforme: '46888715H',
        estado: 'En preparación'
      },
      {
        fechaCreacion: new Date('2022-07-26'),
        tipo: 'Informe Remisión de Muestras (Informes Remisión de Muestras y Paquetes)',
        nombre: 'InformeRemisionMuestras165883452',
        descLexnet: 'InformeRemisionDeMuestras165883452/2455-Lopez-Santiago-02003379/9900001',
        numAnio: '',
        numEpisodio: 'EP81166',
        autorInforme: '02460888A',
        estado: 'Completado'
      },
      {
        fechaCreacion: new Date('2022-07-26'),
        tipo: 'Informe de confirmación de medidas de apoyo (Informes Periciales Psiquiatría)',
        nombre: 'InformeConfirmacionMedidas165882902',
        descLexnet: 'Informedeconfirmaciondemedidasdeapoyo165882902/529-Lopez-Santiago-02003379/9900001',
        numAnio: '',
        numEpisodio: 'EP81166',
        autorInforme: '02460888A',
        estado: 'Completado'
      },
      {
        fechaCreacion: new Date('2022-07-26'),
        tipo: 'Documento texto libre (Documentos Genérico)',
        nombre: 'DocumentoTextoLibre165882998',
        descLexnet: 'Documentotextollibre165882998/8006-Lopez-Santiago-02003379/9900001',
        numAnio: '33333333/2022',
        numEpisodio: 'EP81142',
        autorInforme: '46888715H',
        estado: 'Firmado'
      },
      {
        fechaCreacion: new Date('2022-07-26'),
        tipo: 'Informe Remisión de Paquetes (Informes Remisión de Muestras y Paquetes)',
        nombre: 'InformeRemisionPaquetes165882870',
        descLexnet: 'InformeRemisionDePaquetes165882870/529-Lopez-Santiago-02003379/9900001',
        numAnio: '33333333/2022',
        numEpisodio: 'EP81142',
        autorInforme: '46888715H',
        estado: 'Firmado'
      },
      {
        fechaCreacion: new Date('2022-07-26'),
        tipo: 'Informe Remisión de Paquetes (Informes Remisión de Muestras y Paquetes)',
        nombre: 'InformeRemisionPaquetes165882301',
        descLexnet: 'InformeRemisionDePaquetes165882301/541-Lopez-Santiago-02003379/9900001',
        numAnio: '33333333/2022',
        numEpisodio: 'EP81142',
        autorInforme: '46888715H',
        estado: 'En preparación'
      }
  ];