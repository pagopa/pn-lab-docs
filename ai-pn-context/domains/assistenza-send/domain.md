# DOM-AS — Assistenza del prodotto SEND

## Identità del dominio

| Campo | Valore |
| --- | --- |
| ID | `DOM-AS` |
| Nome | Assistenza del prodotto SEND |
| Stato | Bozza iniziale da validare con Product, Assistenza & Operations e team SEND |
| Data baseline | 14 ottobre 2026 |
| Sistema di interesse | Capacità SEND che consentono o supportano l'assistenza agli utenti del prodotto |

## Scopo

Consentire a cittadini, utenti di imprese e operatori di accedere a forme di assistenza
relative a SEND tramite i portali e il canale telefonico, e collegare i componenti SEND
alla piattaforma aziendale di assistenza e ticketing.

Nel perimetro descritto finora rientrano:

- apertura di un ticket di assistenza da parte di un utente autenticato sul Portale
  Cittadini;
- apertura di un ticket generico SEND da parte di un utente autenticato per un'impresa
  sul Portale Imprese;
- gestione tramite CCE di una richiesta dell'operatore relativa all'invio digitale di
  documenti/notifiche;
- consultazione telefonica dei Punti di Ritiro SEND tramite IVR/assistente virtuale.

## Confini e sistemi esterni

**Dentro il sistema di interesse SEND:** Portale Cittadini, Portale Imprese e
integrazioni SEND del CCE. La collocazione organizzativa e tecnica di IVR e assistente
virtuale non è ancora determinata nel modello.

**Dipendenza condivisa esterna a SEND:** la piattaforma aziendale di assistenza e
ticketing, indicata dall'utente come attualmente realizzata con Zendesk. Il CCE la
collega a SEND; non va modellata come un sottosistema SEND senza una decisione di
ownership.

**Altri sistemi/canali da rappresentare quando pertinenti:** canale email, telefonia,
Virtual Room, servizio di invio SMS e repertorio dei Punti di Ritiro SEND. Le fonti
specifiche indicano `pn-service-desk`, Safe Storage e canali esterni per alcuni flussi,
ma non definiscono ancora una mappa completa delle responsabilità del dominio.

## Attori

- cittadino autenticato sul Portale Cittadini;
- utente autenticato che opera per un'impresa;
- operatore di assistenza;
- utente che telefona al numero di assistenza SEND.

Profili, ruoli autorizzativi, deleghe, livelli L1/L2 e differenze tra persone fisiche e
operatori d'impresa sono da precisare nei casi d'uso e nelle regole di accesso.

## Tassonomia MBSE usata

- **Dominio:** area di responsabilità e capacità di prodotto (`DOM-AS`).
- **Caso d'uso:** obiettivo di un attore esterno o operatore (`UC-AS-*`).
- **Sottosistema:** responsabilità logica da individuare dopo la validazione dei flussi;
  non è ancora definito in questa baseline.
- **Componente:** portale, applicazione, servizio o sistema concreto (`CMP-AS-*`).
- **Relazione:** legame strutturale o comportamentale tipizzato (`REL-AS-*`).

Non assumere che un componente software equivalga a un sottosistema o a un dominio.
Prima si stabilizzano i casi d'uso e le responsabilità; poi si alloca ciascuna
responsabilità ai componenti effettivi.

## Fonti e stato delle evidenze

### Informazioni fornite dall'utente

Il nome e la missione del dominio, i quattro flussi iniziali, i portali SEND, il ruolo
del CCE, il collegamento del CCE alla piattaforma aziendale di assistenza e la presenza
dell'IVR sono stati forniti come requisiti di avvio del modello.

### Fonti Confluence consultate via MCP

