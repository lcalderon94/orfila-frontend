import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

interface Tarea {
  organo: string;
  numEpisodio: string;
  tipoProcedimiento: string;
  numAnio: string;
  tipoAsistencia: string;
  numExpediente: string;
  sujeto: string;
  responsable: string;
}

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css']
})
export class TareasComponent implements OnInit, AfterViewInit {
  columnasVisibles: string[] = ['organo', 'numEpisodio', 'tipoProcedimiento', 'numAnio', 'tipoAsistencia', 'numExpediente', 'sujeto', 'responsable'];
  dataSource: MatTableDataSource<Tarea>;
  anchosCabeceros: { [key: string]: string } = {
    'organo': '200px',
    'numEpisodio': '100px',
    'tipoProcedimiento': '200px',
    'numAnio': '100px',
    'tipoAsistencia': '150px',
    'numExpediente': '120px',
    'sujeto': '180px',
    'responsable': '150px'
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('table', { static: true }) table!: ElementRef;

  constructor(private renderer: Renderer2) {
    const tareas: Tarea[] = [
      {
        organo: 'Jdo. de lo Penal Nº 1 de Salamanca',
        numEpisodio: '81329',
        tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
        numAnio: '000025/2022',
        tipoAsistencia: 'Análisis Genético',
        numExpediente: 'EX2017586',
        sujeto: 'Maria Isabel Rodriguez Alvarez',
        responsable: '30000332C'
      },
      {
        organo: 'Sección 2ª de la A. Prov. Valladolid',
        numEpisodio: '81136',
        tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
        numAnio: '000002/2022',
        tipoAsistencia: 'Análisis Genético',
        numExpediente: 'EX2013527',
        sujeto: '-',
        responsable: 'Asignar'
      },
      {
        organo: 'Abog. CCAA de CASTILLA Y LEON',
        numEpisodio: '81336',
        tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
        numAnio: '000001/2022',
        tipoAsistencia: 'Informe social genérico',
        numExpediente: 'EX2013607',
        sujeto: 'Antonio Orozco',
        responsable: '30000332C'
      },
      {
        organo: 'Jdo. de lo Penal Nº 1 de Salamanca',
        numEpisodio: '81320',
        tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
        numAnio: '000001/2022',
        tipoAsistencia: 'Autopsia',
        numExpediente: 'EX2013586',
        sujeto: 'Maria Isabel Rodriguez Alvarez',
        responsable: 'Asignar'
      },
      {
        organo: 'Jdo. de lo Penal Nº 1 de Salamanca',
        numEpisodio: '81305',
        tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
        numAnio: '000002/2022',
        tipoAsistencia: 'Valoración psicológica general',
        numExpediente: 'EX2013585',
        sujeto: 'Maria Isabel Rodriguez Alvarez',
        responsable: '30000328W'
      },
      {
        organo: 'Jdo. de lo Penal Nº 1 de Salamanca',
        numEpisodio: '81304',
        tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
        numAnio: '000001/2022',
        tipoAsistencia: 'Autopsia',
        numExpediente: 'EX2013584',
        sujeto: 'Maria Isabel Rodriguez Alvarez',
        responsable: 'Asignar'
      },
      {
        organo: 'Jdo. de lo Penal Nº 1 de Salamanca',
        numEpisodio: '81325',
        tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
        numAnio: '0000001/2022',
        tipoAsistencia: 'Lesiones en tráfico (PSIC)',
        numExpediente: 'EX2013544',
        sujeto: 'KUAHolapeptitopep',
        responsable: 'Asignar'
      },
    ];
    this.dataSource = new MatTableDataSource(tareas);
  }

  ngOnInit(): void {
    // Inicialización adicional si es necesaria
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.aplicarAnchosCabeceros();
  }

  obtenerTituloColumna(columna: string): string {
    const titulos: { [key: string]: string } = {
      'organo': 'Órgano',
      'numEpisodio': 'Nº Episodio',
      'tipoProcedimiento': 'Tipo Procedimiento',
      'numAnio': 'Nº/Año',
      'tipoAsistencia': 'Tipo Asistencia',
      'numExpediente': 'Nº Expediente',
      'sujeto': 'Sujeto',
      'responsable': 'Responsable'
    };
    return titulos[columna] || columna;
  }

  aplicarAnchosCabeceros() {
    const cabeceros = this.table.nativeElement.querySelectorAll('th');
    cabeceros.forEach((cabecero: HTMLElement, index: number) => {
      const columna = this.columnasVisibles[index];
      this.renderer.setStyle(cabecero, 'width', this.anchosCabeceros[columna]);
    });
  }

  alRedimensionarColumna(evento: MouseEvent, columna: string) {
    evento.preventDefault();
    const th = evento.target as HTMLElement;
    const startX = evento.pageX;
    const startWidth = th.offsetWidth;

    const onMouseMove = (e: MouseEvent) => {
      const width = startWidth + (e.pageX - startX);
      this.renderer.setStyle(th, 'width', `${width}px`);
      this.anchosCabeceros[columna] = `${width}px`;
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
}