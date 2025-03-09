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
    this.cargando = true;
    const expedienteActual = this.sujeto.numExpediente;
    
    console.log('Buscando expediente:', expedienteActual);
    
    // Primero obtenemos todos los episodios
    this.episodiosService.getEpisodios().subscribe(todosEpisodios => {
      console.log('Total episodios en sistema:', todosEpisodios.length);
      
      // Array para guardar los episodios encontrados
      const episodiosEncontrados: Episodio[] = [];
      
      // SOLUCIÓN: Recorremos el mapa MOCK_SUJETOS directamente para buscar nuestro sujeto
      // en todos los episodios registrados, incluso los que no están en MOCK_EPISODIOS
      let episodiosChecked = 0;
      
      // Establecemos un valor inicial de episodiosRemaining más alto para asegurar 
      // que esperamos lo suficiente (en caso de que haya más episodios)
      let episodiosRemaining = 15; // Un valor arbitrario más alto que el número esperado
      
      // Comprobamos cada episodio disponible
      this.episodiosService.getEpisodios().subscribe(
        allEpisodios => {
          // Ahora sabemos cuántos episodios debemos verificar
          episodiosRemaining = allEpisodios.length;
          
          // Si no hay episodios, terminamos
          if (episodiosRemaining === 0) {
            this.cargando = false;
            return;
          }
          
          // Recorremos todos los episodios
          allEpisodios.forEach(episodio => {
            console.log(`Verificando sujetos para episodio: ${episodio.nEpisodio}`);
            
            this.episodiosService.getSujetosEpisodio(episodio.nEpisodio).subscribe(
              sujetos => {
                // Verificamos si alguno de estos sujetos tiene el expediente que buscamos
                const encontrado = sujetos.some(s => {
                  const coincide = s.numExpediente === expedienteActual;
                  if (coincide) {
                    console.log(`ENCONTRADO! ${episodio.nEpisodio} contiene nuestro sujeto!`);
                  }
                  return coincide;
                });
                
                if (encontrado) {
                  episodiosEncontrados.push(episodio);
                }
                
                // Incrementamos contador para saber cuándo terminar
                episodiosChecked++;
                console.log(`Verificados ${episodiosChecked} de ${episodiosRemaining}`);
                
                // Si hemos terminado con todos, actualizamos la UI
                if (episodiosChecked >= episodiosRemaining) {
                  console.log(`Completado. Encontrados ${episodiosEncontrados.length} episodios`);
                  this.episodios = episodiosEncontrados;
                  this.cargando = false;
                }
              },
              error => {
                console.error(`Error verificando sujetos para ${episodio.nEpisodio}:`, error);
                // Incrementamos el contador a pesar del error
                episodiosChecked++;
                
                if (episodiosChecked >= episodiosRemaining) {
                  this.episodios = episodiosEncontrados;
                  this.cargando = false;
                }
              }
            );
          });
        }
      );
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}