- [SRS: Integrazione UX cittadini per apertura ticket di assistenza](https://pagopa.atlassian.net/wiki/spaces/PN/pages/982253664/SRS+Integrazione+UX+cittadini+per+apertura+ticket+di+assistenza),
  versione 43, 9 settembre 2025. Descrive UX autenticata, Zendesk e integrazione
  `pn-zendesk-auth`; include dettagli implementativi che vanno verificati prima del
  riuso.
- [SRS: Evolutiva CCE via Email](https://pagopa.atlassian.net/wiki/spaces/PN/pages/2622160934/SRS+Evolutiva+CCE+via+Email),
  versione 27, 24 marzo 2026. Descrive una richiesta dell'operatore CCE per l'invio
  email di documenti di più notifiche, identificazione tramite Virtual Room, ticket e
  operazioni gestite da `pn-service-desk`. Non va confusa con l'invio di una nuova
  notifica SEND.
- [I nuovi IVR per offrire assistenza su canale sincrono](https://pagopa.atlassian.net/wiki/spaces/OTS/pages/1494483104/I+nuovi+IVR+per+offrire+assistenza+su+canale+sincrono),
  versione 10, 25 marzo 2025. Descrive numeri e instradamento del canale telefonico
  SEND e l'integrazione con Zendesk.
- [Statistiche e Costi servizio VA - Punti di Ritiro SEND](https://pagopa.atlassian.net/wiki/spaces/OTS/pages/2459926702/Statistiche+e+Costi+servizio+VA+-+Punti+di+Ritiro+SEND),
  versione 25, 3 aprile 2026. Descrive l'assistente virtuale sull'opzione IVR 1.1 e
  l'invio via SMS dei tre punti di ritiro più vicini alla posizione dichiarata.
- [SRS: API per il Call Center Evoluto](https://pagopa.atlassian.net/wiki/spaces/PN/pages/757727482/SRS+API+per+il+Call+Center+Evoluto),
  versione 148, 4 giugno 2024. Riferimento precedente per l'integrazione tra il
  cruscotto di assistenza e i servizi SEND; verificare la compatibilità con le
  evoluzioni CCE più recenti.
- [RADD Poste Italiane](https://pagopa.atlassian.net/wiki/spaces/PN/pages/3306455133/RADD+Poste+Italiane),
  live document in bozza, 5 ottobre 2026. Riferimento aperto per i Punti di Ritiro; non
  trattare il contenuto draft come decisione approvata.

La fonte [Architettura - Vista d'insieme](https://pagopa.atlassian.net/wiki/spaces/PN/pages/442171700/Architettura+-+Vista+d'insieme)
rimane una mappa generale, non il riferimento di dettaglio per i casi d'uso di
assistenza. Il suo contenuto non estende il perimetro dei domini modellati in questo
contesto: per gli altri domini SEND, ancora non documentati, l'agente deve dichiarare
che non può rispondere in modo affidabile.

## Questioni da chiudere

1. Il caso d'uso del Portale Imprese è supportato da una specifica dedicata? Qual è il
   flusso tecnico, il tipo di utente e la relazione del ticket con l'impresa?
2. Nel flusso CCE, “invio di una notifica” significa invio di una nuova notifica SEND
   oppure inoltro via email di copia dei documenti di una notifica già ricevuta? La
   specifica CCE via email consultata descrive il secondo scenario.
3. Quali sono i confini tra CCE, `pn-service-desk`, IVR, assistente virtuale, Zendesk e
   sistemi/fornitori aziendali? Chi è owner e chi opera ciascun componente?
4. Come si autenticano e autorizzano operatore e utente? Qual è il legame obbligatorio
   tra richiesta CCE e ticket?
5. Da dove proviene la posizione per trovare i Punti di Ritiro e qual è il contratto
   di risposta (voce, SMS o entrambi)? La fonte IVR/VA descrive SMS con tre risultati e
   condizioni di accesso specifiche.
6. Quali sono gli stati, gli errori, i retry, i tempi di conservazione e i requisiti
   privacy/audit dei flussi?
7. Le pagine Confluence consultate descrivono il comportamento attuale o solo una
   specifica/proposta? Validare lo stato di rilascio e gli owner prima di assegnare
   relazioni al modello AS-IS.
