// src/app/components/documento-detalles/documento-detalles.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-documento-detalles',
  templateUrl: './documento-detalles.component.html',
  styleUrls: ['./documento-detalles.component.css']
})
export class DocumentoDetallesComponent {
  constructor(
    public dialogRef: MatDialogRef<DocumentoDetallesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  cerrarDialog(): void {
    this.dialogRef.close();
  }
}