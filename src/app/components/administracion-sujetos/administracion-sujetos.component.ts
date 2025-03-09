// src/app/components/administracion-sujetos/administracion-sujetos.component.ts

import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { EpisodiosService, Sujeto } from '../../services/episodio.service';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DetalleSujetoDialogComponent } from './detalle-sujeto-dialog/detalle-sujeto-dialog.component';


@Component({
  selector: 'app-administracion-sujetos',
  templateUrl: './administracion-sujetos.component.html',
  styleUrls: ['./administracion-sujetos.component.css']
})
export class AdministracionSujetosComponent implements OnInit, AfterViewInit {
  mostrarFiltros = false;
  dataSource = new MatTableDataSource<Sujeto>([]);
  itemsPorPagina = 10;
  sujetoPrincipal: Sujeto | null = null;
  sujetosAUnificar: Sujeto[] = [];
  todosSujetos: Sujeto[] = [];

  columnasVisibles = [
    'seleccionPrincipal',
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('dialogoConfirmacion') dialogoConfirmacion!: TemplateRef<any>;

  constructor(
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private episodiosService: EpisodiosService,
    private dialog: MatDialog
  ) {}

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
        // Si no hay episodio específico, cargar todos los sujetos
        this.cargarDatos();
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Configurar filtrado personalizado
    // Configurar filtrado personalizado
this.dataSource.filterPredicate = (data: Sujeto, filter: string): boolean => {
  try {
    const searchTerms = JSON.parse(filter);
    
    let cumpleFiltros = true;
    
    // Filtrar por texto - verificamos que todas las propiedades existan
    if (searchTerms.numExpediente && data.numExpediente && 
        !data.numExpediente.toLowerCase().includes(searchTerms.numExpediente.toLowerCase())) {
      cumpleFiltros = false;
    }
    if (searchTerms.numIdentificacion && data.numIdentificacion && 
        !data.numIdentificacion.toLowerCase().includes(searchTerms.numIdentificacion.toLowerCase())) {
      cumpleFiltros = false;
    }
    if (searchTerms.nombre && data.nombre && 
        !data.nombre.toLowerCase().includes(searchTerms.nombre.toLowerCase())) {
      cumpleFiltros = false;
    }
    if (searchTerms.apellido1 && data.apellido1 && 
        !data.apellido1.toLowerCase().includes(searchTerms.apellido1.toLowerCase())) {
      cumpleFiltros = false;
    }
    if (searchTerms.apellido2 && data.apellido2 && 
        !data.apellido2.toLowerCase().includes(searchTerms.apellido2.toLowerCase())) {
      cumpleFiltros = false;
    }

    // Filtros especiales
    if (searchTerms.soloIndocumentados && data.tipoIdentificacion !== 'INDOCUMENTADO') {
      cumpleFiltros = false;
    }
    
    return cumpleFiltros;
  } catch {
    // Si no es JSON, es un filtro simple de texto
    const searchText = filter.toLowerCase();
    
    // Nos aseguramos de que los valores existan antes de llamar a includes()
    const numExpedienteMatch = data.numExpediente ? 
                              data.numExpediente.toLowerCase().includes(searchText) : false;
    const numIdentificacionMatch = data.numIdentificacion ? 
                                  data.numIdentificacion.toLowerCase().includes(searchText) : false;
    const nombreMatch = data.nombre ? 
                        data.nombre.toLowerCase().includes(searchText) : false;
    const apellido1Match = data.apellido1 ? 
                          data.apellido1.toLowerCase().includes(searchText) : false;
    const apellido2Match = data.apellido2 ? 
                          data.apellido2.toLowerCase().includes(searchText) : false;
    
    return numExpedienteMatch || numIdentificacionMatch || 
           nombreMatch || apellido1Match || apellido2Match;
  }
};
  }

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  cargarDatos() {
    // Obtenemos todos los episodios
    this.episodiosService.getEpisodios().subscribe(episodios => {
      // Creamos un array de Observables para obtener los sujetos de cada episodio
      const observablesDeSujetos = episodios.map(episodio => 
        this.episodiosService.getSujetosEpisodio(episodio.nEpisodio)
      );
      
      // Combinamos todos los resultados
      forkJoin(observablesDeSujetos).subscribe(resultadosSujetos => {
        // Aplanamos el array de arrays de sujetos
        this.todosSujetos = resultadosSujetos.flat();
        
        // Eliminamos duplicados basados en numExpediente
        const sujetosUnicos = this.todosSujetos.filter((sujeto, index, self) =>
          index === self.findIndex(s => s.numExpediente === sujeto.numExpediente)
        );
        
        this.dataSource.data = sujetosUnicos;
      });
    });
  }

