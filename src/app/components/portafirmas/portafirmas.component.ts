// portafirmas.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PortafirmasService } from '../../services/portafirmas.service';
import { DocumentoFirma, DOCUMENTOS_FIRMA_MOCK } from '../../mock-data/portafirmas.mock';
import { DocumentoDetallesComponent } from 'src/app/components/portafirmas/documento-detalles/documento-detalles.component';

@Component({
  selector: 'app-portafirmas',
  templateUrl: './portafirmas.component.html',
  styleUrls: ['./portafirmas.component.css']
})
export class PortafirmasComponent implements OnInit {
  // Estado de pestañas
  pestanaActiva = 'firmante';
  
  // Datos para los documentos
  dataSource = new MatTableDataSource<DocumentoFirma>([]);
  selection = new SelectionModel<DocumentoFirma>(true, []);
  columnas: string[] = [];
  
  // Estado de UI
  cargando = false;
  mostrarDialogoRechazo = false;
  mostrarDialogoRechazoValidacion = false;
  mostrarDialogoModificacionFlujo = false;
  mostrarDialogoNuevoFlujo = false;
  documentoSeleccionado: DocumentoFirma | null = null;
  
  // Formularios
  motivoForm: FormGroup;
  motivoValidacionForm: FormGroup;
  flujoForm: FormGroup;
  nuevoFlujoForm: FormGroup;
  
  // IDs de URL
  documentoId: string | null = null;
  episodioId: string | null = null;
  
  // Control de documentos marcados para firmar o rechazar
  docsToSign: Set<string> = new Set();
  docsToReject: Set<string> = new Set();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private portafirmasService: PortafirmasService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    // Inicializar formularios
    this.motivoForm = this.fb.group({
      motivo: ['', [Validators.required, Validators.minLength(10)]]
    });
    
    this.motivoValidacionForm = this.fb.group({
      motivo: ['', [Validators.required, Validators.minLength(10)]]
    });
    
    this.flujoForm = this.fb.group({
      tipoFlujo: ['secuencial', Validators.required],
      firmantes: this.fb.array([
        this.crearFirmanteFormGroup()
      ])
    });
    
