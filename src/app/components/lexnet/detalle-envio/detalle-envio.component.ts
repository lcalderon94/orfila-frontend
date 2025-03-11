// detalle-envio.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LexnetService, DetalleEnvio } from 'src/app/services/lexnet.service';

@Component({
  selector: 'app-detalle-envio',
  templateUrl: './detalle-envio.component.html',
  styleUrls: ['./detalle-envio.component.css']
})
export class DetalleEnvioComponent implements OnInit {
  envioId: string = '';
  detalleEnvio: DetalleEnvio | null = null;
  cargando: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private lexnetService: LexnetService
  ) { }

  ngOnInit(): void {
    this.envioId = this.route.snapshot.paramMap.get('id') || '';
    
    if (this.envioId) {
      this.cargarDetalleEnvio();
    } else {
      this.snackBar.open('ID de envío no válido', 'Cerrar', { duration: 3000 });
      this.volver();
    }
  }

  cargarDetalleEnvio(): void {
    this.cargando = true;
    
    this.lexnetService.getDetalleEnvio(this.envioId).subscribe({
      next: (detalle) => {
        this.detalleEnvio = detalle;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar el detalle del envío:', error);
        this.snackBar.open('Error al cargar el detalle del envío', 'Cerrar', { duration: 3000 });
        this.cargando = false;
      }
    });
  }

  verAcuse(): void {
    this.router.navigate(['/lexnet/acuse-recibo', this.envioId]);
  }

  volver(): void {
    this.router.navigate(['/lexnet/estado-envios']);
  }
}