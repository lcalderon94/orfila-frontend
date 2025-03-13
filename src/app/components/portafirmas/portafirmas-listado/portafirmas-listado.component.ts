import { Component, OnInit, Input, Output, EventEmitter, Inject, Optional } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { PortafirmasService } from 'src/app/services/portafirmas.service';
import { DocumentoFirma } from 'src/app/mock-data/portafirmas.mock';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-portafirmas-listado',
  templateUrl: './portafirmas-listado.component.html',
  styleUrls: ['./portafirmas-listado.component.css']
})
export class PortafirmasListadoComponent implements OnInit {
  @Input() documentoId: string | null = null;
  @Input() episodioId: string | null = null;
  @Output() cerrarPortafirmas = new EventEmitter<void>();

  itemsPorPagina = 10;
  dataSource: MatTableDataSource<DocumentoFirma>;
  selection = new SelectionModel<DocumentoFirma>(true, []);
  pestanaActiva = 'firmante';
  cargando = false;
  motivoForm: FormGroup;
  mostrarDialogoRechazo = false;

  // Nuevas propiedades para controlar documentos marcados para firmar o rechazar
  markedForSign: Set<string> = new Set();
  markedForReject: Set<string> = new Set();

  columnasVisibles = [
    'select',
    'aplicacion',
    'titulo',
    'tramitador',
    'estado',
    'progreso',
    'fechaAlta',
    'mark',
    'done',
    'acciones'
  ];

  constructor(
    @Optional() public dialogRef: MatDialogRef<PortafirmasListadoComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private portafirmasService: PortafirmasService,
    private snackBar: MatSnackBar,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.dataSource = new MatTableDataSource<DocumentoFirma>([]);
    this.motivoForm = this.fb.group({
      motivo: ['', [Validators.required, Validators.minLength(10)]]
    });

    // Si venimos de un diálogo, obtenemos los datos
    if (this.data) {
      this.documentoId = this.data.documentoId;
      this.episodioId = this.data.episodioId;
    }
  }

  ngOnInit() {
    this.cargarDocumentos();
  }

  cargarDocumentos() {
    this.cargando = true;
    // Limpiamos las marcas al cargar nuevos documentos
    this.markedForSign.clear();
    this.markedForReject.clear();

    this.portafirmasService.getDocumentosPendientes().subscribe({
      next: (documentos: DocumentoFirma[]) => {
        this.dataSource.data = documentos;
        this.cargando = false;

        // Si venimos con un documentoId específico, lo seleccionamos
        if (this.documentoId) {
          const documento = documentos.find((d: DocumentoFirma) => d.id === this.documentoId);
          if (documento) {
            this.selection.select(documento);
            // Por defecto lo marcamos para firmar
            this.markedForSign.add(documento.id);
          }
        }
      },
      error: (err: Error) => {
        console.error('Error al cargar documentos:', err);
        this.snackBar.open('Error al cargar documentos', 'Cerrar', { duration: 3000 });
        this.cargando = false;
      }
    });
  }

  markForSign(row: DocumentoFirma): void {
    this.markedForSign.add(row.id);
    this.markedForReject.delete(row.id);
    this.selection.select(row);
  }
  
  unmarkForSign(row: DocumentoFirma): void {
    this.markedForSign.delete(row.id);
    this.selection.deselect(row);
  }
  
  markForReject(row: DocumentoFirma): void {
    this.markedForReject.add(row.id);
    this.markedForSign.delete(row.id);
    this.selection.select(row);
  }
  
  unmarkForReject(row: DocumentoFirma): void {
    this.markedForReject.delete(row.id);
    this.selection.deselect(row);
  }
  
  // Métodos para comprobar el estado
  isMarkedForSign(docId: string): boolean {
    return this.markedForSign.has(docId);
  }
  
  isMarkedForReject(docId: string): boolean {
    return this.markedForReject.has(docId);
  }
  
  // Método para comprobar si hay documentos marcados para firmar
  hasDocsToSign(): boolean {
    return this.markedForSign.size > 0;
  }
  
  // Método para comprobar si hay documentos marcados para rechazar
  hasDocsToReject(): boolean {
    return this.markedForReject.size > 0;
  }

  // Actualizar el estado de selección y botones
  updateButtonState(): void {
    // No necesitamos hacer nada más aquí, la lógica está en los templates con binding
  }

  cerrarDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else {
      this.cerrarPortafirmas.emit();
    }
  }

  volverListadoInformes(): void {
    if (this.dialogRef) {
      this.dialogRef.close({ volverAListado: true });
    } else if (this.episodioId) {
      this.router.navigate(['/consulta-documentos'], {
        queryParams: { numEpisodio: this.episodioId }
      });
    } else {
      this.router.navigate(['/consulta-documentos']);
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      // Deseleccionar todo
      this.selection.clear();
      this.markedForSign.clear();
      this.markedForReject.clear();
    } else {
      // Marcar todos para firmar
      this.dataSource.data.forEach(row => {
        this.selection.select(row);
        this.markedForSign.add(row.id);
      });
    }
  }

  // Manejadores para checkboxes de selección principal
  onHeaderCheckboxToggle(event: MatCheckboxChange): void {
    if (event.checked) {
      this.masterToggle();
    } else {
      this.selection.clear();
      this.markedForSign.clear();
      this.markedForReject.clear();
    }
  }

  onRowCheckboxToggle(event: MatCheckboxChange, row: DocumentoFirma): void {
    if (event.checked) {
      this.selection.select(row);
      // Por defecto, al seleccionar un documento lo marcamos para firmar
      // a menos que ya esté marcado para rechazar
      if (!this.markedForReject.has(row.id)) {
        this.markedForSign.add(row.id);
      }
    } else {
      this.selection.deselect(row);
      this.markedForSign.delete(row.id);
      this.markedForReject.delete(row.id);
    }
  }

  checkboxLabel(row?: DocumentoFirma): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deseleccionar' : 'seleccionar'} todo`;
    }
    return `${this.selection.isSelected(row) ? 'deseleccionar' : 'seleccionar'} fila`;
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  firmarSeleccionados() {
    if (this.markedForSign.size === 0) {
      this.snackBar.open('Debe marcar al menos un documento para firmar', 'Cerrar', {duration: 3000});
      return;
    }
    
    this.cargando = true;
    
    // Obtenemos solo los IDs de los documentos marcados para firmar
    const docsToSign = this.dataSource.data.filter(doc => this.markedForSign.has(doc.id));
    const idsSeleccionados = docsToSign.map(doc => doc.id);
    
    this.portafirmasService.firmarDocumentos(idsSeleccionados).subscribe({
      next: (respuesta) => {
        this.cargando = false;
        this.snackBar.open('Documentos firmados correctamente', 'Cerrar', {duration: 3000});
        this.snackBar.open('Actualice la página de Orfila para ver los cambios', 'Cerrar', {duration: 5000});
        this.selection.clear();
        this.markedForSign.clear();
        this.markedForReject.clear();
        this.cargarDocumentos();
      },
      error: (error) => {
        this.cargando = false;
        this.snackBar.open('Error al firmar los documentos', 'Cerrar', {duration: 3000});
        console.error('Error al firmar:', error);
      }
    });
  }

  abrirDialogoRechazo() {
    if (this.markedForReject.size === 0) {
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
    
    const motivo = this.motivoForm.get('motivo')?.value;
    this.cargando = true;
    
    // Obtenemos solo los IDs de los documentos marcados para rechazar
    const docsToReject = this.dataSource.data.filter(doc => this.markedForReject.has(doc.id));
    const idsSeleccionados = docsToReject.map(doc => doc.id);
    
    this.portafirmasService.rechazarDocumentos(idsSeleccionados, motivo).subscribe({
      next: (respuesta) => {
        this.cargando = false;
        this.mostrarDialogoRechazo = false;
        this.snackBar.open('Documentos rechazados correctamente', 'Cerrar', {duration: 3000});
        this.selection.clear();
        this.markedForSign.clear();
        this.markedForReject.clear();
        this.motivoForm.reset();
        this.cargarDocumentos();
      },
      error: (error) => {
        this.cargando = false;
        this.snackBar.open('Error al rechazar los documentos', 'Cerrar', {duration: 3000});
        console.error('Error al rechazar:', error);
      }
    });
  }

  cambiarPestana(pestana: string) {
    this.pestanaActiva = pestana;
    // Limpiamos las selecciones al cambiar de pestaña
    this.selection.clear();
    this.markedForSign.clear();
    this.markedForReject.clear();
  }

  
}