import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Documento {
  fechaCreacion: Date;
  tipo: string;
  nombre: string;
  descLexnet: string;
  numAnio: string;
  numEpisodio: string;
  autorInforme: string;
  estado: string;
}

@Component({
  selector: 'app-consulta-documentos',
  templateUrl: './consulta-documentos.component.html',
  styleUrls: ['./consulta-documentos.component.css']
})
export class ConsultaDocumentosComponent implements OnInit {
  mostrarFiltros = false;
  itemsPorPagina = 10;
  dataSource: MatTableDataSource<Documento>;
  filtrosForm!: FormGroup;

  columnasVisibles = [
    'fechaCreacion',
    'tipo',
    'nombre',
    'descLexnet',
    'numAnio',
    'numEpisodio',
    'autorInforme',
    'estado',
    'opciones'
  ];

  filtrosColumnas = {
    fechaCreacion: '',
    tipo: '',
    nombre: '',
    descLexnet: '',
    numAnio: '',
    numEpisodio: '',
    autorInforme: '',
    estado: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Documento>(this.getDatosIniciales());
    this.inicializarFormulario();
  }

  private getDatosIniciales(): Documento[] {
    return [
      {
        fechaCreacion: new Date('2022-07-27'),
        tipo: 'Documento texto libre (Documentos Genérico)',
        nombre: 'DocumentoTextoLibre165892352',
        descLexnet: 'Documentotextollibre165892352/3890-Lopez-Santiago-',
        numAnio: '',
        numEpisodio: 'EP81177',
        autorInforme: '02460888A',
        estado: 'Completado'
      },
      {
        fechaCreacion: new Date('2022-07-27'),
        tipo: 'Documento texto libre (Documentos Genérico)',
        nombre: 'DocumentoTextoLibre165891602',
        descLexnet: 'Documentotextollibre165891602/8930-Lopez-Santiago-',
        numAnio: '',
        numEpisodio: 'EP81177',
        autorInforme: '02460888A',
        estado: 'Firmado'
      },
      {
        fechaCreacion: new Date('2022-07-27'),
        tipo: 'Documento texto libre (Documentos Genérico)',
        nombre: 'DocumentoTextoLibre165891600',
        descLexnet: 'Documentotextollibre165891600/6826-Lopez-Santiago-',
        numAnio: '',
        numEpisodio: 'EP81177',
        autorInforme: '02460888A',
        estado: 'Firmado'
      },
      {
        fechaCreacion: new Date('2022-07-27'),
        tipo: 'Documento texto libre (Documentos Genérico)',
        nombre: 'DocumentoTextoLibre165891422',
        descLexnet: 'Documentotextollibre165891422/738--3502ks799900001',
        numAnio: '9870876/2022',
        numEpisodio: 'EP81158',
        autorInforme: '46888715H',
        estado: 'Firmado'
      },
      {
        fechaCreacion: new Date('2022-07-27'),
        tipo: 'Informe de estado (Informes Periciales Clínica)',
        nombre: 'InformeEstado165891502',
        descLexnet: 'Informedeestado165891502/5019-Lopez-Santiago-02003379/9900001',
        numAnio: '33333333/2022',
        numEpisodio: 'EP81142',
        autorInforme: '46888715H',
        estado: 'En preparación'
      },
      {
        fechaCreacion: new Date('2022-07-26'),
        tipo: 'Informe Remisión de Muestras (Informes Remisión de Muestras y Paquetes)',
        nombre: 'InformeRemisionMuestras165883452',
        descLexnet: 'InformeRemisionDeMuestras165883452/2455-Lopez-Santiago-02003379/9900001',
        numAnio: '',
        numEpisodio: 'EP81166',
        autorInforme: '02460888A',
        estado: 'Completado'
      },
      {
        fechaCreacion: new Date('2022-07-26'),
        tipo: 'Informe de confirmación de medidas de apoyo (Informes Periciales Psiquiatría)',
        nombre: 'InformeConfirmacionMedidas165882902',
        descLexnet: 'Informedeconfirmaciondemedidasdeapoyo165882902/529-Lopez-Santiago-02003379/9900001',
        numAnio: '',
        numEpisodio: 'EP81166',
        autorInforme: '02460888A',
        estado: 'Completado'
      },
      {
        fechaCreacion: new Date('2022-07-26'),
        tipo: 'Documento texto libre (Documentos Genérico)',
        nombre: 'DocumentoTextoLibre165882998',
        descLexnet: 'Documentotextollibre165882998/8006-Lopez-Santiago-02003379/9900001',
        numAnio: '33333333/2022',
        numEpisodio: 'EP81142',
        autorInforme: '46888715H',
        estado: 'Firmado'
      },
      {
        fechaCreacion: new Date('2022-07-26'),
        tipo: 'Informe Remisión de Paquetes (Informes Remisión de Muestras y Paquetes)',
        nombre: 'InformeRemisionPaquetes165882870',
        descLexnet: 'InformeRemisionDePaquetes165882870/529-Lopez-Santiago-02003379/9900001',
        numAnio: '33333333/2022',
        numEpisodio: 'EP81142',
        autorInforme: '46888715H',
        estado: 'Firmado'
      },
      {
        fechaCreacion: new Date('2022-07-26'),
        tipo: 'Informe Remisión de Paquetes (Informes Remisión de Muestras y Paquetes)',
        nombre: 'InformeRemisionPaquetes165882301',
        descLexnet: 'InformeRemisionDePaquetes165882301/541-Lopez-Santiago-02003379/9900001',
        numAnio: '33333333/2022',
        numEpisodio: 'EP81142',
        autorInforme: '46888715H',
        estado: 'En preparación'
      }
    ];
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.configurarFiltrado();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  inicializarFormulario() {
    this.filtrosForm = this.fb.group({
      fechaDesde: [null],
      fechaHasta: [null],
      estado: [''],
      tipoPerito: [''],
      autorInforme: [''],
      fechaResponsable: [''],
      textoBuscar: [''],
      numAnio: ['']
    });
  }

  configurarFiltrado() {
    this.dataSource.filterPredicate = (data: Documento, filter: string) => {
      const searchTerms = JSON.parse(filter);
      
      // Filtros de columnas
      let cumpleFiltros = true;
      Object.keys(this.filtrosColumnas).forEach(key => {
        const valor = searchTerms[key].toLowerCase();
        if (valor && data[key as keyof Documento]) {
          const dataValue = String(data[key as keyof Documento]).toLowerCase();
          if (!dataValue.includes(valor)) {
            cumpleFiltros = false;
          }
        }
      });

      return cumpleFiltros;
    };
  }

  aplicarFiltrosColumnas() {
    const filtroJson = JSON.stringify(this.filtrosColumnas);
    this.dataSource.filter = filtroJson;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  cambiarItemsPorPagina() {
    if (this.paginator) {
      this.paginator.pageSize = this.itemsPorPagina;
      this.paginator.pageIndex = 0;
    }
  }

  limpiarFiltros() {
    this.filtrosForm.reset();
    this.filtrosColumnas = {
      fechaCreacion: '',
      tipo: '',
      nombre: '',
      descLexnet: '',
      numAnio: '',
      numEpisodio: '',
      autorInforme: '',
      estado: ''
    };
    this.aplicarFiltrosColumnas();
    this.snackBar.open('Filtros limpiados', 'Cerrar', {
      duration: 3000
    });
  }

  buscar() {
    console.log('Filtros aplicados:', this.filtrosForm.value);
    // Aquí iría la lógica de búsqueda con el servicio
    this.snackBar.open('Búsqueda realizada', 'Cerrar', {
      duration: 3000
    });
  }

  exportarWord() {
    this.snackBar.open('Exportando a Word...', 'Cerrar', {
      duration: 3000
    });
  }

  exportarPDF() {
    this.snackBar.open('Exportando a PDF...', 'Cerrar', {
      duration: 3000
    });
  }

  exportarExcel() {
    this.snackBar.open('Exportando a Excel...', 'Cerrar', {
      duration: 3000
    });
  }

  cargarDatos() {
    // Aquí iría la llamada al servicio para recargar datos
    this.snackBar.open('Actualizando datos...', 'Cerrar', {
      duration: 3000
    });
  }

  verDetalle(row: Documento) {
    console.log('Ver detalle del documento:', row);
    // Implementar lógica para ver detalle
  }
}