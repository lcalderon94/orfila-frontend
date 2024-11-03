import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importaciones de componentes
import { TareasComponent } from './components/tareas/tareas.component';
import { EpisodiosComponent } from './components/episodios/episodios.component';
import { ListadoEpisodiosComponent } from './components/episodios/listado-episodios/listado-episodios.component';
import { NuevoEpisodioComponent } from './components/episodios/nuevo-episodio/nuevo-episodio.component';
import { ModificarEpisodioComponent } from './components/episodios/modificar-episodio/modificar-episodio.component';
import { SujetosComponent } from './components/sujetos/sujetos.component';
import { ActuacionesComponent } from './components/actuaciones/actuaciones.component';
import { DocumentosComponent } from './components/documentos/documentos.component';
import { MuestrasComponent } from './components/muestras/muestras.component';
import { ConsultaAntecedentesComponent } from './components/consulta-antecedentes/consulta-antecedentes.component';
import { ConsultaDocumentosComponent } from './components/consulta-documentos/consulta-documentos.component';
import { PortafirmasComponent } from './components/portafirmas/portafirmas.component';
import { LexnetComponent } from './components/lexnet/lexnet.component';
import { MensajesRecibidosComponent } from './components/lexnet/mensajes-recibidos/mensajes-recibidos.component';
import { EstadoEnviosComponent } from './components/lexnet/estado-envios/estado-envios.component';
import { GestionMuestrasComponent } from './components/gestion-muestras/gestion-muestras.component';
import { NuevaLocalizacionComponent } from './components/gestion-muestras/nueva-localizacion/nueva-localizacion.component';
import { LocalizacionesComponent } from './components/gestion-muestras/localizaciones/localizaciones.component';
import { RegistroMuestrasComponent } from './components/gestion-muestras/registro-muestras/registro-muestras.component';
import { SalidaMuestraComponent } from './components/gestion-muestras/salida-muestra/salida-muestra.component';
import { CargaCodigosComponent } from './components/gestion-muestras/carga-codigos/carga-codigos.component';
import { MuestrasListComponent } from './components/gestion-muestras/muestras-list/muestras-list.component';
import { CargasSistemaComponent } from './components/gestion-muestras/cargas-sistema/cargas-sistema.component';
import { AdministracionSujetosComponent } from './components/administracion-sujetos/administracion-sujetos.component';
import { PortafirmasListadoComponent } from './components/portafirmas/portafirmas-listado/portafirmas-listado.component';


const routes: Routes = [
  { path: '', redirectTo: '/tareas', pathMatch: 'full' },
  { path: 'tareas', component: TareasComponent },
  
  { 
    path: 'episodios', 
    component: EpisodiosComponent,
    children: [
      { path: '', component: ListadoEpisodiosComponent },
      { path: 'nuevo', component: NuevoEpisodioComponent },
      { path: 'modificar', component: ModificarEpisodioComponent },
      { path: 'modificar/:nEpisodio', component: ModificarEpisodioComponent }
    ]
  },
  
  // Resto de rutas
  { path: 'sujetos', component: SujetosComponent },
  { path: 'actuaciones', component: ActuacionesComponent },
  { path: 'documentos', component: DocumentosComponent },
  { path: 'muestras', component: MuestrasComponent },
  { path: 'consulta-antecedentes', component: ConsultaAntecedentesComponent },
  { path: 'consulta-documentos', component: ConsultaDocumentosComponent },
  { 
    path: 'portafirmas', 
    component: PortafirmasComponent,
    children: [
      { path: '', component: PortafirmasComponent },
      { path: 'listado', component: PortafirmasListadoComponent }
    ]
  },
  
  // LexNET routes
  { 
    path: 'lexnet', 
    component: LexnetComponent,
    children: [
      { path: '', redirectTo: 'mensajes-recibidos', pathMatch: 'full' },
      { path: 'mensajes-recibidos', component: MensajesRecibidosComponent },
      { path: 'estado-envios', component: EstadoEnviosComponent }
    ]
  },
  
  // Gestión de muestras routes
  { 
    path: 'gestion-muestras', 
    component: GestionMuestrasComponent,
    children: [
      { path: '', redirectTo: 'nueva-localizacion', pathMatch: 'full' },
      { path: 'nueva-localizacion', component: NuevaLocalizacionComponent },
      { path: 'localizaciones', component: LocalizacionesComponent },
      { path: 'registro-muestras', component: RegistroMuestrasComponent },
      { path: 'salida-muestra', component: SalidaMuestraComponent },
      { path: 'carga-codigos', component: CargaCodigosComponent },
      { path: 'muestras', component: MuestrasListComponent },
      { path: 'cargas-sistema', component: CargasSistemaComponent }
    ]
  },
  
  { path: 'administracion-sujetos', component: AdministracionSujetosComponent },
  
  // Wildcard route
  { path: '**', redirectTo: '/tareas' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }