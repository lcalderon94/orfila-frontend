// notas-episodio.component.ts
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EpisodiosService, NotaEpisodio } from 'src/app/services/episodio.service';

@Component({
  selector: 'app-notas-episodio',
  templateUrl: './notas-episodio.component.html',
  styleUrls: ['./notas-episodio.component.css']
})
export class NotasEpisodioComponent implements OnInit {
  notaForm: FormGroup;
  notas: NotaEpisodio[] = [];
  mostrarFormulario = false;

  constructor(
    private dialogRef: MatDialogRef<NotasEpisodioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private episodiosService: EpisodiosService
  ) {
    this.notaForm = this.fb.group({
      nota: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.cargarNotas();
  }

  cargarNotas() {
    this.episodiosService.getNotasEpisodio(this.data.episodioId).subscribe({
      next: (notas) => {
        this.notas = notas;
      },
      error: (error) => {
        console.error('Error al cargar notas:', error);
        this.snackBar.open('Error al cargar las notas', 'Cerrar', { 
          duration: 3000 
        });
      }
    });
  }

  mostrarFormularioNuevaNota() {
    this.mostrarFormulario = true;
  }

  cancelarNuevaNota() {
    this.mostrarFormulario = false;
    this.notaForm.reset();
  }

  guardarNota() {
    if (this.notaForm.valid) {
      this.episodiosService.agregarNotaEpisodio(
        this.data.episodioId, 
        this.notaForm.get('nota')?.value
      ).subscribe({
        next: () => {
          this.cargarNotas();
          this.notaForm.reset();
          this.mostrarFormulario = false;
          this.snackBar.open('Nota guardada con éxito', 'Cerrar', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Error al guardar la nota:', error);
          this.snackBar.open('Error al guardar la nota', 'Cerrar', {
            duration: 3000
          });
        }
      });
    }
  }

  cerrarDialog() {
    this.dialogRef.close();
  }
}