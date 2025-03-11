import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EpisodiosService, Sujeto, Episodio } from '../../../services/episodio.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-detalle-sujeto-dialog',
  templateUrl: './detalle-sujeto-dialog.component.html',
  styleUrls: ['./detalle-sujeto-dialog.component.css']
})
export class DetalleSujetoDialogComponent implements OnInit {
  sujeto: Sujeto;
  episodios: Episodio[] = [];
  cargando = true;
  columnasVisibles: string[] = ['nEpisodio', 'fechaHecho', 'organoAseguradora', 'tipoProcedimiento', 'nAnio'];

  constructor(
    private dialogRef: MatDialogRef<DetalleSujetoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { sujeto: Sujeto },
    private episodiosService: EpisodiosService
  ) {
    this.sujeto = data.sujeto;
  }

  ngOnInit(): void {
    this.cargarEpisodiosDeSujeto();
  }

  cargarEpisodiosDeSujeto(): void {
    this.episodiosService.getEpisodios().subscribe((todosEpisodios: Episodio[]) => {
      // Filtrar episodios que contienen este sujeto
      const observables = todosEpisodios.map((episodio: Episodio) => 
        this.episodiosService.getSujetosEpisodio(episodio.nEpisodio)
      );
      
      forkJoin(observables).subscribe((resultados: Sujeto[][]) => {
        // Recorremos cada episodio y sus sujetos
        for (let i = 0; i < todosEpisodios.length; i++) {
          const sujetosDeEpisodio = resultados[i];
          
          // Verificamos si este sujeto está en el episodio
          const sujetoEncontrado = sujetosDeEpisodio.find((s: Sujeto) => 
            s.numExpediente === this.sujeto.numExpediente
          );
          
          if (sujetoEncontrado) {
            this.episodios.push(todosEpisodios[i]);
          }
        }
        
        this.cargando = false;
      });
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}