  aplicarFiltroBuscadores(event: Event, columna: string) {
    const filterValue = (event.target as HTMLInputElement).value;
    
    // Aplicamos un filtro simple de texto
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

  // Métodos para selección de sujetos
  seleccionarSujetoPrincipal(sujeto: Sujeto) {
    this.sujetoPrincipal = sujeto;
  }

  quitarSujetoPrincipal() {
    this.sujetoPrincipal = null;
  }

  toggleSujetoUnificar(sujeto: Sujeto) {
    const index = this.sujetosAUnificar.findIndex(s => s.numExpediente === sujeto.numExpediente);
    if (index !== -1) {
      this.sujetosAUnificar.splice(index, 1);
    } else {
      this.sujetosAUnificar.push(sujeto);
    }
  }

  agregarSujetoUnificacion(sujeto: Sujeto) {
    // Verificar si el sujeto está unificado
    if (sujeto.unificado) {
      this.snackBar.open('No se pueden unificar sujetos que ya han sido unificados previamente', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    
    // Verificar si el sujeto ya está seleccionado como principal o a unificar
    if (this.sujetoPrincipal && this.sujetoPrincipal.numExpediente === sujeto.numExpediente) {
      this.snackBar.open('Este sujeto ya está seleccionado como principal', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    
    if (this.sujetosAUnificar.some(s => s.numExpediente === sujeto.numExpediente)) {
      this.snackBar.open('Este sujeto ya está seleccionado para unificar', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    
    // Si no hay principal seleccionado, este se convierte en principal
    if (!this.sujetoPrincipal) {
      this.sujetoPrincipal = sujeto;
      this.snackBar.open('Sujeto seleccionado como principal', 'Cerrar', {
        duration: 2000
      });
    } else {
      // Si ya hay principal, este se añade a unificar
      this.sujetosAUnificar.push(sujeto);
      this.snackBar.open('Sujeto añadido a la lista de unificación', 'Cerrar', {
        duration: 2000
      });
    }
  }
  
  quitarSujetoUnificar(sujeto: Sujeto) {
    const index = this.sujetosAUnificar.findIndex(s => s.numExpediente === sujeto.numExpediente);
    if (index !== -1) {
      this.sujetosAUnificar.splice(index, 1);
    }
  }
  
  limpiarSeleccionUnificacion() {
    this.sujetoPrincipal = null;
    this.sujetosAUnificar = [];
  }
  
  // Inicio del proceso de unificación
  iniciarUnificacion() {
    if (!this.sujetoPrincipal) {
      this.snackBar.open('Debe seleccionar un sujeto principal', 'Cerrar', {
        duration: 3000
      });
      return;
    }
  
    if (this.sujetosAUnificar.length === 0) {
      this.snackBar.open('Debe seleccionar al menos un sujeto para unificar', 'Cerrar', {
        duration: 3000
      });
      return;
    }
  
    // Mostrar diálogo de confirmación
    const dialogRef = this.dialog.open(this.dialogoConfirmacion);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.unificarSujetos();
      }
    });
  }
  
  unificarSujetos() {
    if (!this.sujetoPrincipal || this.sujetosAUnificar.length === 0) {
      return;
    }
  
    if (this.verificarSujetos(this.sujetoPrincipal, this.sujetosAUnificar)) {
      // En un entorno real, llamaríamos al servicio para realizar la unificación en el backend
      // Simulamos la unificación en frontend
      this.sujetosAUnificar.forEach(sujeto => {
        const index = this.dataSource.data.findIndex(s => s.numExpediente === sujeto.numExpediente);
        if (index !== -1) {
          this.dataSource.data[index].unificado = true;
        }
      });
      
      // Actualizamos el dataSource para reflejar los cambios
      this.dataSource._updateChangeSubscription();
      
      this.snackBar.open('Sujetos unificados correctamente', 'Cerrar', {
        duration: 3000
      });
      
      // Limpiamos la selección
      this.limpiarSeleccionUnificacion();
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
  
  verDetalle(sujeto: Sujeto) {
    this.dialog.open(DetalleSujetoDialogComponent, {
      width: '700px',
      data: { sujeto: sujeto }
    });
  }
}