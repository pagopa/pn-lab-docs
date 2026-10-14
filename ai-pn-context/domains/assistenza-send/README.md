# Dominio: Assistenza del prodotto SEND

## Alberatura di contesto

```text
assistenza-send/
├── README.md                       # Punto d'ingresso e regole di caricamento
├── domain.md                       # Scopo, perimetro, fonti e questioni aperte
├── actors-and-components.md        # Attori, sistemi, componenti e ownership nota
├── relationships.md               # Relazioni strutturali e flussi noti
└── use-cases/
    ├── UC-AS-01-ticket-cittadini.md
    ├── UC-AS-02-ticket-imprese.md
    ├── UC-AS-03-invio-documenti-email-cce.md
    └── UC-AS-04-punti-ritiro-ivr.md
```

## Come orientare l'agente

- **Qualunque task nel dominio:** leggi prima [domain.md](./domain.md).
- **Task su un attore, sistema o ownership:** aggiungi
  [actors-and-components.md](./actors-and-components.md).
- **Task su integrazioni o dipendenze:** aggiungi
  [relationships.md](./relationships.md) e la fonte del componente.
- **Task su un flusso:** leggi solo il caso d'uso corrispondente:
  - [UC-AS-01 — Ticket da Portale Cittadini](./use-cases/UC-AS-01-ticket-cittadini.md)
  - [UC-AS-02 — Ticket da Portale Imprese](./use-cases/UC-AS-02-ticket-imprese.md)
  - [UC-AS-03 — Invio di documenti via email tramite CCE](./use-cases/UC-AS-03-invio-documenti-email-cce.md)
  - [UC-AS-04 — Punti di ritiro tramite IVR](./use-cases/UC-AS-04-punti-ritiro-ivr.md)
- **Task cross-domain o sul workflow di notifica:** rispondi solo per gli aspetti di
  assistenza descritti qui. Per il dominio o i componenti non documentati dichiara che
  non puoi rispondere in modo affidabile; non usare conoscenza generale di SEND per
  colmare i vuoti.
- **Task relativo a un dominio diverso:** segui la regola di rifiuto in
  [`ai-pn-context/README.md`](../../README.md); non inventare un dominio mancante.

## Stato del modello

Questo è l'unico dominio SEND attualmente documentato nel contesto strutturato. Altri
domini esistono ma non sono ancora coperti: per essi l'agente deve dichiarare di non
poter rispondere in modo affidabile. Questa è una baseline MBSE iniziale, non una
specifica approvata. Le descrizioni date dall'utente sono separate dai dettagli
reperiti via MCP su Confluence; i punti non confermati sono marcati nel modello. Le
fonti hanno stato e data differenti e non sono automaticamente prova del comportamento
attuale in produzione.

Per nuovi elementi, assegna un ID stabile (`DOM-AS`, `ACT-AS-*`, `CMP-AS-*`, `UC-AS-*`,
`REL-AS-*`, `REQ-AS-*`). Registra ogni relazione con tipo, direzione, fonte e stato di
validazione.
