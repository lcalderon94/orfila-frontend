// portafirmas-documentos.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { PortafirmasService } from '../../../services/portafirmas.service';
import { DocumentoFirma } from '../../../mock-data/portafirmas.mock';

@Component({
  selector: 'app-portafirmas-documentos',
  templateUrl: './portafirmas-documentos.component.html',
  styleUrls: ['./portafirmas-documentos.component.css']
})
export class PortafirmasDocumentosComponent implements OnInit {
  @Input() documentos: DocumentoFirma[] = [];
  @Input() documentoIdSeleccionado: string | null = null;
  @Input() episodioId: string | null = null;
  
  dataSource: MatTableDataSource<DocumentoFirma>;
  selection = new SelectionModel<DocumentoFirma>(true, []);
  motivoForm: FormGroup;
  mostrarDialogoRechazo = false;
  cargando = false;
  
  // Nuevas propiedades para controlar los estados de marcación
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
    private portafirmasService: PortafirmasService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.dataSource = new MatTableDataSource<DocumentoFirma>([]);
    this.motivoForm = this.fb.group({
      motivo: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    this.dataSource.data = this.documentos;
    
    // Si hay un documento específico seleccionado, lo marcamos para firmar por defecto
    if (this.documentoIdSeleccionado) {
      const documento = this.documentos.find(d => d.id === this.documentoIdSeleccionado);
      if (documento) {
        this.selection.select(documento);
        this.markedForSign.add(documento.id);
      }
    }
  }
  
  ngOnChanges() {
    if (this.documentos) {
      this.dataSource.data = this.documentos;
    }
  }

  // Método para marcar un documento para firmar
  markForSign(event: MatCheckboxChange, row: DocumentoFirma): void {
    if (event.checked) {
      // Si se marca para firmar, aseguramos que no esté marcado para rechazar
      this.markedForReject.delete(row.id);
      this.markedForSign.add(row.id);
      this.selection.select(row);
    } else {
      this.markedForSign.delete(row.id);
      // Solo deseleccionamos si no está marcado para ninguna acción
      if (!this.markedForReject.has(row.id)) {
        this.selection.deselect(row);
      }
    }
  }

  // Método para marcar un documento para rechazar
  markForReject(event: MatCheckboxChange, row: DocumentoFirma): void {
    if (event.checked) {
      // Si se marca para rechazar, aseguramos que no esté marcado para firmar
      this.markedForSign.delete(row.id);
      this.markedForReject.add(row.id);
      this.selection.select(row);
    } else {
      this.markedForReject.delete(row.id);
      // Solo deseleccionamos si no está marcado para ninguna acción
      if (!this.markedForSign.has(row.id)) {
        this.selection.deselect(row);
      }
    }
  }

  // Métodos de selección
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows && numRows > 0;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.markedForSign.clear();
      this.markedForReject.clear();
      return;
    }
    
    // Por defecto, marcar todos para firmar
    this.dataSource.data.forEach(row => {
      this.selection.select(row);
      this.markedForSign.add(row.id);
      this.markedForReject.delete(row.id);
    });
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
  
  // Métodos de acción
  firmarSeleccionados() {
    // Obtener solo los documentos marcados para firmar
    const docsToSign = this.selection.selected.filter(doc => 
      this.markedForSign.has(doc.id)
    );
    
    if (docsToSign.length === 0) {
      this.snackBar.open('Debe marcar al menos un documento para firmar', 'Cerrar', {duration: 3000});
      return;
    }
    
    this.cargando = true;
    
    // Recolectar los IDs
    const idsSeleccionados = docsToSign.map(doc => doc.id);
    
    // Llamar al servicio
    this.portafirmasService.firmarDocumentos(idsSeleccionados).subscribe({
      next: () => {
        this.snackBar.open('Documentos firmados correctamente', 'Cerrar', {duration: 3000});
        this.snackBar.open('Actualice la página para ver los cambios', 'Cerrar', {duration: 5000});
        this.selection.clear();
        this.markedForSign.clear();
        this.markedForReject.clear();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al firmar documentos:', error);
        this.snackBar.open('Error al firmar documentos', 'Cerrar', {duration: 3000});
        this.cargando = false;
      }
    });
  }
  
  abrirDialogoRechazo() {
    // Obtener solo los documentos marcados para rechazar
    const docsToReject = this.selection.selected.filter(doc => 
      this.markedForReject.has(doc.id)
    );
    
    if (docsToReject.length === 0) {
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
    
    // Obtener solo los documentos marcados para rechazar
    const docsToReject = this.selection.selected.filter(doc => 
      this.markedForReject.has(doc.id)
    );
    
    // Recolectar los IDs
    const idsSeleccionados = docsToReject.map(doc => doc.id);
    
    // Llamar al servicio
    this.portafirmasService.rechazarDocumentos(idsSeleccionados, motivo).subscribe({
      next: () => {
        this.mostrarDialogoRechazo = false;
        this.snackBar.open('Documentos rechazados correctamente', 'Cerrar', {duration: 3000});
        this.selection.clear();
        this.markedForSign.clear();
        this.markedForReject.clear();
        this.motivoForm.reset();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al rechazar documentos:', error);
        this.snackBar.open('Error al rechazar documentos', 'Cerrar', {duration: 3000});
        this.cargando = false;
      }
    });
  }
  
  descargarDocumento(documento: DocumentoFirma) {
    this.snackBar.open(`Descargando documento: ${documento.titulo}`, 'Cerrar', {duration: 2000});
    
    this.portafirmasService.descargarDocumento(documento.id).subscribe({
      error: (error) => {
        console.error('Error al descargar documento:', error);
        this.snackBar.open('Error al descargar el documento', 'Cerrar', {duration: 3000});
      }
    });
  }

  // Añadir estos métodos de ayuda para usar en el HTML
isMarkedForSign(docId: string): boolean {
  return this.markedForSign.has(docId);
}

isMarkedForReject(docId: string): boolean {
  return this.markedForReject.has(docId);
}

hasDocsToSign(): boolean {
  return this.selection.selected.some(doc => this.markedForSign.has(doc.id));
}

hasDocsToReject(): boolean {
  return this.selection.selected.some(doc => this.markedForReject.has(doc.id));
}
  
}