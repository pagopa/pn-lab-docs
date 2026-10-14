# UC-AS-02 — Aprire un ticket dal Portale Imprese

| Campo | Valore |
| --- | --- |
| Dominio | `DOM-AS` |
| Attore primario | `ACT-AS-02` — utente autenticato appartenente a un'impresa |
| Sistema primario | `CMP-AS-02` — Portale Imprese |
| Stato | Requisito iniziale fornito dall'utente; specifica di dettaglio non individuata |

## Obiettivo

Permettere a un utente autenticato che opera per un'impresa di aprire dal Portale
Imprese un ticket generico sul prodotto SEND.

## Flusso noto

1. L'utente autenticato accede al Portale Imprese.
2. L'utente avvia una richiesta generica di assistenza per SEND.
3. La richiesta viene inviata alla piattaforma aziendale di assistenza.

Il punto 3 è un'assunzione di modellazione coerente con il contesto di dominio, ma
l'integrazione concreta e la relativa fonte non sono state specificate.

## Risultato atteso

Richiesta di assistenza generica SEND presentata per conto dell'impresa. Non sono
definiti il mapping dell'utente e dell'impresa nel ticket, la categorizzazione o la
conferma dell'apertura.

## Informazioni da validare

- nome e perimetro reale del “Portale Imprese”;
- modello di identità, ruolo aziendale e autorizzazione ad aprire richieste;
- se il ticket è sempre generico oppure può riferirsi a una notifica o a una pratica;
- campi, allegati, classificazione e destinazione del ticket in Zendesk;
- percorso frontend/backend, componente SEND di integrazione e gestione errori;
- esistenza di SRS, RFC, API o runbook specifici.

## Nota per l'agente

Non copiare automaticamente il flusso del Portale Cittadini: autenticazione,
informazioni contestuali e categorie possono essere diverse. Trattare ogni dettaglio
non elencato sopra come domanda aperta.
