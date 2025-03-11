import { MOCK_EPISODIOS } from './episodios.mock';
import { DocumentoAsociado } from './tareas.mock';

// Mapa para almacenar documentos asociados a episodios
export const EPISODIOS_DOCUMENTOS_MAP: { [episodioId: string]: DocumentoAsociado[] } = {};

// Inicializar el mapa con todos los episodios existentes
MOCK_EPISODIOS.forEach(episodio => {
  EPISODIOS_DOCUMENTOS_MAP[episodio.nEpisodio] = [];
});