import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-nuevo-episodio',
  templateUrl: './nuevo-episodio.component.html',
  styleUrls: ['./nuevo-episodio.component.css']
})
export class NuevoEpisodioComponent implements OnInit {
  episodioForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.episodioForm = this.fb.group({
      tipoSolicitante: ['juzgado', Validators.required],
      direccionSubdireccion: ['', Validators.required],
      admResponsable: [''],
      tipoOrganismo: ['', Validators.required],
      organismo: ['', Validators.required],
      tipoProcedimiento: ['', Validators.required],
      numeroAnio: ['', Validators.required],
      anio: [new Date().getFullYear(), Validators.required],
      numeroAtestadoAnio: [''],
      anioAtestado: [new Date().getFullYear()],
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

  ngOnInit() {
    console.log('NuevoEpisodioComponent initialized');
  }

  get nigControls() {
    return (this.episodioForm.get('nig') as FormArray).controls;
  }

  onSubmit() {
    if (this.episodioForm.valid) {
      console.log(this.episodioForm.value);
      // Aquí iría la lógica para guardar el episodio
    }
  }

  nuevoSujeto() {
    // Lógica para crear nuevo sujeto
  }

  notasEpisodio() {
    // Lógica para mostrar/editar notas del episodio
  }

  copiarNIG() {
    const nigValues = this.nigControls.map(control => control.value);
    const nigString = nigValues.join('-');
    navigator.clipboard.writeText(nigString).then(() => {
      console.log('NIG copiado al portapapeles');
    });
  }
}