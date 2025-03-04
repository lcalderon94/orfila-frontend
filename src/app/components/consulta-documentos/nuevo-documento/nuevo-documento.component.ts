import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MockAuthService } from '../../../services/mock-auth.service';
import { UserProfile } from '../../../interfaces/profile.interface';

interface CategoriasPorRol {
  'Director IML': string[];
  'Médico Forense': string[];
  'Administrativo IML': string[];
  [key: string]: string[]; // Índice de firma para permitir acceso dinámico
}

interface TiposPorCategoria {
  'Documentos Citación': string[];
  'Documentos Comunicación': string[];
  'Documentos genéricos': string[];
  [key: string]: string[]; // Índice de firma para permitir acceso dinámico
}

@Component({
  selector: 'app-nuevo-documento',
  templateUrl: './nuevo-documento.component.html',
  styleUrls: ['./nuevo-documento.component.css']
})
export class NuevoDocumentoComponent implements OnInit {
  documentoForm!: FormGroup; // Usando el operador de aserción definitiva
  maxObservaciones = 500;
  categoriasFiltradas: string[] = [];
  tiposFiltrados: string[] = [];
  secuenciaUnica: string = this.generarSecuenciaUnica();

  private categoriasPermitidas: CategoriasPorRol = {
    'Director IML': [
      'Documentos Citación',
      'Documentos Comunicación',
      'Documentos genéricos',
      'Documentos internos',
      'Documentos Solicitud',
      'Informes Periciales Clínica'
    ],
    'Médico Forense': [
      'Documentos Citación',
      'Documentos Comunicación',
      'Documentos genéricos',
      'Documentos Solicitud'
    ],
    'Administrativo IML': [
      'Documentos Citación',
      'Documentos Comunicación',
      'Documentos genéricos'
    ]
  };

  private tiposPermitidos: TiposPorCategoria = {
    'Documentos Citación': [
      'Informe de citación',
      'Informe de comunicación'
    ],
    'Documentos Comunicación': [
      'Informe de comunicación',
      'Informe de notificación'
    ],
    'Documentos genéricos': [
      'Informe genérico',
      'Informe de estado'
    ]
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: MockAuthService
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.documentoForm = this.fb.group({
      categoria: ['', Validators.required],
      tipo: ['', Validators.required],
      nombre: [{value: '', disabled: true}, Validators.required],
      sujeto: [''],
      observaciones: ['', [Validators.maxLength(this.maxObservaciones)]]
    });

    this.documentoForm.get('categoria')?.valueChanges.subscribe(() => {
      this.actualizarTiposDisponibles();
      this.generarNombreDocumento();
    });

    this.documentoForm.get('tipo')?.valueChanges.subscribe(() => {
      this.generarNombreDocumento();
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentProfile().subscribe(profile => {
      if (profile && profile.rol) {
        this.categoriasFiltradas = this.categoriasPermitidas[profile.rol] || [];
      }
    });
  }

  private actualizarTiposDisponibles(): void {
    const categoriaSeleccionada = this.documentoForm.get('categoria')?.value;
    if (categoriaSeleccionada && this.tiposPermitidos[categoriaSeleccionada]) {
      this.tiposFiltrados = this.tiposPermitidos[categoriaSeleccionada];
    } else {
      this.tiposFiltrados = [];
    }
    this.documentoForm.get('tipo')?.setValue('');
  }

  private generarSecuenciaUnica(): string {
    return Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  }

  private generarNombreDocumento(): void {
    const tipo = this.documentoForm.get('tipo')?.value;
    const sujeto = this.documentoForm.get('sujeto')?.value;
    const codigoECD = 'EC001';

    if (tipo && sujeto) {
      const nombreGenerado = `${tipo}${this.secuenciaUnica}${sujeto}${codigoECD}`
        .replace(/\s+/g, '');
      this.documentoForm.get('nombre')?.setValue(nombreGenerado);
    }
  }

  onSubmit(): void {
    if (this.documentoForm.valid) {
      const nuevoDocumento = {
        ...this.documentoForm.value,
        estado: 'en preparación'
      };

      console.log('Nuevo documento:', nuevoDocumento);
      this.router.navigate(['/editor-documento'], { 
        state: { documento: nuevoDocumento }
      });
    }
  }

  volver(): void {
    this.router.navigate(['/consulta-documentos']);
  }

  get caracteresRestantes(): number {
    const observaciones = this.documentoForm.get('observaciones')?.value || '';
    return this.maxObservaciones - observaciones.length;
  }
}