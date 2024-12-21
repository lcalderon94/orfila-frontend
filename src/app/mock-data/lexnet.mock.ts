// src/app/mock-data/lexnet.mock.ts

import { EstadoEnvio } from '../components/lexnet/estado-envios/estado-envios.component';
import { MensajeRecibido } from '../components/lexnet/mensajes-recibidos/mensajes-recibidos.component';

  export const MENSAJES_RECIBIDOS_MOCK: MensajeRecibido[] = [
    {
      nMensaje: '202210195591960',
      tipoMensaje: 'Notificación',
      remitente: 'Jdo. de lo Penal Nº 1 de Burgos',
      asunto: 'ASUNTO EN DATOS ENVIO 999999',
      nAnio: '999999/2023',
      tipoProc: 'CUA',
      fechaNotificacion: new Date('2022-08-04 09:15')
    },
    {
      nMensaje: '202210195591958',
      tipoMensaje: 'Notificación',
      remitente: 'Jdo. de lo Penal Nº 1 de Burgos',
      asunto: 'ASUNTO EN DATOS ENVIO 999999',
      nAnio: '999999/2023',
      tipoProc: 'ASS',
      fechaNotificacion: new Date('2022-08-04 09:11')
    },
    {
      nMensaje: '202210195591956',
      tipoMensaje: 'Notificación',
      remitente: 'Jdo. de lo Penal Nº 1 de Burgos',
      asunto: 'ASUNTO EN DATOS ENVIO 999999',
      nAnio: '999999/2023',
      tipoProc: 'ABS',
      fechaNotificacion: new Date('2022-08-04 08:57')
    },
    {
      nMensaje: '202210195591976',
      tipoMensaje: 'Notificación',
      remitente: 'Jdo. de lo Penal Nº 1 de Burgos',
      asunto: 'ASUNTO EN DATOS ENVIO 999999',
      nAnio: '999999/2023',
      tipoProc: 'ABS',
      fechaNotificacion: new Date('2022-07-26 09:12')
    },
    {
      nMensaje: '202210195591975',
      tipoMensaje: 'Notificación',
      remitente: 'Jdo. de lo Penal Nº 1 de Burgos',
      asunto: 'ASUNTO EN DATOS ENVIO 999999',
      nAnio: '999999/2023',
      tipoProc: 'ABS',
      fechaNotificacion: new Date('2022-07-26 09:11')
    },
    {
      nMensaje: '202210195591777',
      tipoMensaje: 'Notificación',
      remitente: 'Jdo. de lo Penal Nº 1 de Burgos',
      asunto: 'ASUNTO EN DATOS ENVIO 999999',
      nAnio: '999999/2023',
      tipoProc: 'ABS',
      fechaNotificacion: new Date('2022-07-22 14:10')
    },
    {
      nMensaje: '202210195591776',
      tipoMensaje: 'Notificación',
      remitente: 'Jdo. de lo Penal Nº 1 de Burgos',
      asunto: 'ASUNTO EN DATOS ENVIO 999999',
      nAnio: '999999/2023',
      tipoProc: 'ABS',
      fechaNotificacion: new Date('2022-07-22 14:09')
    },
    {
      nMensaje: '202210195591775',
      tipoMensaje: 'Notificación',
      remitente: 'Jdo. de lo Penal Nº 1 de Burgos',
      asunto: 'ASUNTO EN DATOS ENVIO 999999',
      nAnio: '999999/2023',
      tipoProc: 'ABS',
      fechaNotificacion: new Date('2022-07-22 14:08')
    }
  ];

export const ESTADOS_ENVIO_MOCK: EstadoEnvio[] = [
  {
    fEnvio: '15/07/2022',
    nEnvio: '12022101955915536',
    episodio: 'EP81175',
    tipoProcedimiento: 'Abstención / Recusación Jueces',
    nAnio: '1234591/2022',
    tipoDocPrincipal: 'INFORME',
    usuario: '46888715H',
    estado: 'Enviado'
  },
  {
    fEnvio: '15/07/2022',
    nEnvio: '12022101955915535',
    episodio: 'EP81173',
    tipoProcedimiento: 'Abstención / Recusación Jueces',
    nAnio: '1234599/2022',
    tipoDocPrincipal: 'INFORME',
    usuario: '46888715H',
    estado: 'Enviado'
  },
  {
    fEnvio: '14/07/2022',
    nEnvio: '12022101955915525',
    episodio: 'EP81172',
    tipoProcedimiento: 'Abstención / Recusación Jueces',
    nAnio: '1234567/2022',
    tipoDocPrincipal: 'INFORME',
    usuario: '46888715H',
    estado: 'Enviado'
  },
  {
    fEnvio: '14/07/2022',
    nEnvio: '12022101955915523',
    episodio: 'EP81172',
    tipoProcedimiento: 'Abstención / Recusación Jueces',
    nAnio: '1234567/2022',
    tipoDocPrincipal: 'INFORME',
    usuario: '46888715H',
    estado: 'Enviado'
  },
  {
    fEnvio: '06/07/2022',
    nEnvio: '12022101955591334',
    episodio: 'EP81158',
    tipoProcedimiento: 'Abstención / Recusación Jueces',
    nAnio: '9870876/2022',
    tipoDocPrincipal: 'INFORME',
    usuario: '02460888A',
    estado: 'Enviado'
  },
  {
    fEnvio: '17/06/2022',
    nEnvio: '12022101955590847',
    episodio: 'EP81158',
    tipoProcedimiento: 'Abstención / Recusación Jueces',
    nAnio: '9870876/2022',
    tipoDocPrincipal: 'INFORME',
    usuario: '02460888A',
    estado: 'Enviado'
  },
  {
    fEnvio: '17/06/2022',
    nEnvio: '12022101955590842',
    episodio: 'EP81154',
    tipoProcedimiento: 'ABSTENCION SECRETARIOS JUDICIALES',
    nAnio: '0221133/2022',
    tipoDocPrincipal: 'INFORME',
    usuario: '02460888A',
    estado: 'Enviado'
  },
  {
    fEnvio: '17/06/2022',
    nEnvio: '12022101955590841',
    episodio: 'EP81154',
    tipoProcedimiento: 'ABSTENCION SECRETARIOS JUDICIALES',
    nAnio: '0221133/2022',
    tipoDocPrincipal: 'INFORME',
    usuario: '02460888A',
    estado: 'Enviado'
  }
];