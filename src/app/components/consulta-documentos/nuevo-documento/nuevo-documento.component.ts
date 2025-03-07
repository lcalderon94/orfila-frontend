import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; // Agregar ActivatedRoute aquí
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
  documentoForm!: FormGroup;
  maxObservaciones = 500;
  categoriasFiltradas: string[] = [];
  tiposFiltrados: string[] = [];
  secuenciaUnica: string = this.generarSecuenciaUnica();
  episodioId: string | null = null; 


  private categoriasPermitidas: CategoriasPorRol = {
    'Director IML': [
      'Documentos Citación',
      'Documentos Comunicación',
      'Documentos genéricos',
      'Documentos internos',
      'Documentos Solicitud',
      'Informes Periciales Clínica',
      'Informes Medico-Legales',
      'Informes Periciales',
      'Remisión de Muestras'  // Nueva categoría añadida
    ],
    'Médico Forense': [
      'Documentos Citación',
      'Documentos Comunicación',
      'Documentos genéricos',
      'Documentos Solicitud',
      'Informes Medico-Legales',
      'Informes Periciales',
      'Remisión de Muestras'  // Nueva categoría añadida
    ],
    'Administrativo IML': [
      'Documentos Citación',
      'Documentos Comunicación',
      'Documentos genéricos',
      'Remisión de Muestras'  // Nueva categoría añadida
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
    ],
    'Informes Medico-Legales': [
      'Informe de previsión de sanidad',
      'Informe de sanidad',
      'Informe de autopsia'
    ],
    'Informes Periciales': [
      'Informe pericial',
      'Informe de valoración'
    ],
    'Remisión de Muestras': [
      'Informe de Remisión de Muestras al INTCF'  // Nuevo tipo específico para remisión de muestras
    ]
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
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
    
    // Obtener el episodioId de los parámetros de URL
    this.route.queryParams.subscribe(params => {
      this.episodioId = params['numEpisodio'];
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
      
      // Lista de todos los tipos de informes que pueden acceder al flujo de remisión de muestras
      const tiposRemisionMuestras = [
        'Informe de Remisión de Muestras al INTCF',
        'Informe genérico',
        'Informe de autopsia',
        'Informe toxicológico',
        'Informe histopatológico',
        'Informe pericial'
      ];
      
      // Verificar si el tipo seleccionado está en la lista de informes compatibles
      if (tiposRemisionMuestras.includes(nuevoDocumento.tipo)) {
        console.log('Redirigiendo a generador de informe de remisión');
        this.router.navigate(['/generar-informe-remision'], {
          queryParams: { numEpisodio: this.episodioId }
        });
      } else {
        // Para otros tipos de documentos, mostrar mensaje y redirigir
        this.snackBar.open('Funcionalidad en desarrollo', 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/consulta-documentos']);
      }
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