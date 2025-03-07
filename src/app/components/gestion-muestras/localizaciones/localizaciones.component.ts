// localizaciones.component.ts
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { MuestrasService, Localizacion } from 'src/app/services/muestras.service';

@Component({
  selector: 'app-localizaciones',
  templateUrl: './localizaciones.component.html',
  styleUrls: ['./localizaciones.component.css']
})
export class LocalizacionesComponent implements OnInit, AfterViewInit {
  columnasVisibles: string[] = [
    'select',
    'tipoLocalizacion',
    'sedeCP',
    'plantaEdificio',
    'descripcionLocalizacion',
    'codigoBarras',
    'opciones'
  ];

  dataSource: MatTableDataSource<Localizacion>;
  selection = new SelectionModel<Localizacion>(true, []);
  mostrarFiltros = false;

  filtros = {
    tipoLocalizacion: 'todos',
    sedeCP: '',
    plantaEdificio: '',
    descripcionLocalizacion: '',
    codigoBarras: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private muestrasService: MuestrasService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<Localizacion>([]);
  }

  ngOnInit() {
    this.cargarDatos();
    this.configurarFiltrado();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  cargarDatos() {
    this.muestrasService.getLocalizaciones().subscribe(
      localizaciones => {
        this.dataSource.data = localizaciones;
      },
      error => {
        this.snackBar.open('Error al cargar las localizaciones', 'Cerrar', {
          duration: 3000
        });
      }
    );
  }

  configurarFiltrado() {
    this.dataSource.filterPredicate = (data: Localizacion, filter: string): boolean => {
      try {
        const searchTerms = JSON.parse(filter);
        
        // Si searchTerms está vacío, no aplicar filtro
        if (!searchTerms || Object.keys(searchTerms).length === 0) {
          return true;
        }
        
        return Object.keys(searchTerms).every(key => {
          // Obtener el valor a buscar, asegurando que sea string
          const value = searchTerms[key]?.toString().toLowerCase() || '';
          
          // Si el valor está vacío, no filtrar por este campo
          if (!value) {
            return true;
          }
          
          // Verificar si la propiedad existe en el objeto data
          if (!(key in data)) {
            return true;
          }
          
          // Obtener el valor del objeto de manera segura
          const dataValue = String(data[key as keyof Localizacion] || '').toLowerCase();
          
          return dataValue.includes(value);
        });
      } catch (error) {
        console.error('Error al filtrar:', error);
        return true; // Si hay error en el filtro, mostrar todos los datos
      }
    };
  }

  aplicarFiltros() {
    const filtrosString = JSON.stringify(this.filtros);
    this.dataSource.filter = filtrosString;
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.snackBar.open('Filtros aplicados', 'Cerrar', {
      duration: 3000
    });
  }

  limpiarFiltros() {
    this.filtros = {
      tipoLocalizacion: 'todos',
      sedeCP: '',
      plantaEdificio: '',
      descripcionLocalizacion: '',
      codigoBarras: ''
    };
    this.dataSource.filter = '';

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.snackBar.open('Filtros limpiados', 'Cerrar', {
      duration: 3000
    });
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }

  verLocalizacion(localizacion: Localizacion) {
    if (localizacion.id) {
      this.router.navigate(['/gestion-muestras/nueva-localizacion', localizacion.id]);
    }
  }

  eliminarLocalizacion(localizacion: Localizacion) {
    if (!localizacion.id) {
      return;
    }
    
    if (localizacion.tieneMuestras) {
      this.snackBar.open('No se puede eliminar la localización porque tiene muestras asociadas', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    
    if (confirm('¿Está seguro que desea eliminar esta localización?')) {
      this.muestrasService.eliminarLocalizacion(localizacion.id).subscribe(
        success => {
          if (success) {
            this.snackBar.open('Localización eliminada correctamente', 'Cerrar', {
              duration: 3000
            });
            this.cargarDatos();
          } else {
            this.snackBar.open('Error al eliminar la localización', 'Cerrar', {
              duration: 3000
            });
          }
        },
        error => {
          this.snackBar.open('Error al eliminar la localización', 'Cerrar', {
            duration: 3000
          });
        }
      );
    }
  }

  imprimirCodigo(localizacion: Localizacion) {
    const ventanaImpresion = window.open('', '_blank');
    if (ventanaImpresion) {
      // Generamos un SVG para el código de barras
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      try {
        // Asumimos que estamos usando jsbarcode
        // @ts-ignore
        JsBarcode(svg, localizacion.codigoBarras, {
          format: "CODE39",
          width: 2,
          height: 100,
          displayValue: true,
          text: localizacion.codigoBarras,
          fontSize: 20,
          margin: 10,
          background: "#ffffff"
        });

        ventanaImpresion.document.write(`
          <html>
            <head>
              <title>Imprimir Código de Barras</title>
              <style>
                body {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  margin: 0;
                  font-family: Arial, sans-serif;
                }
                .codigo-container {
                  text-align: center;
                  padding: 20px;
                  border: 1px solid #ccc;
                  border-radius: 5px;
                }
                .descripcion {
                  margin-top: 20px;
                  font-size: 16px;
                  max-width: 300px;
                  word-wrap: break-word;
                }
              </style>
            </head>
            <body>
              <div class="codigo-container">
                ${svg.outerHTML}
                <div class="descripcion">
                  ${localizacion.descripcionLocalizacion || 'Sin descripción'}
                </div>
              </div>
            </body>
          </html>
        `);
        ventanaImpresion.document.close();
        setTimeout(() => {
          ventanaImpresion.print();
        }, 500);
      } catch (error) {
        console.error('Error al generar el código de barras:', error);
        this.snackBar.open('Error al generar el código de barras', 'Cerrar', {
          duration: 3000
        });
      }
    }
  }

  insertarMuestra(localizacion: Localizacion) {
    if (localizacion.id) {
      if (localizacion.tipoLocalizacion === 'local') {
        this.router.navigate(['/gestion-muestras/registro-muestras', localizacion.id]);
      } else {
        this.router.navigate(['/gestion-muestras/salida-muestra', localizacion.id]);
      }
    }
  }

  verMuestras(localizacion: Localizacion) {
    if (localizacion.id) {
      this.router.navigate(['/gestion-muestras/muestras-list'], { 
        queryParams: { 
          localizacionId: localizacion.id,
          tipoRegistro: 'ultimo'
        } 
      });
    }
  }

  imprimirEtiquetas() {
    if (this.selection.selected.length === 0) {
      this.snackBar.open('Debe seleccionar al menos una localización', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    // En una implementación real, esto llamaría a un servicio de impresión
    this.snackBar.open(`Imprimiendo ${this.selection.selected.length} etiqueta(s)...`, 'Cerrar', {
      duration: 3000
    });
  }

  imprimirListado() {
    if (this.selection.selected.length === 0) {
      this.snackBar.open('Debe seleccionar al menos una localización', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    // En una implementación real, esto generaría un listado para imprimir
    this.snackBar.open(`Generando listado de ${this.selection.selected.length} localización(es)...`, 'Cerrar', {
      duration: 3000
    });
  }

  crearNuevaLocalizacion() {
    this.router.navigate(['/gestion-muestras/nueva-localizacion']);
  }

  exportarExcel() {
    this.snackBar.open('Exportando a Excel...', 'Cerrar', {
      duration: 3000
    });
  }

  exportarPDF() {
    this.snackBar.open('Exportando a PDF...', 'Cerrar', {
      duration: 3000
    });
  }

  exportarWord() {
    this.snackBar.open('Exportando a Word...', 'Cerrar', {
      duration: 3000
    });
  }
}