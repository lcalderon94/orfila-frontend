import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '0',
        overflow: 'hidden'
      })),
      state('expanded', style({
        height: '*'
      })),
      transition('collapsed <=> expanded', animate('300ms ease-in-out'))
    ])
  ]
})
export class SidebarComponent {
  menuItems = [
    {
      name: 'Tareas',
      icon: 'tareas',
      route: '/tareas'
    },
    {
      name: 'Episodios',
      icon: 'episodios',
      route: '/episodios',
      expanded: false,
      subItems: [
        { name: 'Nuevo Episodio', route: '/episodios/nuevo' },
        { name: 'Modificar Episodio', route: '/episodios/modificar' }
      ]
    },
    {
      name: 'Consulta Antecedentes',
      icon: 'consulta-antecedentes',
      route: '/consulta-antecedentes'
    },
    {
      name: 'Consulta Documentos',
      icon: 'consulta-documentos',
      route: '/consulta-documentos'
    },
    {
      name: 'Portafirmas',
      icon: 'portafirmas',
      route: '/portafirmas'
    },
    {
      name: 'LexNET',
      icon: 'lexnet',
      route: '/lexnet',
      expanded: false,
      subItems: [
        { name: 'Mensajes Recibidos', route: '/lexnet/mensajes-recibidos' },
        { name: 'Estado de Envíos', route: '/lexnet/estado-envios' }
      ]
    },
    {
      name: 'Gestión de Muestras',
      icon: 'gestion-muestras',
      route: '/gestion-muestras',
      expanded: false,
      subItems: [
        { name: 'Nueva Localización', route: '/gestion-muestras/nueva-localizacion' },
        { name: 'Localizaciones', route: '/gestion-muestras/localizaciones' },
        { name: 'Registro Muestras', route: '/gestion-muestras/registro-muestras' },
        { name: 'Salida Muestra', route: '/gestion-muestras/salida-muestra' },
        { name: 'Carga de Códigos', route: '/gestion-muestras/carga-codigos' },
        { name: 'Muestras', route: '/gestion-muestras/muestras' },
        { name: 'Cargas del Sistema', route: '/gestion-muestras/cargas-sistema' }
      ]
    },
    {
      name: 'Administración de Sujetos',
      icon: 'people',
      route: '/administracion-sujetos'
    }
  ];

  toggleExpand(item: any, event: Event) {
    event.preventDefault(); // Evita la navegación al hacer clic
    item.expanded = !item.expanded;
  }
}
