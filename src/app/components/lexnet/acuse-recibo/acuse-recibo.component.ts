// acuse-recibo.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LexnetService } from '../../../services/lexnet.service';

@Component({
  selector: 'app-acuse-recibo',
  templateUrl: './acuse-recibo.component.html',
  styleUrls: ['./acuse-recibo.component.css']
})
export class AcuseReciboComponent implements OnInit {
  envioId: string = '';
  acuseRecibo: any = null;
  cargando: boolean = true;
  logoMinisterioUrl: string = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Logotipo_del_Ministerio_de_Justicia.svg/2560px-Logotipo_del_Ministerio_de_Justicia.svg.png';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private lexnetService: LexnetService
  ) { }

  ngOnInit(): void {
    this.envioId = this.route.snapshot.paramMap.get('id') || '';
    
    if (this.envioId) {
      this.cargarAcuseRecibo();
    } else {
      this.snackBar.open('ID de envío no válido', 'Cerrar', { duration: 3000 });
      this.volver();
    }
  }

  cargarAcuseRecibo(): void {
    this.cargando = true;
    
    this.lexnetService.getAcuseRecibo(this.envioId).subscribe({
      next: (acuse) => {
        this.acuseRecibo = acuse;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar el acuse de recibo:', error);
        this.snackBar.open('Error al cargar el acuse de recibo', 'Cerrar', { duration: 3000 });
        this.cargando = false;
      }
    });
  }

  imprimirAcuse(): void {
    window.print();
  }

  volver(): void {
    this.router.navigate(['/lexnet/estado-envios']);
  }
}