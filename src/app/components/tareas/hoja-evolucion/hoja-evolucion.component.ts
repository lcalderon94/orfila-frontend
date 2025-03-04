import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MockAuthService } from 'src/app/services/mock-auth.service';
import { UserProfile } from 'src/app/interfaces/profile.interface';
import { HojaEvolucion, HojaEvolucionService } from 'src/app/services/hoja-evolucion.service';

@Component({
  selector: 'app-hoja-evolucion',
  templateUrl: './hoja-evolucion.component.html',
  styleUrls: ['./hoja-evolucion.component.css']
})
export class HojaEvolucionComponent implements OnInit {

  currentUser: UserProfile | null = null;
  hojaForm: FormGroup;
  hojas: HojaEvolucion[] = [];
  mostrarFormulario = false;
  puedeEditar = true; // Ajusta según tus reglas de negocio

  constructor(
    private dialogRef: MatDialogRef<HojaEvolucionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tareaId: string },
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private mockAuthService: MockAuthService,

    // Inyectamos el servicio
    private hojaEvolucionService: HojaEvolucionService
  ) {
    this.hojaForm = this.fb.group({
      detalle: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Cargar (o suscribirnos) a la lista de hojas en el servicio
    this.hojaEvolucionService.getHojas$().subscribe(hojas => {
      // Podrías filtrar por tareaId aquí si lo deseas
      this.hojas = hojas.filter(h => h.tareaId === this.data.tareaId);
    });

    // Suscribirse al usuario actual
    this.mockAuthService.getCurrentProfile().subscribe(user => {
      this.currentUser = user;
    });
  }

  mostrarFormularioNuevaHoja() {
    this.mostrarFormulario = true;
  }

  cancelarNuevaHoja() {
    this.mostrarFormulario = false;
    this.hojaForm.reset();
  }

  guardarHoja() {
    if (this.hojaForm.valid && this.currentUser) {
      const nuevaHoja: HojaEvolucion = {
        id: this.generarIdUnico(), // ver más abajo
        tareaId: this.data.tareaId,
        fecha: new Date(),
        usuario: `${this.currentUser.nombre} ${this.currentUser.apellidos}`,
        detalle: this.hojaForm.get('detalle')?.value
      };

      // Guardar en el servicio (así persiste mientras la app no se recargue)
      this.hojaEvolucionService.addHoja(nuevaHoja);

      this.hojaForm.reset();
      this.mostrarFormulario = false;
      this.snackBar.open('Entrada guardada con éxito', 'Cerrar', {
        duration: 3000
      });
    }
  }

  eliminarHoja(hoja: HojaEvolucion) {
    this.hojaEvolucionService.removeHoja(hoja.id);
    this.snackBar.open('Entrada eliminada con éxito', 'Cerrar', {
      duration: 3000
    });
  }

  private generarIdUnico(): number {
    // Aquí podrías preguntar al servicio por TODAS las hojas sin filtrar:
    const allHojas = this.hojaEvolucionService.getHojasActuales();
    return allHojas.length
      ? Math.max(...allHojas.map(h => h.id)) + 1
      : 1;
  }

  cerrarDialog() {
    this.dialogRef.close();
  }
}
