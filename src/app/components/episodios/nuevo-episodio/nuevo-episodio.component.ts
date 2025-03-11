import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EpisodiosService } from 'src/app/services/episodio.service';

@Component({
  selector: 'app-nuevo-episodio',
  templateUrl: './nuevo-episodio.component.html',
  styleUrls: ['./nuevo-episodio.component.css']
})
export class NuevoEpisodioComponent implements OnInit {
  episodioForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private episodiosService: EpisodiosService
  ) {
    this.episodioForm = this.fb.group({
      tipoSolicitante: ['juzgado', Validators.required],
      direccionSubdireccion: ['', Validators.required],
      admResponsable: [''],
      tipoOrganismo: ['', Validators.required],
      organismo: ['', Validators.required],
      tipoProcedimiento: ['', Validators.required],
      nAnio: ['', Validators.required],
      anio: [new Date().getFullYear(), Validators.required],
      numeroAtestadoAnio: [''],
      anioAtestado: [new Date().getFullYear()],
      fechaHecho: ['', Validators.required],
      horaHecho: [''], // Nuevo campo según manual Orfila v3.2
      nig: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required)
      ]),
      juzgadoGuardia: [false],
      violenciaGenero: [false],
      testigoProtegido: [false],
      causaConPreso: [false],
      secretoSumario: [false],
      violenciaDomestica: [false],
      descripcionEpisodio: ['']
    });
  }

  ngOnInit(): void {
    // Obtener parámetros de consulta si vienen de LexNET
    this.route.queryParams.subscribe(params => {
      if (params['tipoSolicitante']) {
        // Rellenamos el formulario con los datos de la notificación
        this.episodioForm.patchValue({
          tipoSolicitante: params['tipoSolicitante'],
          tipoOrganismo: params['tipoOrganismo'],
          organismo: params['remitente'],
          tipoProcedimiento: params['tipoProcedimiento'],
          nAnio: params['nAnio']
        });
        
        // Si viene el NIG, lo dividimos y asignamos a cada control del FormArray
        if (params['nig']) {
          const nigValues = params['nig'].split('-');
          const nigArray = this.episodioForm.get('nig') as FormArray;
          
          nigValues.forEach((value: string, index: number) => {
            if (index < nigArray.length) {
              nigArray.at(index).setValue(value);
            }
          });
        }
      }
    });
  }

  get nigControls() {
    return (this.episodioForm.get('nig') as FormArray).controls;
  }

  onSubmit() {
    if (this.episodioForm.valid) {
      // Crear objeto con los valores del formulario
      const episodio = {
        ...this.episodioForm.value,
        nig: this.nigControls.map(control => control.value)
      };
      
      // Llamar al servicio para guardar
      this.episodiosService.crearEpisodio(episodio).subscribe({
        next: (response: any) => {
          this.snackBar.open('Episodio creado correctamente', 'Cerrar', {
            duration: 3000
          });
          
          // Verificamos que response tenga la propiedad nEpisodio antes de usarla
          if (response && response.nEpisodio) {
            // Navegar a la pantalla de sujetos con el ID del episodio creado
            this.router.navigate(['/episodios/sujetos', response.nEpisodio]);
          } else {
            // Si no tenemos ID, simplemente volvemos al listado de episodios
            this.router.navigate(['/episodios']);
          }
        },
        error: (error) => {
          console.error('Error al crear el episodio', error);
          
          if (error.error?.message?.includes('Ya existe un episodio')) {
            this.snackBar.open('Ya existe un episodio con el mismo N/Año y mismo tipo de procedimiento para ese organismo', 'Cerrar', {
              duration: 5000
            });
          } else {
            this.snackBar.open('Error al crear el episodio', 'Cerrar', {
              duration: 3000
            });
          }
        }
      });
    }  else {
      this.snackBar.open('Por favor, complete todos los campos requeridos', 'Cerrar', {
        duration: 3000
      });
      
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.episodioForm.controls).forEach(key => {
        this.episodioForm.get(key)?.markAsTouched();
      });
    }
  }

  nuevoSujeto() {
    if (this.episodioForm.valid) {
      this.onSubmit();
    } else {
      this.snackBar.open('Debe completar los datos del episodio antes de crear un sujeto', 'Cerrar', {
        duration: 3000
      });
    }
  }

  notasEpisodio() {
    this.snackBar.open('Primero debe guardar el episodio para poder añadir notas', 'Cerrar', {
      duration: 3000
    });
  }

  copiarNIG() {
    const nigValues = this.nigControls.map(control => control.value);
    const nigString = nigValues.join('-');
    
    navigator.clipboard.writeText(nigString).then(() => {
      this.snackBar.open('NIG copiado al portapapeles', 'Cerrar', {
        duration: 2000
      });
    });
  }
  
  // Método para cambiar los campos del formulario según el tipo de solicitante
  onTipoSolicitanteChange(tipo: string) {
    if (tipo === 'aseguradora') {
      // Eliminar campos específicos de juzgado
      this.episodioForm.removeControl('tipoOrganismo');
      this.episodioForm.removeControl('organismo');
      this.episodioForm.removeControl('tipoProcedimiento');
      this.episodioForm.removeControl('juzgadoGuardia');
      this.episodioForm.removeControl('violenciaGenero');
      this.episodioForm.removeControl('testigoProtegido');
      this.episodioForm.removeControl('causaConPreso');
      this.episodioForm.removeControl('secretoSumario');
      this.episodioForm.removeControl('violenciaDomestica');
      this.episodioForm.removeControl('nig');
      
      // Añadir campos específicos de aseguradora
      this.episodioForm.addControl('nombreAseguradora', this.fb.control('', Validators.required));
      this.episodioForm.addControl('cif', this.fb.control(''));
      this.episodioForm.addControl('matricula', this.fb.control(''));
      this.episodioForm.addControl('nSiniestro', this.fb.control('', Validators.required));
      this.episodioForm.addControl('emailComunicacion', this.fb.control(''));
      this.episodioForm.addControl('email', this.fb.control(''));
      this.episodioForm.addControl('telefono', this.fb.control(''));
      this.episodioForm.addControl('fax', this.fb.control(''));
      this.episodioForm.addControl('direccionAseguradora', this.fb.control(''));
      this.episodioForm.addControl('lugarAccidente', this.fb.control(''));
    } else {
      // Eliminar campos específicos de aseguradora
      this.episodioForm.removeControl('nombreAseguradora');
      this.episodioForm.removeControl('cif');
      this.episodioForm.removeControl('matricula');
      this.episodioForm.removeControl('nSiniestro');
      this.episodioForm.removeControl('emailComunicacion');
      this.episodioForm.removeControl('email');
      this.episodioForm.removeControl('telefono');
      this.episodioForm.removeControl('fax');
      this.episodioForm.removeControl('direccionAseguradora');
      this.episodioForm.removeControl('lugarAccidente');
      
      // Añadir campos específicos de juzgado
      this.episodioForm.addControl('tipoOrganismo', this.fb.control('', Validators.required));
      this.episodioForm.addControl('organismo', this.fb.control('', Validators.required));
      this.episodioForm.addControl('tipoProcedimiento', this.fb.control('', Validators.required));
      this.episodioForm.addControl('juzgadoGuardia', this.fb.control(false));
      this.episodioForm.addControl('violenciaGenero', this.fb.control(false));
      this.episodioForm.addControl('testigoProtegido', this.fb.control(false));
      this.episodioForm.addControl('causaConPreso', this.fb.control(false));
      this.episodioForm.addControl('secretoSumario', this.fb.control(false));
      this.episodioForm.addControl('violenciaDomestica', this.fb.control(false));
      this.episodioForm.addControl('nig', this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required)
      ]));
    }
  }
  
  volver() {
    this.router.navigate(['/episodios']);
  }
}