// localizaciones.component.ts
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { MuestrasService, Localizacion } from '../../../services/muestras.service';

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
    tipoLocalizacion: 'todas',
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
    const filtros = {
      tipoLocalizacion: this.filtros.tipoLocalizacion !== 'todas' ? this.filtros.tipoLocalizacion : null,
      sedeCP: this.filtros.sedeCP,
      plantaEdificio: this.filtros.plantaEdificio,
      descripcionLocalizacion: this.filtros.descripcionLocalizacion,
      codigoBarras: this.filtros.codigoBarras
    };
    
    this.muestrasService.getLocalizaciones(filtros).subscribe(
      localizaciones => {
        this.dataSource.data = localizaciones;
        this.snackBar.open('Datos cargados correctamente', 'Cerrar', {
          duration: 2000
        });
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
        
        // Filtrar por tipo de localización
        if (searchTerms.tipoLocalizacion && searchTerms.tipoLocalizacion !== 'todas') {
          if (data.tipoLocalizacion !== searchTerms.tipoLocalizacion) {
            return false;
          }
        }
        
        // Filtrar por otros campos con verificación estricta de tipos
        let matchSedeCP = true;
        if (searchTerms.sedeCP && searchTerms.sedeCP.trim() !== '') {
          matchSedeCP = Boolean(data.sedeCP && data.sedeCP.toLowerCase().includes(searchTerms.sedeCP.toLowerCase()));
        }
        
        let matchPlanta = true;
        if (searchTerms.plantaEdificio && searchTerms.plantaEdificio.trim() !== '') {
          matchPlanta = Boolean(data.plantaEdificio && data.plantaEdificio.toLowerCase().includes(searchTerms.plantaEdificio.toLowerCase()));
        }
        
        let matchDescripcion = true;
        if (searchTerms.descripcionLocalizacion && searchTerms.descripcionLocalizacion.trim() !== '') {
          matchDescripcion = Boolean(data.descripcionLocalizacion && 
            data.descripcionLocalizacion.toLowerCase().includes(searchTerms.descripcionLocalizacion.toLowerCase()));
        }
        
        let matchCodigo = true;
        if (searchTerms.codigoBarras && searchTerms.codigoBarras.trim() !== '') {
          matchCodigo = Boolean(data.codigoBarras && 
            data.codigoBarras.toLowerCase().includes(searchTerms.codigoBarras.toLowerCase()));
        }
        
        return matchSedeCP && matchPlanta && matchDescripcion && matchCodigo;
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
      tipoLocalizacion: 'todas',
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

  // Función corregida: Ver localización redirige al componente de edición
  verLocalizacion(localizacion: Localizacion) {
    if (localizacion.id) {
      // Redireccionar a la página de edición de la localización
      this.router.navigate(['/gestion-muestras/nueva-localizacion', localizacion.id]);
    } else {
      this.snackBar.open('Error: No se puede editar la localización sin ID', 'Cerrar', {
        duration: 3000
      });
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
        // @ts-ignore - Asumiendo que JsBarcode está disponible globalmente
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

  // Función corregida: Insertar muestra redirige a registro-muestras o salida-muestra
  insertarMuestra(localizacion: Localizacion) {
    if (localizacion.id) {
      if (localizacion.tipoLocalizacion === 'local') {
        // Redireccionar a registro-muestras con ID de localización
        this.router.navigate(['/gestion-muestras/registro-muestras', localizacion.id]);
      } else {
        // Redireccionar a salida-muestra con ID de localización
        this.router.navigate(['/gestion-muestras/salida-muestra', localizacion.id]);
      }
    } else {
      this.snackBar.open('Error: No se puede insertar muestra en localización sin ID', 'Cerrar', {
        duration: 3000
      });
    }
  }

  // En localizaciones.component.ts - función verMuestras
verMuestras(localizacion: Localizacion) {
  if (localizacion.id) {
    this.router.navigate(['/gestion-muestras/muestras-list'], { 
      queryParams: { 
        codigoBarrasLocalizacion: localizacion.codigoBarras,
        descripcionLocalizacion: localizacion.descripcionLocalizacion, // Añadir la descripción
        tipoRegistro: 'ultimo'
      } 
    });
  } else {
    this.snackBar.open('Error: No se puede ver muestras de localización sin ID', 'Cerrar', {
      duration: 3000
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

    // Generar vista previa de impresión con 3 etiquetas por línea como indica el manual
    const ventanaImpresion = window.open('', '_blank');
    if (ventanaImpresion) {
      ventanaImpresion.document.write(`
        <html>
          <head>
            <title>Imprimir Etiquetas</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
              }
              .etiquetas-container {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
                justify-content: flex-start;
              }
              .etiqueta {
                border: 1px solid #ccc;
                padding: 15px;
                border-radius: 5px;
                width: 30%;
                text-align: center;
                margin-bottom: 20px;
              }
              .codigo-barras {
                margin-bottom: 10px;
              }
              .descripcion {
                font-size: 12px;
                word-wrap: break-word;
              }
            </style>
          </head>
          <body>
            <h1>Etiquetas de Localizaciones</h1>
            <div class="etiquetas-container">
      `);

      // Generar etiquetas para cada localización seleccionada
      this.selection.selected.forEach(loc => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        try {
          // @ts-ignore
          JsBarcode(svg, loc.codigoBarras, {
            format: "CODE39",
            width: 1.5,
            height: 70,
            displayValue: true,
            text: loc.codigoBarras,
            fontSize: 12,
            margin: 5,
            background: "#ffffff"
          });

          ventanaImpresion.document.write(`
            <div class="etiqueta">
              <div class="codigo-barras">${svg.outerHTML}</div>
              <div class="descripcion">${loc.descripcionLocalizacion}</div>
            </div>
          `);
        } catch (error) {
          console.error('Error al generar el código de barras:', error);
        }
      });

      ventanaImpresion.document.write(`
            </div>
          </body>
        </html>
      `);
      ventanaImpresion.document.close();
      setTimeout(() => {
        ventanaImpresion.print();
      }, 500);
    }
  }

  imprimirListado() {
    if (this.selection.selected.length === 0) {
      this.snackBar.open('Debe seleccionar al menos una localización', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    // Generar vista previa de impresión del listado
    const ventanaImpresion = window.open('', '_blank');
    if (ventanaImpresion) {
      ventanaImpresion.document.write(`
        <html>
          <head>
            <title>Listado de Localizaciones</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
              }
              h1 {
                text-align: center;
                margin-bottom: 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f2f2f2;
                font-weight: bold;
              }
              tr:nth-child(even) {
                background-color: #f9f9f9;
              }
            </style>
          </head>
          <body>
            <h1>Listado de Localizaciones</h1>
            <table>
              <thead>
                <tr>
                  <th>TIPO LOCALIZACIÓN</th>
                  <th>SEDE C.P</th>
                  <th>PLANTA DEL EDIFICIO</th>
                  <th>DESCRIPCIÓN</th>
                  <th>CÓDIGO DE BARRAS</th>
                </tr>
              </thead>
              <tbody>
      `);

      // Agregar filas para cada localización seleccionada
      this.selection.selected.forEach(loc => {
        ventanaImpresion.document.write(`
          <tr>
            <td>${loc.tipoLocalizacion === 'local' ? 'Local' : 'Externa'}</td>
            <td>${loc.sedeCP}</td>
            <td>${loc.plantaEdificio || '-'}</td>
            <td>${loc.descripcionLocalizacion}</td>
            <td>${loc.codigoBarras}</td>
          </tr>
        `);
      });

      ventanaImpresion.document.write(`
              </tbody>
            </table>
          </body>
        </html>
      `);
      ventanaImpresion.document.close();
      setTimeout(() => {
        ventanaImpresion.print();
      }, 500);
    }
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