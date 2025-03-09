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
import { TareaDetalleComponent } from './components/tareas/tarea-detalle/tarea-detalle.component';
import { NuevoDocumentoComponent } from './components/consulta-documentos/nuevo-documento/nuevo-documento.component';
import { AgendaComponent } from './components/agenda/agenda.component';
import { AgendaMensualComponent } from './components/agenda/agenda-mensual/agenda-mensual.component';
import { AgendaSemanalComponent } from './components/agenda/agenda-semanal/agenda-semanal.component';
import { AgendaHorariaComponent } from './components/agenda/agenda-horaria/agenda-horaria.component';
import { RemisionMuestrasComponent } from './components/informes/remision-muestras/remision-muestras.component';
import { MuestraDetalleComponent } from './components/gestion-muestras/muestra-detalle/muestra-detalle.component';





const routes: Routes = [
  { path: '', redirectTo: '/tareas', pathMatch: 'full' },
  {
    path: 'tareas',
    children: [
      { path: '', component: TareasComponent },
      { path: ':numEpisodio', component: TareaDetalleComponent } // <-- renombrado
    ]
  },
  
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
  {
    path: 'consulta-documentos',
    children: [
      { path: '', component: ConsultaDocumentosComponent },
      { path: 'nuevo', component: NuevoDocumentoComponent }
    ]
  },
  { 
    path: 'portafirmas', 
    component: PortafirmasComponent,
    children: [
      { path: '', component: PortafirmasComponent },
      { path: 'listado', component: PortafirmasListadoComponent }
    ]
  },
  { 
    path: 'agenda', 
    component: AgendaComponent,
    children: [
      { path: '', redirectTo: 'mensual', pathMatch: 'full' },
      { path: 'mensual', component: AgendaMensualComponent },
      { path: 'semanal', component: AgendaSemanalComponent },
      { path: 'horaria', component: AgendaHorariaComponent }
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
      { path: '', component: GestionMuestrasComponent },
      { path: 'nueva-localizacion', component: NuevaLocalizacionComponent },
      { path: 'nueva-localizacion/:id', component: NuevaLocalizacionComponent },
      { path: 'localizaciones', component: LocalizacionesComponent },
      { path: 'registro-muestras', component: RegistroMuestrasComponent },
      { path: 'registro-muestras/:id', component: RegistroMuestrasComponent },
      { path: 'salida-muestra', component: SalidaMuestraComponent },
      { path: 'salida-muestra/:id', component: SalidaMuestraComponent },
      { path: 'carga-codigos', component: CargaCodigosComponent },
      { path: 'muestras-list', component: MuestrasListComponent },
      { path: 'muestra-detalle/:id', component: MuestraDetalleComponent }, // Añadir esta línea
      { path: 'cargas-sistema', component: CargasSistemaComponent }
    ]
  },
  // Ruta para el generador de informes de remisión de muestras
  { 
    path: 'generar-informe-remision', 
    component: RemisionMuestrasComponent 
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