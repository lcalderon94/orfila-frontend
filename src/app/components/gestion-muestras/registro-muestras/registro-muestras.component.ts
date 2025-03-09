import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MuestrasService, Localizacion, Muestra } from 'src/app/services/muestras.service';

@Component({
  selector: 'app-registro-muestras',
  templateUrl: './registro-muestras.component.html',
  styleUrls: ['./registro-muestras.component.css']
})
export class RegistroMuestrasComponent implements OnInit {
  registroForm: FormGroup;
  localizacionSeleccionada: Localizacion | null = null;
  localizaciones: Localizacion[] = [];
  muestrasLeidas: any[] = [];
  localizacionId: number | null = null;
  usarPredeterminada = false;
  tiempoEspera = 200; // ms para esperar entre lectura de códigos
  guardando = false; // Flag para evitar múltiples envíos simultáneos

  constructor(
    private fb: FormBuilder,
    private muestrasService: MuestrasService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      localizacionId: ['', Validators.required],
      codigoBarrasMuestra: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Comprobar si se ha pasado un ID de localización por la ruta
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.localizacionId = +id;
        this.cargarLocalizacion(this.localizacionId);
      } else {
        this.cargarLocalizacionesLocales();
      }
    });
    
    // Escuchar cambios en el campo de código de barras para procesar la lectura automáticamente
    this.registroForm.get('codigoBarrasMuestra')?.valueChanges.subscribe(value => {
      if (value && value.length > 10) { // Un código de barras típico tiene más de 10 caracteres
        // Esperar un pequeño tiempo para asegurarse de que la lectura está completa
        setTimeout(() => {
          this.registrarMuestra();
        }, this.tiempoEspera);
      }
    });
  }

  private cargarLocalizacion(id: number) {
    this.muestrasService.getLocalizacion(id).subscribe(
      localizacion => {
        if (localizacion && localizacion.tipoLocalizacion === 'local') {
          this.localizacionSeleccionada = localizacion;
          this.registroForm.patchValue({
            localizacionId: localizacion.id
          });
          this.usarPredeterminada = true;
        } else {
          this.snackBar.open('La localización seleccionada no es válida para registro de muestras', 'Cerrar', {
            duration: 3000
          });
          this.cargarLocalizacionesLocales();
        }
      },
      error => {
        this.snackBar.open('Error al cargar la localización', 'Cerrar', {
          duration: 3000
        });
        this.cargarLocalizacionesLocales();
      }
    );
  }

  private cargarLocalizacionesLocales() {
    this.muestrasService.getLocalizaciones({ tipoLocalizacion: 'local' }).subscribe(
      localizaciones => {
        this.localizaciones = localizaciones;
        
        const predeterminada = localizaciones.find(loc => {
          const pd = loc.porDefecto;
          if (typeof pd === 'string') {
            return pd.toLowerCase() === 'true';
          }
          return pd === true;
        });
        
        if (predeterminada) {
          this.usarPredeterminada = true;
          this.localizacionSeleccionada = predeterminada;
          this.registroForm.patchValue({
            localizacionId: predeterminada.id
          });
        }
      }
    );
  }

  onLocalizacionChange(event: any) {
    const locId = event.value;
    const localizacion = this.localizaciones.find(loc => loc.id === locId);
    if (localizacion) {
      // Hacemos una copia profunda para evitar referencias compartidas
      this.localizacionSeleccionada = JSON.parse(JSON.stringify(localizacion));
    }
  }

  registrarMuestra() {
    if (this.registroForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos obligatorios', 'Cerrar', {
        duration: 3000
      });
      return;
    }
  
    const formValue = this.registroForm.value;
    const codigoBarrasMuestra = formValue.codigoBarrasMuestra;
    
    // Validaciones existentes...
    
    // Verificar si ya existe esta muestra en esta localización
    const muestraExistenteEnLista = this.muestrasLeidas.some(m => 
      m.codigoBarrasMuestra === codigoBarrasMuestra && 
      m.localizacion?.id === this.localizacionSeleccionada?.id
    );
    
    if (muestraExistenteEnLista) {
      this.snackBar.open('Esta muestra ya ha sido escaneada para esta localización', 'Cerrar', {
        duration: 3000
      });
      this.limpiarCampoCodigoBarras();
      return;
    }
    
    // Verificar si la muestra ya existe en el sistema para esta localización
    this.muestrasService.verificarMuestraExistente(codigoBarrasMuestra, this.localizacionSeleccionada?.id)
      .subscribe(
        existe => {
          if (existe) {
            this.snackBar.open('Esta muestra ya existe en esta localización', 'Cerrar', {
              duration: 3000
            });
            this.limpiarCampoCodigoBarras();
          } else {
            this.agregarMuestraALista(codigoBarrasMuestra);
          }
        }
      );
  }
  
  private limpiarCampoCodigoBarras() {
    this.registroForm.patchValue({
      codigoBarrasMuestra: ''
    });
    document.getElementById('codigoBarrasMuestraInput')?.focus();
  }
  
  private agregarMuestraALista(codigoBarrasMuestra: string) {
    // Hacer una copia profunda de la localización seleccionada
    const localizacionCopia = this.localizacionSeleccionada ? 
      JSON.parse(JSON.stringify(this.localizacionSeleccionada)) : null;
  
    // Añadir la muestra al listado visual
    this.muestrasLeidas.unshift({
      codigoBarrasLocalizacion: localizacionCopia?.codigoBarras,
      descripcionLocalizacion: localizacionCopia?.descripcionLocalizacion,
      fechaRegistro: new Date(),
      codigoBarrasMuestra: codigoBarrasMuestra,
      usuario: 'usuario_actual',
      localizacion: localizacionCopia
    });
  
    this.limpiarCampoCodigoBarras();
  }

  eliminarRegistro(index: number) {
    if (confirm('¿Está seguro de eliminar este registro?')) {
      this.muestrasLeidas.splice(index, 1);
    }
  }

  guardar() {
    if (this.muestrasLeidas.length === 0) {
      this.snackBar.open('No hay muestras para registrar', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    
    if (this.guardando) {
      return; // Evitar múltiples peticiones
    }
    
    this.guardando = true;
    
    // Contador para seguimiento de operaciones completadas
    let completadas = 0;
    const total = this.muestrasLeidas.length;
    let errores = 0;
    
    // Función para verificar si todas las operaciones han finalizado
    const verificarFinalizacion = () => {
      if (completadas === total) {
        this.guardando = false;
        
        if (errores === 0) {
          this.snackBar.open(`${total} muestras registradas correctamente`, 'Cerrar', {
            duration: 3000
          });
          
          // Limpiar la lista de muestras leídas
          this.muestrasLeidas = [];
        } else {
          this.snackBar.open(`Se registraron ${total - errores} muestras correctamente. Hubo ${errores} errores.`, 'Cerrar', {
            duration: 5000
          });
        }
      }
    };
    
    // Procesar cada muestra leída
    this.muestrasLeidas.forEach(muestraLeida => {
      if (!muestraLeida.localizacion) {
        completadas++;
        errores++;
        return;
      }
      
      const nuevaMuestra: Muestra = {
        codigoBarras: muestraLeida.codigoBarrasMuestra,
        fechaRegistro: new Date(),
        usuario: muestraLeida.usuario,
        localizacion: muestraLeida.localizacion, // Usamos la copia de la localización guardada
        // Agregar episodio y sujeto si estuvieran disponibles
        episodioId: muestraLeida.episodioId,
        episodioNumero: muestraLeida.episodioNumero,
        sujetoId: muestraLeida.sujetoId,
        sujetoNombre: muestraLeida.sujetoNombre
      };
      
      this.muestrasService.registrarMuestra(nuevaMuestra).subscribe(
        muestra => {
          completadas++;
          verificarFinalizacion();
        },
        error => {
          completadas++;
          errores++;
          console.error('Error al registrar muestra:', error);
          verificarFinalizacion();
        }
      );
    });
    
    // Si no hay ninguna operación (por algún error), finalizar
    if (total === 0) {
      this.guardando = false;
    }
  }

  toggleUsarPredeterminada() {
    this.usarPredeterminada = !this.usarPredeterminada;
    
    if (!this.usarPredeterminada) {
      this.registroForm.patchValue({
        localizacionId: ''
      });
      this.localizacionSeleccionada = null;
    } else {
      // Buscar localización predeterminada
      const predeterminada = this.localizaciones.find(loc => {
        const pd = loc.porDefecto;
        if (typeof pd === 'string') {
          return pd.toLowerCase() === 'true';
        }
        return pd === true;
      });
      
      if (predeterminada) {
        // Hacemos una copia profunda para evitar referencias compartidas
        this.localizacionSeleccionada = JSON.parse(JSON.stringify(predeterminada));
        this.registroForm.patchValue({
          localizacionId: predeterminada.id
        });
      }
    }
  }

  volver() {
    this.router.navigate(['/gestion-muestras/localizaciones']);
  }
}