    this.nuevoFlujoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', Validators.required],
      tipoDocumento: ['', Validators.required],
      tipoFlujo: ['secuencial', Validators.required],
      firmantes: this.fb.array([
        this.crearFirmanteFormGroup()
      ])
    });
  }

  ngOnInit(): void {
    // Obtener parámetros de URL
    this.route.queryParams.subscribe(params => {
      this.documentoId = params['documentoId'];
      this.episodioId = params['numEpisodio'];
    });
    
    // Carga inicial de documentos
    this.cargarDocumentos();
    
    // Actualizar columnas según la pestaña activa
    this.actualizarColumnas();
  }
  
  ngAfterViewInit() {
    // Configurar paginador y ordenación
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  
  // Métodos para controlar documentos marcados
  isDocumentMarkedForSign(docId: string): boolean {
    return this.docsToSign.has(docId);
  }

  isDocumentMarkedForReject(docId: string): boolean {
    return this.docsToReject.has(docId);
  }

  toggleSignDocument(event: any, doc: DocumentoFirma): void {
    if (event.checked) {
      this.docsToSign.add(doc.id);
      this.docsToReject.delete(doc.id);
      this.selection.select(doc);
    } else {
      this.docsToSign.delete(doc.id);
      if (!this.docsToReject.has(doc.id)) {
        this.selection.deselect(doc);
      }
    }
  }

  toggleRejectDocument(event: any, doc: DocumentoFirma): void {
    if (event.checked) {
      this.docsToReject.add(doc.id);
      this.docsToSign.delete(doc.id);
      this.selection.select(doc);
    } else {
      this.docsToReject.delete(doc.id);
      if (!this.docsToSign.has(doc.id)) {
        this.selection.deselect(doc);
      }
    }
  }
  
  // NAVEGACIÓN ENTRE PESTAÑAS
  cambiarPestana(pestana: string): void {
    this.pestanaActiva = pestana;
    this.selection.clear();
    this.docsToSign.clear();
    this.docsToReject.clear();
    
    // Actualizar columnas según la pestaña
    this.actualizarColumnas();
    
    switch(pestana) {
      case 'firmante':
        this.cargarDocumentos();
        break;
      case 'tramitador':
        this.cargarDocumentosTramitador();
        break;
      case 'historico':
        this.cargarHistorico();
        break;
      case 'validar':
        this.cargarDocumentosValidar();
        break;
    }
  }
  
  // Actualizar columnas según la pestaña activa
  actualizarColumnas() {
    if (this.pestanaActiva === 'historico') {
      this.columnas = ['aplicacion', 'titulo', 'tramitador', 'estado', 'progreso', 'fechaAlta', 'motivoRechazo', 'acciones'];
    } else if (this.pestanaActiva === 'tramitador') {
      // Incluimos firmantes para tramitador
      this.columnas = ['select', 'aplicacion', 'titulo', 'tramitador', 'estado', 'progreso', 'fechaAlta', 'firmantes', 'acciones'];
    } else if (this.pestanaActiva === 'validar') {
      this.columnas = ['select', 'aplicacion', 'titulo', 'tramitador', 'estado', 'progreso', 'fechaAlta', 'acciones'];
    } else {
      // Firmante (pestaña por defecto)
      this.columnas = ['select', 'aplicacion', 'titulo', 'tramitador', 'estado', 'progreso', 'fechaAlta', 'mark', 'done', 'acciones'];
    }
  }
  
  // Método para obtener el ícono según el estado
  getIconoEstado(estado: string): string {
    switch (estado) {
      case 'Firmado': return 'check_circle';
      case 'Rechazado': return 'cancel';
      case 'Pendiente de firma': return 'description';
      case 'En proceso': return 'schedule';
      case 'Pendiente de validación': return 'pending';
      case 'Validado': return 'verified';
      case 'Flujo anulado': return 'block';
      default: return 'description';
    }
  }
  
  // CARGAR DATOS
  cargarDocumentos(): void {
    this.cargando = true;
    
    this.portafirmasService.getDocumentosPendientes().subscribe({
      next: (documentos) => {
        this.dataSource.data = documentos;
        this.cargando = false;
        
        // Si hay un documento específico en la URL, lo seleccionamos
        if (this.documentoId) {
          const documento = documentos.find(d => d.id === this.documentoId);
          if (documento) {
            this.selection.select(documento);
            this.docsToSign.add(documento.id); // Por defecto marcarlo para firmar
            
            // Opcionalmente, mostrar un mensaje indicando que se ha seleccionado el documento
            this.snackBar.open(`Documento seleccionado para firmar: ${documento.titulo}`, 'Cerrar', {
              duration: 3000
            });
          } else {
            this.snackBar.open('No se encontró el documento especificado', 'Cerrar', {
              duration: 3000
            });
          }
        }
      },
      error: (error) => {
        console.error('Error al cargar documentos:', error);
        this.snackBar.open('Error al cargar documentos', 'Cerrar', {duration: 3000});
        this.cargando = false;
      }
    });
  }
  
  cargarHistorico(): void {
    this.cargando = true;
    
    this.portafirmasService.getDocumentosHistorico().subscribe({
      next: (documentos) => {
        this.dataSource.data = documentos;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar histórico:', error);
        this.snackBar.open('Error al cargar histórico', 'Cerrar', {duration: 3000});
        this.cargando = false;
      }
    });
  }
  
  cargarDocumentosTramitador(): void {
    this.cargando = true;
    
    this.portafirmasService.getDocumentosTramitador().subscribe({
      next: (documentos) => {
        this.dataSource.data = documentos;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar documentos tramitados:', error);
        this.snackBar.open('Error al cargar documentos tramitados', 'Cerrar', {duration: 3000});
        this.cargando = false;
      }
    });
  }

  cargarDocumentosValidar(): void {
    this.cargando = true;
    
    this.portafirmasService.getDocumentosValidar().subscribe({
      next: (documentos) => {
        this.dataSource.data = documentos;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar documentos para validar:', error);
        this.snackBar.open('Error al cargar documentos para validar', 'Cerrar', {duration: 3000});
        this.cargando = false;
      }
    });
  }
  
  // SELECCIÓN DE DOCUMENTOS
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows && numRows > 0;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.docsToSign.clear();
      this.docsToReject.clear();
    } else {
      this.dataSource.data.forEach(row => {
        this.selection.select(row);
        if (this.pestanaActiva === 'firmante') {
          // Marcar todos para firmar por defecto en la pestaña firmante
          this.docsToSign.add(row.id);
        }
      });
    }
  }
  
  // ACCIONES DE FIRMANTE
  firmarSeleccionados() {
    if (this.docsToSign.size === 0) {
      this.snackBar.open('Debe marcar al menos un documento para firmar', 'Cerrar', {duration: 3000});
      return;
    }
    
    this.cargando = true;
    
    // Obtener IDs de los documentos marcados para firmar
    const docIdsToSign = Array.from(this.docsToSign);
    
    // Firmar documentos
    this.portafirmasService.firmarDocumentos(docIdsToSign).subscribe({
      next: (resultado) => {
        this.cargando = false;
        if (resultado) {
          this.selection.clear();
          this.docsToSign.clear();
          this.docsToReject.clear();
          this.snackBar.open('Documentos firmados correctamente', 'Cerrar', {duration: 3000});
          
          // Cambiar a la pestaña histórico para ver los resultados
          setTimeout(() => {
            this.cambiarPestana('historico');
            this.snackBar.open('Los documentos se han movido a HISTÓRICO', 'Cerrar', {duration: 3000});
          }, 1000);
        } else {
          this.snackBar.open('Error al firmar algunos documentos', 'Cerrar', {duration: 3000});
        }
      },
      error: (error) => {
        console.error('Error al firmar documentos:', error);
        this.cargando = false;
        this.snackBar.open('Error al firmar documentos', 'Cerrar', {duration: 3000});
      }
    });
  }
  
  abrirDialogoRechazo() {
    if (this.docsToReject.size === 0) {
      this.snackBar.open('Debe marcar al menos un documento para rechazar', 'Cerrar', {duration: 3000});
      return;
    }
    
    this.mostrarDialogoRechazo = true;
  }
  
  cancelarRechazo() {
    this.mostrarDialogoRechazo = false;
    this.motivoForm.reset();
  }
  
  confirmarRechazo() {
    if (this.motivoForm.invalid) {
      return;
    }
    
    this.cargando = true;
    
    // Obtener motivo de rechazo
    const motivo = this.motivoForm.get('motivo')?.value;
    
    // Obtener IDs de documentos marcados para rechazar
    const docIdsToReject = Array.from(this.docsToReject);
    
    // Rechazar documentos
    this.portafirmasService.rechazarDocumentos(docIdsToReject, motivo).subscribe({
      next: (resultado) => {
        this.cargando = false;
        this.mostrarDialogoRechazo = false;
        
        if (resultado) {
          this.selection.clear();
          this.docsToSign.clear();
          this.docsToReject.clear();
          this.motivoForm.reset();
          this.snackBar.open('Documentos rechazados correctamente', 'Cerrar', {duration: 3000});
          
          // Cambiar a la pestaña histórico para ver los resultados
          setTimeout(() => {
            this.cambiarPestana('historico');
            this.snackBar.open('Los documentos se han movido a HISTÓRICO', 'Cerrar', {duration: 3000});
          }, 1000);
        } else {
          this.snackBar.open('Error al rechazar algunos documentos', 'Cerrar', {duration: 3000});
        }
      },
      error: (error) => {
        console.error('Error al rechazar documentos:', error);
        this.cargando = false;
        this.snackBar.open('Error al rechazar documentos', 'Cerrar', {duration: 3000});
      }
    });
  }
  
  // ACCIONES DE TRAMITADOR
  modificarFlujoFirma() {
    if (this.selection.selected.length !== 1) {
      this.snackBar.open('Seleccione un único documento para modificar su flujo', 'Cerrar', {duration: 3000});
      return;
    }
    
    this.documentoSeleccionado = this.selection.selected[0];
    this.mostrarDialogoModificacionFlujo = true;
    
    // Cargar datos del flujo actual para el documento seleccionado
    this.cargarDatosFlujo();
  }
  
  reasignarFirmantes() {
    if (this.selection.selected.length !== 1) {
      this.snackBar.open('Seleccione un único documento para reasignar firmantes', 'Cerrar', {duration: 3000});
      return;
    }
    
    const documento = this.selection.selected[0];
    this.cargando = true;
    
    this.portafirmasService.reasignarFirmantes(documento.id, ['12345678A', '87654321B']).subscribe({
      next: () => {
        this.cargando = false;
        this.snackBar.open('Firmantes reasignados correctamente', 'Cerrar', {duration: 3000});
        
        // Actualizamos la lista de documentos en tramitación
        this.cargarDocumentosTramitador();
        
        // Ya no cambiamos a la pestaña histórico - eliminamos ese código
      },
      error: (error) => {
        this.cargando = false;
        console.error('Error al reasignar firmantes:', error);
        this.snackBar.open('Error al reasignar firmantes', 'Cerrar', {duration: 3000});
      }
    });
  }
  
  anularFlujo() {
    if (this.selection.selected.length === 0) {
      this.snackBar.open('Seleccione al menos un documento para anular su flujo', 'Cerrar', {duration: 3000});
      return;
    }
    
    const confirmacion = confirm(`¿Está seguro de que desea anular el flujo de firma de ${this.selection.selected.length} documento(s)?`);
    
    if (confirmacion) {
      const documentosIds = this.selection.selected.map(doc => doc.id);
      this.cargando = true;
      
      this.portafirmasService.anularFlujos(documentosIds).subscribe({
        next: () => {
          this.cargando = false;
          this.snackBar.open('Flujo(s) anulado(s) correctamente', 'Cerrar', {duration: 3000});
          this.selection.clear();
          
          // Mover al histórico y cambiar a la pestaña histórico
          setTimeout(() => {
            this.cambiarPestana('historico');
            this.snackBar.open('Los documentos han sido movidos a HISTÓRICO', 'Cerrar', {duration: 3000});
          }, 1000);
        },
        error: (error) => {
          this.cargando = false;
          console.error('Error al anular flujos:', error);
          this.snackBar.open('Error al anular flujos', 'Cerrar', {duration: 3000});
        }
      });
    }
  }
  
  crearNuevoFlujo() {
    // Resetear el formulario
    this.nuevoFlujoForm.reset({
      tipoFlujo: 'secuencial'
    });
    
    // Limpiar firmantes
    const firmantesArray = this.nuevoFlujoForm.get('firmantes') as FormArray;
    while (firmantesArray.length > 0) {
      firmantesArray.removeAt(0);
    }
    
    // Añadir un firmante inicial
    firmantesArray.push(this.crearFirmanteFormGroup());
    
    // Mostrar diálogo
    this.mostrarDialogoNuevoFlujo = true;
  }
  
  cancelarNuevoFlujo() {
    this.mostrarDialogoNuevoFlujo = false;
  }
  
  guardarNuevoFlujo() {
    if (this.nuevoFlujoForm.invalid) {
      return;
    }
    
    this.cargando = true;
    const nuevoFlujo = this.nuevoFlujoForm.value;
    
    // Aquí el componente llama al servicio
    this.portafirmasService.crearNuevoFlujo(nuevoFlujo).subscribe({
      next: () => {
        this.cargando = false;
        this.mostrarDialogoNuevoFlujo = false;
        this.snackBar.open('Nuevo flujo de firma creado correctamente', 'Cerrar', {duration: 3000});
        
        // Actualizar la lista de documentos en tramitación
        this.cargarDocumentosTramitador();
        
        // Eliminamos el cambio automático a histórico
      },
      error: (error) => {
        this.cargando = false;
        console.error('Error al crear nuevo flujo:', error);
        this.snackBar.open('Error al crear nuevo flujo', 'Cerrar', {duration: 3000});
      }
    });
  }
  
  verFirmantes(documento: DocumentoFirma) {
    this.portafirmasService.getFirmantes(documento.id).subscribe({
      next: (firmantes) => {
        let mensaje = `Firmantes del documento "${documento.titulo}":\n`;
        firmantes.forEach(firmante => {
          mensaje += `- ${firmante.nombre} (${firmante.estado})\n`;
        });
        alert(mensaje);
      },
      error: (error) => {
        console.error('Error al obtener firmantes:', error);
        this.snackBar.open('Error al obtener firmantes', 'Cerrar', {duration: 3000});
      }
    });
  }
  
  verHistorialFlujo(documento: DocumentoFirma) {
    this.portafirmasService.getHistorialFlujo(documento.id).subscribe({
      next: (historial) => {
        let mensaje = `Historial del documento "${documento.titulo}":\n`;
        historial.forEach(entrada => {
          const fecha = new Date(entrada.fecha).toLocaleString();
          mensaje += `- ${fecha}: ${entrada.accion} (${entrada.usuario})\n`;
        });
        alert(mensaje);
      },
      error: (error) => {
        console.error('Error al obtener historial:', error);
        this.snackBar.open('Error al obtener historial', 'Cerrar', {duration: 3000});
      }
    });
  }
  
  // Métodos para el formulario de flujo
  get firmantes(): FormArray {
    return this.flujoForm.get('firmantes') as FormArray;
  }
  
  get nuevosFirmantes(): FormArray {
    return this.nuevoFlujoForm.get('firmantes') as FormArray;
  }
  
  crearFirmanteFormGroup() {
    return this.fb.group({
      nombre: ['', Validators.required],
      dni: ['', Validators.required],
      orden: [0, Validators.required]
    });
  }
  
  getFirmanteControl(index: number, controlName: string): FormControl {
    return this.firmantes.at(index).get(controlName) as FormControl;
  }
  
  getNuevoFirmanteControl(index: number, controlName: string): FormControl {
    return this.nuevosFirmantes.at(index).get(controlName) as FormControl;
  }
  
  cargarDatosFlujo() {
    // Limpiar firmantes actuales
    while (this.firmantes.length > 0) {
      this.firmantes.removeAt(0);
    }
    
    // Simulamos datos de firmantes para el documento seleccionado
    const firmantesEjemplo = [
      { nombre: 'ARANDA RAMIREZ, CAROLINA', dni: '12345678A', orden: 1 },
      { nombre: 'LÓPEZ GARCÍA, MANUEL', dni: '87654321B', orden: 2 }
    ];
    
    // Añadir firmantes al formulario
    firmantesEjemplo.forEach(firmante => {
      this.firmantes.push(
        this.fb.group({
          nombre: [firmante.nombre, Validators.required],
          dni: [firmante.dni, Validators.required],
          orden: [firmante.orden, Validators.required]
        })
      );
    });
    
    // Establecer tipo de flujo (simulado)
    this.flujoForm.get('tipoFlujo')?.setValue('secuencial');
  }
  
  agregarFirmante() {
    const nuevoOrden = this.firmantes.length + 1;
    this.firmantes.push(
      this.fb.group({
        nombre: ['', Validators.required],
        dni: ['', Validators.required],
        orden: [nuevoOrden, Validators.required]
      })
    );
  }
  
  agregarNuevoFirmante() {
    const nuevoOrden = this.nuevosFirmantes.length + 1;
    this.nuevosFirmantes.push(
      this.fb.group({
        nombre: ['', Validators.required],
        dni: ['', Validators.required],
        orden: [nuevoOrden, Validators.required]
      })
    );
  }
  
  eliminarFirmante(index: number) {
    this.firmantes.removeAt(index);
    
    // Reordenar los firmantes restantes
    for (let i = 0; i < this.firmantes.length; i++) {
      this.firmantes.at(i).get('orden')?.setValue(i + 1);
    }
  }
  
  eliminarNuevoFirmante(index: number) {
    this.nuevosFirmantes.removeAt(index);
    
    // Reordenar los firmantes restantes
    for (let i = 0; i < this.nuevosFirmantes.length; i++) {
      this.nuevosFirmantes.at(i).get('orden')?.setValue(i + 1);
    }
  }
  
  moverArribaFirmante(index: number) {
    if (index <= 0) return;
    
    const actual = this.firmantes.at(index).value;
    const anterior = this.firmantes.at(index - 1).value;
    
    // Intercambiar posiciones
    this.firmantes.at(index).get('orden')?.setValue(index);
    this.firmantes.at(index - 1).get('orden')?.setValue(index + 1);
    
    // Reorganizar el FormArray
    this.firmantes.removeAt(index);
    this.firmantes.removeAt(index - 1);
    
    this.firmantes.insert(index - 1, this.fb.group({
      nombre: [actual.nombre, Validators.required],
      dni: [actual.dni, Validators.required],
      orden: [index, Validators.required]
    }));
    
    this.firmantes.insert(index, this.fb.group({
      nombre: [anterior.nombre, Validators.required],
      dni: [anterior.dni, Validators.required],
      orden: [index + 1, Validators.required]
    }));
  }
  
  moverArribaNuevoFirmante(index: number) {
    if (index <= 0) return;
    
    const actual = this.nuevosFirmantes.at(index).value;
    const anterior = this.nuevosFirmantes.at(index - 1).value;
    
    // Intercambiar posiciones
    this.nuevosFirmantes.at(index).get('orden')?.setValue(index);
    this.nuevosFirmantes.at(index - 1).get('orden')?.setValue(index + 1);
    
    // Reorganizar el FormArray
    this.nuevosFirmantes.removeAt(index);
    this.nuevosFirmantes.removeAt(index - 1);
    
    this.nuevosFirmantes.insert(index - 1, this.fb.group({
      nombre: [actual.nombre, Validators.required],
      dni: [actual.dni, Validators.required],
      orden: [index, Validators.required]
    }));
    
    this.nuevosFirmantes.insert(index, this.fb.group({
      nombre: [anterior.nombre, Validators.required],
      dni: [anterior.dni, Validators.required],
      orden: [index + 1, Validators.required]
    }));
  }
  
  moverAbajoFirmante(index: number) {
    if (index >= this.firmantes.length - 1) return;
    
    const actual = this.firmantes.at(index).value;
    const siguiente = this.firmantes.at(index + 1).value;
    
    // Intercambiar posiciones
    this.firmantes.at(index).get('orden')?.setValue(index + 2);
    this.firmantes.at(index + 1).get('orden')?.setValue(index + 1);
    
    // Reorganizar el FormArray
    this.firmantes.removeAt(index);
    this.firmantes.removeAt(index); // Ahora el siguiente está en la misma posición
    
    this.firmantes.insert(index, this.fb.group({
      nombre: [siguiente.nombre, Validators.required],
      dni: [siguiente.dni, Validators.required],
      orden: [index + 1, Validators.required]
    }));
    
    this.firmantes.insert(index + 1, this.fb.group({
      nombre: [actual.nombre, Validators.required],
      dni: [actual.dni, Validators.required],
      orden: [index + 2, Validators.required]
    }));
  }
  
  moverAbajoNuevoFirmante(index: number) {
    if (index >= this.nuevosFirmantes.length - 1) return;
    
    const actual = this.nuevosFirmantes.at(index).value;
    const siguiente = this.nuevosFirmantes.at(index + 1).value;
    
    // Intercambiar posiciones
    this.nuevosFirmantes.at(index).get('orden')?.setValue(index + 2);
    this.nuevosFirmantes.at(index + 1).get('orden')?.setValue(index + 1);
    
    // Reorganizar el FormArray
    this.nuevosFirmantes.removeAt(index);
    this.nuevosFirmantes.removeAt(index); // Ahora el siguiente está en la misma posición
    
    this.nuevosFirmantes.insert(index, this.fb.group({
      nombre: [siguiente.nombre, Validators.required],
      dni: [siguiente.dni, Validators.required],
      orden: [index + 1, Validators.required]
    }));
    
    this.nuevosFirmantes.insert(index + 1, this.fb.group({
      nombre: [actual.nombre, Validators.required],
      dni: [actual.dni, Validators.required],
      orden: [index + 2, Validators.required]
    }));
  }
  
  cancelarModificacionFlujo() {
    this.mostrarDialogoModificacionFlujo = false;
    this.documentoSeleccionado = null;
  }
  
  guardarModificacionFlujo() {
    if (this.flujoForm.invalid || !this.documentoSeleccionado) {
      return;
    }
    
    this.cargando = true;
    
    this.portafirmasService.modificarFlujo(this.documentoSeleccionado.id, this.flujoForm.value).subscribe({
      next: () => {
        this.cargando = false;
        this.mostrarDialogoModificacionFlujo = false;
        this.snackBar.open('Flujo de firma modificado correctamente', 'Cerrar', {duration: 3000});
        this.documentoSeleccionado = null;
        
        // Mover al histórico y cambiar a la pestaña histórico
        setTimeout(() => {
          this.cambiarPestana('historico');
          this.snackBar.open('El documento ha sido movido a HISTÓRICO', 'Cerrar', {duration: 3000});
        }, 1000);
      },
      error: (error) => {
        this.cargando = false;
        console.error('Error al modificar flujo:', error);
        this.snackBar.open('Error al modificar flujo', 'Cerrar', {duration: 3000});
      }
    });
  }
  
  // ACCIONES DE VALIDADOR
  validarSeleccionados() {
    if (this.selection.selected.length === 0) {
      this.snackBar.open('Debe seleccionar al menos un documento para validar', 'Cerrar', {duration: 3000});
      return;
    }
    
    this.cargando = true;
    const documentosIds = this.selection.selected.map(doc => doc.id);
    
    this.portafirmasService.validarDocumentos(documentosIds).subscribe({
      next: () => {
        this.cargando = false;
        this.snackBar.open('Documentos validados correctamente', 'Cerrar', {duration: 3000});
        this.selection.clear();
        
        // Mover al histórico y cambiar a la pestaña histórico
        setTimeout(() => {
          this.cambiarPestana('historico');
          this.snackBar.open('Los documentos han sido movidos a HISTÓRICO', 'Cerrar', {duration: 3000});
        }, 1000);
      },
      error: (error) => {
        this.cargando = false;
        console.error('Error al validar documentos:', error);
        this.snackBar.open('Error al validar documentos', 'Cerrar', {duration: 3000});
      }
    });
  }
  
  abrirDialogoRechazoValidacion() {
    if (this.selection.selected.length === 0) {
      this.snackBar.open('Debe seleccionar al menos un documento para rechazar la validación', 'Cerrar', {duration: 3000});
      return;
    }
    
    this.mostrarDialogoRechazoValidacion = true;
  }
  
  cancelarRechazoValidacion() {
    this.mostrarDialogoRechazoValidacion = false;
    this.motivoValidacionForm.reset();
  }
  
  confirmarRechazoValidacion() {
    if (this.motivoValidacionForm.invalid) {
      return;
    }
    
    this.cargando = true;
    const motivo = this.motivoValidacionForm.get('motivo')?.value;
    const documentosIds = this.selection.selected.map(doc => doc.id);
    
    this.portafirmasService.rechazarValidacion(documentosIds, motivo).subscribe({
      next: () => {
        this.cargando = false;
        this.mostrarDialogoRechazoValidacion = false;
        this.snackBar.open('Validación rechazada correctamente', 'Cerrar', {duration: 3000});
        this.selection.clear();
        this.motivoValidacionForm.reset();
        
        // Cambiar directo a histórico sin intentar recargar la pestaña actual
        this.cambiarPestana('historico');
      },
      error: (error) => {
        this.cargando = false;
        console.error('Error al rechazar validación:', error);
        this.snackBar.open('Error al rechazar validación', 'Cerrar', {duration: 3000});
      }
    });
  }
  
  // OTRAS ACCIONES
  descargarDocumento(documento: DocumentoFirma) {
    this.portafirmasService.descargarDocumento(documento.id).subscribe();
  }
  
  verDetallesDocumento(documento: DocumentoFirma) {
    // Añadir datos extras para el dialogo
    const datosExtendidos = {
      ...documento,
      tamanio: '245 KB',
      firmantes: ['ARANDA RAMIREZ, CAROLINA', 'LÓPEZ GARCÍA, MANUEL'],
      historialCambios: [
        { fecha: new Date(), accion: 'Documento creado' },
        { fecha: new Date(Date.now() - 86400000), accion: 'Enviado a firma' }
      ]
    };
    
    this.dialog.open(DocumentoDetallesComponent, {
      width: '800px',
      data: datosExtendidos
    });
  }
  
  // NAVEGACIÓN
  volverAListadoInformes() {
    if (this.episodioId) {
      this.router.navigate(['/consulta-documentos'], { 
        queryParams: { numEpisodio: this.episodioId } 
      });
    } else {
      this.router.navigate(['/consulta-documentos']);
    }
  }
  
  // MANEJADORES DE EVENTOS HTML
  onHeaderCheckboxToggle(event: any): void {
    if (event.checked) {
      this.masterToggle();
    } else {
      this.selection.clear();
      this.docsToSign.clear();
      this.docsToReject.clear();
    }
  }
  
  onRowCheckboxToggle(event: any, row: any): void {
    if (event.checked) {
      this.selection.select(row);
      if (this.pestanaActiva === 'firmante') {
        // Por defecto, al seleccionar un documento en la pestaña firmante, marcarlo para firmar
        this.docsToSign.add(row.id);
      }
    } else {
      this.selection.deselect(row);
      this.docsToSign.delete(row.id);
      this.docsToReject.delete(row.id);
    }
  }
}