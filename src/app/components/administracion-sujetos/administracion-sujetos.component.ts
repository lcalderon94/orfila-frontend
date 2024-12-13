// administracion-sujetos.component.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { EpisodiosService, Sujeto } from '../../services/episodio.service';

@Component({
  selector: 'app-administracion-sujetos',
  templateUrl: './administracion-sujetos.component.html',
  styleUrls: ['./administracion-sujetos.component.css']
})

export class AdministracionSujetosComponent implements OnInit {
 mostrarFiltros = false;
 dataSource: MatTableDataSource<Sujeto>;
 itemsPorPagina = 10;

 columnasVisibles = [
   'nombreIml',
   'numExpediente',
   'tipoIdentificacion', 
   'numIdentificacion',
   'nombre',
   'apellido1',
   'apellido2',
   'fechaNacimiento',
   'opciones'
 ];

 filtros = {
   numExpediente: '',
   numIdentificacion: '',
   nombre: '',
   apellido1: '',
   apellido2: '',
   soloIndocumentados: false,
   soloMiIml: true
 };

 mockData: Sujeto[] = [
   {
     nombreIml: 'IML y CCFF de Ciudad Real y Toledo',
     numExpediente: 'EX2013555',
     tipoIdentificacion: 'NIF',
     numIdentificacion: '51928493J',
     nombre: 'Santiaga',
     apellido1: 'Ruano',
     apellido2: '',
     unificado: false
   },
   {
     nombreIml: 'IML y CCFF de Ciudad Real y Toledo', 
     numExpediente: 'EX2013549',
     tipoIdentificacion: 'DNI',
     numIdentificacion: '51928493J',
     nombre: 'Santiaga',
     apellido1: 'López',
     apellido2: '',
     fechaNacimiento: new Date('1978-09-03'),
     unificado: false
   }
 ];

 @ViewChild(MatPaginator) paginator!: MatPaginator;
 @ViewChild(MatSort) sort!: MatSort;

 constructor(
  private snackBar: MatSnackBar,
  private route: ActivatedRoute,
  private episodiosService: EpisodiosService
) {
  this.dataSource = new MatTableDataSource(this.mockData);
}

ngOnInit() {
  this.route.queryParams.subscribe((params: { [key: string]: string }) => {
    const episodioId = params['episodio'];
    if (episodioId) {
      // Si venimos desde un episodio específico, mostrar solo sus sujetos
      this.episodiosService.getSujetosEpisodio(episodioId).subscribe(
        (sujetos: Sujeto[]) => {
          this.dataSource.data = sujetos;
        }
      );
    } else {
      // Si no hay episodio específico, mostrar todos los sujetos como antes
      this.cargarDatos();
    }
  });
}

 ngAfterViewInit() {
   this.dataSource.paginator = this.paginator;
   this.dataSource.sort = this.sort;

   // Configurar filtrado personalizado
   this.dataSource.filterPredicate = (data: Sujeto, filter: string) => {
     const searchTerms = JSON.parse(filter);
     
     let cumpleFiltros = true;
     
     // Filtrar por texto
     if (searchTerms.numExpediente && !data.numExpediente.toLowerCase().includes(searchTerms.numExpediente.toLowerCase())) {
       cumpleFiltros = false;
     }
     if (searchTerms.numIdentificacion && !data.numIdentificacion.toLowerCase().includes(searchTerms.numIdentificacion.toLowerCase())) {
       cumpleFiltros = false;
     }
     if (searchTerms.nombre && !data.nombre.toLowerCase().includes(searchTerms.nombre.toLowerCase())) {
       cumpleFiltros = false;
     }
     if (searchTerms.apellido1 && !data.apellido1.toLowerCase().includes(searchTerms.apellido1.toLowerCase())) {
       cumpleFiltros = false;
     }
     if (searchTerms.apellido2 && !data.apellido2.toLowerCase().includes(searchTerms.apellido2.toLowerCase())) {
       cumpleFiltros = false;
     }

     // Filtros especiales
     if (searchTerms.soloIndocumentados && data.tipoIdentificacion !== 'INDOCUMENTADO') {
       cumpleFiltros = false;
     }
     
     // Solo mi IML se implementaría con el IML del usuario logueado

     return cumpleFiltros;
   };
 }

 toggleFiltros() {
   this.mostrarFiltros = !this.mostrarFiltros;
 }

 cargarDatos() {
   // Aquí se cargarían los datos del servicio
   this.dataSource.data = this.mockData;
 }

 aplicarFiltroBuscadores(event: Event, columna: string) {
   const filterValue = (event.target as HTMLInputElement).value;
   // Actualizar el filtro de la columna específica
   this.dataSource.filter = filterValue.trim().toLowerCase();
   
   if (this.dataSource.paginator) {
     this.dataSource.paginator.firstPage();
   }
 }

 limpiarFiltros() {
   this.filtros = {
     numExpediente: '',
     numIdentificacion: '',
     nombre: '',
     apellido1: '',
     apellido2: '',
     soloIndocumentados: false,
     soloMiIml: true
   };
   this.dataSource.filter = '';
   this.cargarDatos();
 }

 buscar() {
   const filtrosJson = JSON.stringify(this.filtros);
   this.dataSource.filter = filtrosJson;

   if (this.dataSource.paginator) {
     this.dataSource.paginator.firstPage();
   }
 }

 // Métodos de unificación
 unificarSujetos(sujetoPrincipal: Sujeto, sujetosAUnificar: Sujeto[]) {
   if (this.verificarSujetos(sujetoPrincipal, sujetosAUnificar)) {
     // Proceso de unificación
     sujetosAUnificar.forEach(sujeto => {
       sujeto.unificado = true;
     });
     
     this.snackBar.open('Sujetos unificados correctamente', 'Cerrar', {
       duration: 3000
     });
     
     this.cargarDatos();
   } else {
     this.snackBar.open('Error: Los sujetos no pueden ser unificados', 'Cerrar', {
       duration: 3000
     });
   }
 }

 verificarSujetos(principal: Sujeto, aUnificar: Sujeto[]): boolean {
   return aUnificar.every(s => 
     s.numIdentificacion === principal.numIdentificacion ||
     (s.nombre === principal.nombre && 
      s.apellido1 === principal.apellido1)
   );
 }

 // Métodos de exportación
 exportarWord() {
   this.snackBar.open('Exportando a Word...', 'Cerrar', {
     duration: 2000
   });
 }

 exportarPDF() {
   this.snackBar.open('Exportando a PDF...', 'Cerrar', {
     duration: 2000
   });
 }

 exportarExcel() {
   this.snackBar.open('Exportando a Excel...', 'Cerrar', {
     duration: 2000
   });
 }

 // Acciones de tabla
 verDetalle(sujeto: Sujeto) {
   console.log('Ver detalle del sujeto:', sujeto);
 }
}