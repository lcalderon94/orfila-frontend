import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {
  vistaActual: 'mensual' | 'semanal' | 'horaria' = 'mensual';
  fechaSeleccionada: Date = new Date();

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Detectar la vista actual a partir de la URL
    this.route.firstChild?.url.subscribe(segments => {
      if (segments.length > 0) {
        const vista = segments[0].path;
        if (vista === 'mensual' || vista === 'semanal' || vista === 'horaria') {
          this.vistaActual = vista;
        }
      }
    });
  }

  cambiarVista(vista: 'mensual' | 'semanal' | 'horaria'): void {
    this.vistaActual = vista;
    this.router.navigate(['/agenda', vista]);
  }

  volverABandejaTareas(): void {
    this.router.navigate(['/tareas']);
  }

  onFechaSeleccionada(fecha: Date): void {
    this.fechaSeleccionada = fecha;
  }
}