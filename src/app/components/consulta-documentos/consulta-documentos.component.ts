// ConsultaDocumentosComponent.ts - COMPLETO
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { TAREAS_COMPLETAS } from '../../mock-data/tareas.mock';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { DocumentoService } from '../../services/documento.service';
import { Subscription } from 'rxjs';

export interface Documento {
  id?: string;
  fechaCreacion: Date;
  tipo: string;
  nombre: string;
  estado: string;
  autor: string;
  descLexnet?: string;
  numAnio?: string;
  numEpisodio?: string;
  autorInforme?: string;
}

@Component({
  selector: 'app-consulta-documentos',
  templateUrl: './consulta-documentos.component.html',
  styleUrls: ['./consulta-documentos.component.css']
})
export class ConsultaDocumentosComponent implements OnInit, OnDestroy {
  mostrarFiltros = false;
  itemsPorPagina = 10;
  dataSource: MatTableDataSource<Documento>;
  filtrosForm!: FormGroup;
  selection = new SelectionModel<Documento>(true, []);
  episodioId: string | null = null;
  episodioDetalle: any = null;
  actuacionDetalle: any = null;
  private subscription = new Subscription();

  columnasVisibles = [
    'select',
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
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private documentoService: DocumentoService
  ) {
    this.dataSource = new MatTableDataSource<Documento>([]);
    this.inicializarFormulario();
  }

  ngOnInit() {
    // Suscribirse a actualizaciones de documentos
    this.subscription.add(
      this.documentoService.actualizaciones$.subscribe(() => {
        console.log('Recibida notificación de actualización, recargando datos...');
        this.cargarDatos();
      })
    );
    
    this.route.queryParams.subscribe((params: { [key: string]: string }) => {
      this.episodioId = params['numEpisodio'];
      this.cargarDatos();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
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
    if (this.episodioId) {
      // Cargar documentos de un episodio específico
      this.documentoService.getDocumentosByTarea(this.episodioId).subscribe(docs => {
        console.log('Documentos cargados por episodio:', docs);
        this.dataSource.data = docs as Documento[];
      });
    } else {
      // Cargar todos los documentos
      this.documentoService.getDocumentos().subscribe(docs => {
        console.log('Todos los documentos cargados:', docs);
        this.dataSource.data = docs as Documento[];
      });
    }
  }

  editarDocumento(row: Documento) {
    this.snackBar.open('Funcionalidad no implementada', 'Cerrar', { duration: 3000 });
  }

  nuevaVersion(row: Documento) {
    this.snackBar.open('Funcionalidad no implementada', 'Cerrar', { duration: 3000 });
  }

  eliminarDocumento(row: Documento) {
    this.snackBar.open('Funcionalidad no implementada', 'Cerrar', { duration: 3000 });
  }

  firmarDocumento(row: Documento) {
    this.snackBar.open('Funcionalidad no implementada', 'Cerrar', { duration: 3000 });
  }

  puedeEditar(row: Documento): boolean {
    return ['preparacion', 'completado'].includes(row.estado);
  }

  puedeFirmar(row: Documento): boolean {
    return row.estado === 'completado';
  }

  esDocumentoManual(row: Documento): boolean {
    return row.tipo === 'manual';
  }

  verDocumento(row: Documento) {
    this.snackBar.open('Funcionalidad no implementada', 'Cerrar', { duration: 3000 });
  }

  verInfo(row: Documento) {
    this.snackBar.open('Funcionalidad no implementada', 'Cerrar', { duration: 3000 });
  }

  asociarDocLexnet() {
    this.snackBar.open('Funcionalidad no implementada', 'Cerrar', { duration: 3000 });
  }

  nuevo() {
    this.router.navigate(['consulta-documentos/nuevo']);
  }

  subirFichero() {
    this.snackBar.open('Funcionalidad no implementada', 'Cerrar', { duration: 3000 });
  }

  descargarSeleccionados() {
    const seleccionados = this.selection.selected;
    if (seleccionados.length === 0) {
      this.snackBar.open('No hay documentos seleccionados', 'Cerrar', { duration: 3000 });
      return;
    }
    this.snackBar.open(`Descargando ${seleccionados.length} documentos...`, 'Cerrar', { duration: 3000 });
  }

  irAtras() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}