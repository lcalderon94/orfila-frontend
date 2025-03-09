import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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
import { MuestraDetalleComponent } from './components/gestion-muestras/muestra-detalle/muestra-detalle.component';

import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';

// Angular Material Modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { NotasEpisodioComponent } from './components/episodios/notas-episodio/notas-episodio.component';
import { TareaDetalleComponent } from './components/tareas/tarea-detalle/tarea-detalle.component';
import { HojaEvolucionComponent } from './components/tareas/hoja-evolucion/hoja-evolucion.component';
import { NuevoDocumentoComponent } from './components/consulta-documentos/nuevo-documento/nuevo-documento.component';
import { AgendaComponent } from './components/agenda/agenda.component';
import { AgendaMensualComponent } from './components/agenda/agenda-mensual/agenda-mensual.component';
import { AgendaSemanalComponent } from './components/agenda/agenda-semanal/agenda-semanal.component';
import { AgendaHorariaComponent } from './components/agenda/agenda-horaria/agenda-horaria.component';
import { EventoDialogComponent } from './components/agenda/evento-dialog/evento-dialog.component';
import { AgendaService } from './services/agenda.service';
import { RemisionMuestrasComponent } from './components/informes/remision-muestras/remision-muestras.component';
import { PasoBasicosComponent } from './components/informes/remision-muestras/paso-basicos/paso-basicos.component';
import { PasoSolicitanteComponent } from './components/informes/remision-muestras/paso-solicitante/paso-solicitante.component';
import { PasoAsuntoComponent } from './components/informes/remision-muestras/paso-asunto/paso-asunto.component';
import { PasoEstudiosComponent } from './components/informes/remision-muestras/paso-estudios/paso-estudios.component';
import { PasoSujetosComponent } from './components/informes/remision-muestras/paso-sujetos/paso-sujetos.component';
import { PasoMuestrasComponent } from './components/informes/remision-muestras/paso-muestras/paso-muestras.component';
import { PasoCustodiaComponent } from './components/informes/remision-muestras/paso-custodia/paso-custodia.component';
import { HttpClientModule } from '@angular/common/http';






@NgModule({
  declarations: [
    AppComponent,
    TareasComponent,
    EpisodiosComponent,
    ListadoEpisodiosComponent,
    NuevoEpisodioComponent,
    ModificarEpisodioComponent,
    SujetosComponent,
    ActuacionesComponent,
    DocumentosComponent,
    MuestrasComponent,
    ConsultaAntecedentesComponent,
    ConsultaDocumentosComponent,
    PortafirmasComponent,
    LexnetComponent,
    MensajesRecibidosComponent,
    EstadoEnviosComponent,
    GestionMuestrasComponent,
    NuevaLocalizacionComponent,
    LocalizacionesComponent,
    RegistroMuestrasComponent,
    SalidaMuestraComponent,
    CargaCodigosComponent,
    MuestrasListComponent,
    CargasSistemaComponent,
    AdministracionSujetosComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    PortafirmasListadoComponent,
    NotasEpisodioComponent,
    TareaDetalleComponent,
    HojaEvolucionComponent,
    NuevoDocumentoComponent,
    AgendaComponent,
    AgendaMensualComponent,
    AgendaSemanalComponent,
    AgendaHorariaComponent,
    EventoDialogComponent,
    RemisionMuestrasComponent,
    PasoBasicosComponent,
    PasoSolicitanteComponent,
    PasoAsuntoComponent,
    PasoEstudiosComponent,
    PasoSujetosComponent,
    PasoMuestrasComponent,
    PasoCustodiaComponent,
    MuestraDetalleComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatRadioModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    MatMenuModule,
    MatCardModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatListModule,
    MatTabsModule,
    MatDialogModule,
    MatSliderModule,
    MatStepperModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatNativeDateModule,
    MatExpansionModule,
    HttpClientModule
  ],
  providers: [
    AgendaService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }