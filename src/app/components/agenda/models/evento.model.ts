// models/evento.model.ts

export interface Evento {
    id: string;
    titulo: string;
    fecha: Date;
    horaInicio?: string;
    horaFin?: string;
    descripcion?: string;
    direccionJuzgado?: string;  // Para citaciones a juicio
    observaciones?: string;
    esCitacionJuicio: boolean;  // Indica si es una citación a juicio
    episodioId?: string;        // Referencia al episodio asociado
    sujetoId?: string;          // Sujeto asociado
    color?: string;             // Color del evento
  }