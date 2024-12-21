import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EpisodiosService, Episodio } from 'src/app/services/episodio.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NotasEpisodioComponent } from '../notas-episodio/notas-episodio.component';

@Component({
  selector: 'app-modificar-episodio',
  templateUrl: './modificar-episodio.component.html',
  styleUrls: ['./modificar-episodio.component.css']
})
export class ModificarEpisodioComponent implements OnInit {
  episodioForm: FormGroup;
  episodioId: string = '';
  mostrarBuscadorEpisodios = false;
  episodios: Episodio[] = [];
  episodiosFiltrados!: Observable<Episodio[]>;
  episodioControl = new FormControl();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private episodiosService: EpisodiosService,
    private dialog: MatDialog
  ) {
    this.episodioForm = this.fb.group({
      tipoSolicitante: ['', Validators.required],
      direccionSubdireccion: ['', Validators.required],
      tipoOrganismo: ['', Validators.required],
      organismo: ['', Validators.required],
      tipoProcedimiento: ['', Validators.required],
      nAnio: ['', Validators.required],
      anio: ['', Validators.required],
      numeroAtestadoAnio: [''],
      anioAtestado: [''],
      fechaHecho: ['', Validators.required],
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
      urgente: [false],
      descripcionEpisodio: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.episodioId = params.get('nEpisodio') || '';
      if (this.episodioId) {
        this.mostrarBuscadorEpisodios = false;
        this.cargarEpisodio();
      } else {
        this.snackBar.open('Seleccione un episodio para modificar.', 'Cerrar', { duration: 3000 });
        this.mostrarBuscadorEpisodios = true;
        this.cargarEpisodios();
      }
    });
  }

  cargarEpisodios(): void {
    this.episodiosService.getEpisodios().subscribe(
      episodios => {
        this.episodios = episodios;
        this.episodiosFiltrados = this.episodioControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterEpisodios(value))
        );
      },
      error => {
        console.error('Error al cargar episodios', error);
        this.snackBar.open('Error al cargar episodios', 'Cerrar', { duration: 3000 });
      }
    );
  }

  private _filterEpisodios(value: string): Episodio[] {
    const filterValue = value.toLowerCase();
    return this.episodios.filter(episodio =>
      episodio.nEpisodio.toLowerCase().includes(filterValue) ||
      episodio.descripcionEpisodio.toLowerCase().includes(filterValue)
    );
  }

  seleccionarEpisodio(episodio: Episodio): void {
    this.router.navigate(['/episodios/modificar', episodio.nEpisodio]);
  }

  cargarEpisodio(): void {
    this.episodiosService.getEpisodioById(this.episodioId).subscribe(
      (episodio: Episodio | undefined) => {
        if (episodio) {
          this.episodioForm.patchValue({
            tipoSolicitante: episodio.tipoSolicitante,
            direccionSubdireccion: episodio.direccionSubdireccion,
            tipoOrganismo: episodio.tipoOrganismo,
            organismo: episodio.organismo,
            tipoProcedimiento: episodio.tipoProcedimiento,
            nAnio: episodio.nAnio,
            anio: episodio.anio,
            numeroAtestadoAnio: episodio.numeroAtestadoAnio,
            anioAtestado: episodio.anioAtestado,
            fechaHecho: episodio.fechaHecho,
            juzgadoGuardia: episodio.juzgadoGuardia,
            violenciaGenero: episodio.violenciaGenero,
            testigoProtegido: episodio.testigoProtegido,
            causaConPreso: episodio.causaConPreso,
            secretoSumario: episodio.secretoSumario,
            violenciaDomestica: episodio.violenciaDomestica,
            urgente: episodio.urgente,
            descripcionEpisodio: episodio.descripcionEpisodio
          });

          const nigArray = this.episodioForm.get('nig') as FormArray;
          nigArray.clear();
          episodio.nig.forEach((valor: string) => {
            nigArray.push(this.fb.control(valor, Validators.required));
          });
        } else {
          this.snackBar.open('Episodio no encontrado.', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/episodios']);
        }
      },
      error => {
        console.error('Error al cargar el episodio', error);
        this.snackBar.open('Error al cargar el episodio', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/episodios']);
      }
    );
  }

  get nigControls() {
    return (this.episodioForm.get('nig') as FormArray).controls;
  }

  copiarNIG(): void {
    const nigValues = this.nigControls.map(control => control.value);
    const nigString = nigValues.join('-');
    navigator.clipboard.writeText(nigString).then(() => {
      this.snackBar.open('NIG copiado al portapapeles', 'Cerrar', { duration: 2000 });
    });
  }

  volver(): void {
    this.router.navigate(['/episodios']);
  }

  nuevoSujeto(): void {
    this.snackBar.open('Funcionalidad de nuevo sujeto no implementada', 'Cerrar', { duration: 2000 });
  }

  notasEpisodio(): void {
    const dialogRef = this.dialog.open(NotasEpisodioComponent, {
      width: '600px',
      height: '400px',
      data: { 
        episodioId: this.episodioId,
        tipoOrganismo: this.episodioForm.get('tipoOrganismo')?.value,
        nAnio: this.episodioForm.get('nAnio')?.value
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Notas actualizadas correctamente', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  guardar(): void {
    if (this.episodioForm.valid) {
      const episodioActualizado: Episodio = {
        nEpisodio: this.episodioId,
        ...this.episodioForm.value,
        nig: this.nigControls.map(control => control.value)
      };
      this.episodiosService.actualizarEpisodio(episodioActualizado).subscribe(
        () => {
          this.snackBar.open('Episodio guardado con éxito', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/episodios']);
        },
        error => {
          console.error('Error al guardar el episodio', error);
          this.snackBar.open('Error al guardar el episodio', 'Cerrar', { duration: 3000 });
        }
      );
    } else {
      this.snackBar.open('Por favor, complete todos los campos requeridos', 'Cerrar', { duration: 3000 });
    }
  }
}