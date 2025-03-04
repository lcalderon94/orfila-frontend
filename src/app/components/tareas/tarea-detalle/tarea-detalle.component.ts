import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Tarea } from 'src/app/components/tareas/tareas.component';
import { TAREAS_COMPLETAS } from 'src/app/mock-data/tareas.mock';
import { Actuacion } from 'src/app/mock-data/actuaciones.mock';
import { Sujeto } from 'src/app/services/episodio.service';
import { HojaEvolucionComponent } from 'src/app/components/tareas/hoja-evolucion/hoja-evolucion.component';

@Component({
  selector: 'app-tarea-detalle',
  templateUrl: './tarea-detalle.component.html',
  styleUrls: ['./tarea-detalle.component.css']
})
export class TareaDetalleComponent implements OnInit {

  tareaSeleccionada?: Tarea;
  actuacionAsociada?: Actuacion;
  sujetosAsociados: Sujeto[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const numEpisodioParam = this.route.snapshot.paramMap.get('numEpisodio');
    console.log('Param numEpisodio:', numEpisodioParam);

    if (numEpisodioParam) {
      const tareaCompleta = TAREAS_COMPLETAS[numEpisodioParam];
      console.log('tareaCompleta encontrada:', tareaCompleta);

      if (tareaCompleta) {
        this.tareaSeleccionada = tareaCompleta.tarea;
        this.actuacionAsociada = tareaCompleta.actuacion;
        this.sujetosAsociados = tareaCompleta.sujetos;
      } else {
        console.warn('No existe TAREAS_COMPLETAS con clave:', numEpisodioParam);
      }
    }
  }

  // BOTÓN ATRÁS: modifica según tu necesidad
  irAtras() {
    // EJEMPLO: Navegar atrás en el historial
    this.router.navigate(['/tareas']);
    // O simplemente: this.router.navigateByUrl('/alguna-ruta');
    // O window.history.back();
  }

  // Abrir popup de Hoja Evolución
  openHojaEvolucion() {
    this.dialog.open(HojaEvolucionComponent, {
      data: {
        tareaId: 'valor-de-ejemplo' 
      },
      width: '700px',
      disableClose: true
    });
  }

  verDocumentosAsociados() {
    if (this.tareaSeleccionada) {
      this.router.navigate(['/consulta-documentos'], { 
        queryParams: { 
          numEpisodio: this.tareaSeleccionada.numEpisodio 
        }
      });
    }
  }
}
