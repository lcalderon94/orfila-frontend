import { Tarea } from '../components/tareas/tareas.component';



// src/app/mock-data/tareas.mock.ts
export const MOCK_TAREAS: Tarea[] = [
    {
        organo: 'Jdo. de lo Penal Nº 1 de Salamanca',
        numEpisodio: '81329',
        tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
        numAnio: '000025/2022',
        tipoAsistencia: 'Análisis Genético',
        numExpediente: 'EX2017586',
        sujeto: 'Maria Isabel Rodriguez Alvarez',
        responsable: ['30000332C','30000328W'],
        prioridad: true
      },
      {
        organo: 'Sección 2ª de la A. Prov. Valladolid',
        numEpisodio: '81136',
        tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
        numAnio: '000002/2022',
        tipoAsistencia: 'Análisis Genético',
        numExpediente: 'EX2013527',
        sujeto: '-',
        responsable: [],
        grupal: true
      },
      {
        organo: 'Abog. CCAA de CASTILLA Y LEON',
        numEpisodio: '81336',
        tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
        numAnio: '000001/2022',
        tipoAsistencia: 'Informe social genérico',
        numExpediente: 'EX2013607',
        sujeto: 'Antonio Orozco',
        responsable: ['30000332C']
      },
      {
        organo: 'Jdo. de lo Penal Nº 1 de Salamanca',
        numEpisodio: '81320',
        tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
        numAnio: '000001/2022',
        tipoAsistencia: 'Autopsia',
        numExpediente: 'EX2013586',
        sujeto: 'Maria Isabel Rodriguez Alvarez',
        responsable: [],
        nuevoDocumento: true
      },
      {
        organo: 'Jdo. de lo Penal Nº 1 de Salamanca',
        numEpisodio: '81305',
        tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
        numAnio: '000002/2022',
        tipoAsistencia: 'Valoración psicológica general',
        numExpediente: 'EX2013585',
        sujeto: 'Maria Isabel Rodriguez Alvarez',
        responsable: ['30000328W']
      }
  ];