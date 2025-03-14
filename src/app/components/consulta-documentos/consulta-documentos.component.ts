import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TAREAS_COMPLETAS } from '../../mock-data/tareas.mock';
import { SelectionModel } from '@angular/cdk/collections';
import { DocumentoService } from '../../services/documento.service';
import { Subscription } from 'rxjs';
import { LexnetService } from 'src/app/services/lexnet.service';
import { MatDialog } from '@angular/material/dialog';
import { DocumentoDetallesComponent } from 'src/app/components/portafirmas/documento-detalles/documento-detalles.component';
import { PortafirmasService } from '../../services/portafirmas.service';
import { DocumentoAsociado } from '../../mock-data/tareas.mock';
import { DocumentoFirma } from '../../mock-data/portafirmas.mock';

export interface Documento {
  id?: string;
  fechaCreacion: Date;
  tipo: string;
  nombre: string;
  estado: string;
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
    private documentoService: DocumentoService,
    private lexnetService: LexnetService,
    private dialog: MatDialog,
    private portafirmasService: PortafirmasService
  ) {
    this.dataSource = new MatTableDataSource<Documento>([]);
    this.inicializarFormulario();
  }

  ngOnInit() {
    // Suscribirse a actualizaciones de ambos servicios
    this.subscription.add(
      this.documentoService.actualizaciones$.subscribe(() => {
        console.log('Recibida notificación de actualización desde DocumentoService');
        this.cargarDatos();
      })
    );
    
    this.subscription.add(
      this.lexnetService.actualizaciones$.subscribe(() => {
        console.log('Recibida notificación de actualización desde LexnetService');
        this.cargarDatos();
      })
    );
    
    // Inicialización normal
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
    // Aplicar filtros al dataSource
    this.dataSource.filter = JSON.stringify(this.filtrosForm.value);
    this.snackBar.open('Búsqueda realizada', 'Cerrar', {
      duration: 3000
    });
  }

  exportarWord() {
    const seleccionados = this.selection.selected;
    if (seleccionados.length === 0) {
      this.snackBar.open('Seleccione al menos un documento para exportar', 'Cerrar', { duration: 3000 });
      return;
    }
    
    this.snackBar.open(`Exportando ${seleccionados.length} documento(s) a Word...`, 'Cerrar', {
      duration: 3000
    });
    
    // Aquí iría la lógica real de exportación
  }

  exportarPDF() {
    const seleccionados = this.selection.selected;
    if (seleccionados.length === 0) {
      this.snackBar.open('Seleccione al menos un documento para exportar', 'Cerrar', { duration: 3000 });
      return;
    }
    
    this.snackBar.open(`Exportando ${seleccionados.length} documento(s) a PDF...`, 'Cerrar', {
      duration: 3000
    });
    
    // Aquí iría la lógica real de exportación
  }

  exportarExcel() {
    const seleccionados = this.selection.selected;
    if (seleccionados.length === 0) {
      this.snackBar.open('Seleccione al menos un documento para exportar', 'Cerrar', { duration: 3000 });
      return;
    }
    
    this.snackBar.open(`Exportando ${seleccionados.length} documento(s) a Excel...`, 'Cerrar', {
      duration: 3000
    });
    
    // Aquí iría la lógica real de exportación
  }

  cargarDatos() {
    if (this.episodioId) {
      // Cargar documentos de un episodio específico
      this.documentoService.getDocumentosByEpisodio(this.episodioId).subscribe(docs => {
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

  // IMPLEMENTACIÓN REAL DE LOS BOTONES DE OPCIONES
  
  // 1. Ver documento
  verDocumento(row: Documento) {
    if (!row.id) {
      this.snackBar.open('No se puede visualizar el documento: ID no disponible', 'Cerrar', { duration: 3000 });
      return;
    }
    
    // Según el manual (sección 4.5.6.4.1), esto debe descargar el documento en formato PDF
    this.documentoService.descargarDocumento(row.id).subscribe({
      next: (blob) => {
        // Crear objeto URL para el blob
        const url = window.URL.createObjectURL(blob);
        
        // Abrir en una nueva ventana
        window.open(url, '_blank');
        
        // Liberar el objeto URL después de un tiempo
        setTimeout(() => window.URL.revokeObjectURL(url), 3000);
      },
      error: () => {
        this.snackBar.open('Error al visualizar el documento', 'Cerrar', { duration: 3000 });
      }
    });
  }
  
  // 2. Editar documento
  editarDocumento(row: Documento) {
    if (!row.id) {
      this.snackBar.open('No se puede editar el documento: ID no disponible', 'Cerrar', { duration: 3000 });
      return;
    }
    
    // Según el manual, solo se pueden editar documentos en preparación y completados
    if (row.estado !== 'En preparación' && row.estado !== 'Completado') {
      this.snackBar.open('No se puede editar este documento en su estado actual', 'Cerrar', { duration: 3000 });
      return;
    }
    
    // Usar la misma ruta que para nuevo, pero pasando el ID para edición
    this.router.navigate(['consulta-documentos/nuevo'], { 
      queryParams: { 
        id: row.id,
        numEpisodio: row.numEpisodio || this.episodioId,
        modo: 'edicion'
      } 
    });
  }
  
  // 3. Crear nueva versión
  // En consulta-documentos.component.ts
  nuevaVersion(row: Documento) {
    if (!row.id) {
      this.snackBar.open('No se puede crear nueva versión: ID no disponible', 'Cerrar', { duration: 3000 });
      return;
    }
    
    // Verificar que tengamos numEpisodio (obligatorio)
    if (!row.numEpisodio) {
      this.snackBar.open('Error: No se puede crear nueva versión sin número de episodio', 'Cerrar', { duration: 3000 });
      return;
    }
    
    // Verificar si el documento está en un estado que permite crear nueva versión
    if (row.estado !== 'Firmado' && row.estado !== 'Completado') {
      this.snackBar.open('Solo se pueden crear nuevas versiones de documentos firmados o completados', 'Cerrar', { 
        duration: 3000 
      });
      return;
    }
  
    // Creamos solamente con las propiedades que sabemos que existen en la interfaz
    const nuevaVersion: DocumentoAsociado = {
      id: `${row.id}_v${new Date().getTime()}`,
      fechaCreacion: new Date(),
      estado: 'En preparación',
      tipo: row.tipo,
      nombre: row.nombre,
      descLexnet: row.descLexnet || '',
      numAnio: row.numAnio || '',
      numEpisodio: row.numEpisodio,
      autorInforme: row.autorInforme || '',
      autor: row.autorInforme || 'Usuario actual'
      // No más propiedades
    };
    
    this.documentoService.agregarDocumento(nuevaVersion, row.numEpisodio);
    this.snackBar.open('Nueva versión creada correctamente', 'Cerrar', { duration: 3000 });
    this.cargarDatos();
  }
  
  // 4. Eliminar documento
  eliminarDocumento(row: Documento) {
    if (!row.id) {
      this.snackBar.open('No se puede eliminar el documento: ID no disponible', 'Cerrar', { duration: 3000 });
      return;
    }
    
    // Según el manual (sección 4.5.6.4.4), se puede eliminar cualquier documento con confirmación
    const confirmacion = confirm(`¿Está seguro de que desea eliminar el documento "${row.nombre}"?`);
    
    if (confirmacion) {
      this.documentoService.eliminarDocumento(row.id).subscribe({
        next: () => {
          this.snackBar.open('Documento eliminado correctamente', 'Cerrar', { duration: 3000 });
          this.cargarDatos(); // Recargar para reflejar la eliminación
        },
        error: () => {
          this.snackBar.open('Error al eliminar el documento', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
  
  // 5. Firmar documento
  firmarDocumento(row: Documento) {
    if (!row.id) {
      this.snackBar.open('No se puede firmar el documento: ID no disponible', 'Cerrar', { duration: 3000 });
      return;
    }
    
    // Verificar que el documento esté en estado "completado"
    if (row.estado !== 'Completado') {
      this.snackBar.open('Solo se pueden firmar documentos en estado Completado', 'Cerrar', { duration: 3000 });
      return;
    }
    
    // Antes de navegar, hacer una verificación previa para asegurar que el documento existe en portafirmas
    this.portafirmasService.getDocumentosPendientes().subscribe({
      next: (documentos: DocumentoFirma[]) => {
        // Buscar si existe un documento en portafirmas que coincida con este documento
        const documentoEnPortafirmas = documentos.find((d: DocumentoFirma) => 
          d.titulo === row.nombre || 
          d.documentoId === row.id
        );
        
        if (documentoEnPortafirmas) {
          // Si lo encontramos, usamos su ID para la navegación
          this.router.navigate(['/portafirmas'], { 
            queryParams: { 
              documentoId: documentoEnPortafirmas.id,
              numEpisodio: row.numEpisodio 
            } 
          });
        } else {
          // Si no encontramos correspondencia, navegamos de todos modos con el ID del documento original
          this.router.navigate(['/portafirmas'], { 
            queryParams: { 
              documentoId: row.id,
              numEpisodio: row.numEpisodio 
            } 
          });
          this.snackBar.open('Navegando al portafirmas...', 'Cerrar', { duration: 3000 });
        }
      },
      error: (error: any) => {
        console.error('Error al verificar documento en portafirmas:', error);
        // Aún así intentamos navegar al portafirmas con el ID original
        this.router.navigate(['/portafirmas'], { 
          queryParams: { 
            documentoId: row.id,
            numEpisodio: row.numEpisodio 
          } 
        });
        this.snackBar.open('Navegando al portafirmas...', 'Cerrar', { duration: 3000 });
      }
    });
  }
  
  // 6. Ver información del documento
  verInfo(row: Documento) {
    if (!row.id) {
      this.snackBar.open('No se puede ver la información: ID no disponible', 'Cerrar', { duration: 3000 });
      return;
    }
    
    // Según el manual (sección 4.5.6.4.6), esto debe mostrar la información detallada del documento
    this.documentoService.obtenerDetalleDocumento(row.id).subscribe({
      next: (detalle) => {
        // Mostrar los detalles del documento en un diálogo
        const datosExtendidos = {
          ...detalle,
          titulo: row.nombre,
          aplicacion: 'IMLZ',
          estado: row.estado,
          tramitador: row.autorInforme || 'No especificado',
          fechaAlta: row.fechaCreacion,
          tamanio: detalle.tamanio || 'Desconocido',
          firmantes: detalle.firmantes || [],
          historialCambios: detalle.historialCambios || []
        };
        
        this.dialog.open(DocumentoDetallesComponent, {
          width: '800px',
          data: datosExtendidos
        });
      },
      error: () => {
        this.snackBar.open('Error al obtener la información del documento', 'Cerrar', { duration: 3000 });
      }
    });
  }

  // Funciones auxiliares para verificar permisos
  puedeEditar(row: Documento): boolean {
    // Según el manual (sección 4.5.6.4.2), solo se pueden editar documentos en preparación y completados
    return ['En preparación', 'Completado'].includes(row.estado);
  }

  puedeFirmar(row: Documento): boolean {
    // Según el manual (sección 4.5.6.4.5), solo se pueden firmar documentos completados
    return row.estado === 'Completado';
  }

  esDocumentoManual(row: Documento): boolean {
    return row.tipo === 'Documento subido manualmente';
  }

  // Funcionalidad de asociar documentos de LexNET
  asociarDocLexnet() {
    if (!this.episodioId) {
      this.snackBar.open('Debe estar en un episodio para asociar documentos de LexNET', 'Cerrar', { duration: 3000 });
      return;
    }
    
    // Según el manual (sección 4.5.6.6), esto debe permitir asociar documentos de LexNET a una actuación
    this.router.navigate(['/asociar-documentos-lexnet'], {
      queryParams: { numEpisodio: this.episodioId }
    });
  }

  // Crear nuevo documento
  nuevo() {
    this.router.navigate(['consulta-documentos/nuevo'], {
      queryParams: { numEpisodio: this.episodioId }
    });
  }

  // Subir fichero manualmente
  subirFichero() {
    if (!this.episodioId) {
      this.snackBar.open('Debe estar en un episodio para subir documentos', 'Cerrar', { duration: 3000 });
      return;
    }
    
    // Según el manual (sección 4.5.6.3), esto debe permitir adjuntar documentos manuales
    this.router.navigate(['/subir-documento'], {
      queryParams: { numEpisodio: this.episodioId }
    });
  }

  // Descargar ficheros seleccionados
  descargarSeleccionados() {
    const seleccionados = this.selection.selected;
    if (seleccionados.length === 0) {
      this.snackBar.open('No hay documentos seleccionados', 'Cerrar', { duration: 3000 });
      return;
    }
    
    // Según el manual (sección 4.5.6.5), esto debe descargar todos los documentos seleccionados
    const ids = seleccionados.map(doc => doc.id).filter(id => id !== undefined) as string[];
    
    if (ids.length === 0) {
      this.snackBar.open('Error: Los documentos seleccionados no tienen ID', 'Cerrar', { duration: 3000 });
      return;
    }
    
    this.documentoService.descargarMultiplesDocumentos(ids).subscribe({
      next: (blob) => {
        // Crear un enlace para descargar el archivo
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'documentos_seleccionados.zip';
        document.body.appendChild(a);
        a.click();
        
        // Limpieza
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);
        
        this.snackBar.open('Descarga iniciada', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Error al descargar los documentos', 'Cerrar', { duration: 3000 });
      }
    });
  }

  irAtras() {
    // Navegar hacia atrás según contexto
    if (this.episodioId) {
      this.router.navigate(['/episodios/detalle'], { queryParams: { id: this.episodioId } });
    } else {
      this.router.navigate(['/episodios']);
    }
  }
}