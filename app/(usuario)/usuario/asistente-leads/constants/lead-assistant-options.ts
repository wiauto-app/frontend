export interface LeadAssistantSelectOption {
  value: string;
  label: string;
}

export interface LeadAssistantReplyDelayOption {
  value: 0 | 30 | 60 | 120 | 300;
  label: string;
  tooltip: string;
}

export const LEAD_ASSISTANT_REPLY_DELAY_OPTIONS: LeadAssistantReplyDelayOption[] =
  [
    {
      value: 0,
      label: "Al momento",
      tooltip:
        "Responde en cuanto se compruebe que no estás en el chat y siga habiendo cupo.",
    },
    {
      value: 30,
      label: "30 segundos",
      tooltip:
        "Da un margen breve por si entras tú en la conversación antes de que escriba la IA.",
    },
    {
      value: 60,
      label: "1 minuto",
      tooltip: "Espera un minuto antes de contestar en tu nombre.",
    },
    {
      value: 120,
      label: "2 minutos",
      tooltip: "Espera dos minutos antes de contestar en tu nombre.",
    },
    {
      value: 300,
      label: "5 minutos",
      tooltip: "Espera cinco minutos antes de contestar en tu nombre.",
    },
  ];

export interface LeadAssistantNotifyToggleMeta {
  field: "notify_on_reply" | "notify_on_quota_exhausted" | "notify_on_hot_lead";
  label: string;
  description: string;
  tooltip: string;
}

export const LEAD_ASSISTANT_NOTIFY_TOGGLES: LeadAssistantNotifyToggleMeta[] = [
  {
    field: "notify_on_reply",
    label: "Avisar cuando el asistente responda",
    description: "Recibirás una notificación con un extracto del mensaje enviado.",
    tooltip:
      "Te avisamos con el nombre del comprador y un fragmento del texto que ha enviado el asistente.",
  },
  {
    field: "notify_on_quota_exhausted",
    label: "Avisar cuando no pueda responder por cupo",
    description:
      "Un aviso si se agota el cupo del chat o del mes para que entres tú.",
    tooltip:
      "Solo una vez por chat y periodo de facturación. No avisa si el asistente está desactivado o ya estás en el chat.",
  },
  {
    field: "notify_on_hot_lead",
    label: "Avisar cuando el lead parezca listo para cerrar",
    description:
      "Señal cuando piden visita, reserva, financiación, prueba o muestran intención clara de compra.",
    tooltip:
      "No garantiza la venta: es una pista para que entres en el chat. La clasificación se hace junto con la respuesta automática.",
  },
];
