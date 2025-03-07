// gestion-muestras.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestion-muestras',
  templateUrl: './gestion-muestras.component.html',
  styleUrls: ['./gestion-muestras.component.css']
})
export class GestionMuestrasComponent implements OnInit {
  menuOptions = [
    { label: 'Nueva Localización', route: 'nueva-localizacion', icon: 'add_location' },
    { label: 'Localizaciones', route: 'localizaciones', icon: 'location_on' },
    { label: 'Registro Muestras', route: 'registro-muestras', icon: 'playlist_add' },
    { label: 'Salida Muestra', route: 'salida-muestra', icon: 'exit_to_app' },
    { label: 'Carga de Códigos', route: 'carga-codigos', icon: 'upload' },
    { label: 'Muestras', route: 'muestras-list', icon: 'list' },
    { label: 'Cargas del Sistema', route: 'cargas-sistema', icon: 'system_update' }
  ];

  constructor(public router: Router) { } // Changed from private to public

  ngOnInit(): void {
  }

  navigateTo(route: string): void {
    this.router.navigate(['/gestion-muestras', route]);
  }
}