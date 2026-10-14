# UC-AS-03 — Richiedere al CCE l'invio di documenti via email

| Campo | Valore |
| --- | --- |
| Dominio | `DOM-AS` |
| Attore primario | `ACT-AS-03` — operatore di assistenza |
| Componenti principali | `CMP-AS-03` CCE, `CMP-AS-10` `pn-service-desk`, `CMP-AS-07` email |
| Stato | Caso utente da chiarire; specifica CCE via email consultata descrive l'invio di documenti di notifiche esistenti |

## Chiarimento semantico

L'utente ha descritto un operatore che richiede “l'invio su un canale digitale (e-mail)
di una notifica”. La specifica Confluence più recente consultata, **SRS: Evolutiva CCE
via Email**, descrive invece una richiesta di reinvio via email dei documenti/allegati
di una o più notifiche già ricevute da un destinatario, non la creazione e spedizione di
una nuova notifica legale. Il modello usa questa seconda interpretazione solo come
riferimento documentato; non dichiarare equivalenti i due intenti senza conferma.

## Obiettivo documentato dalla SRS

Consentire all'operatore CCE, dopo identificazione del destinatario tramite Virtual
Room, di raccogliere una richiesta di invio via email dei documenti relativi a più
notifiche SEND associandola a un ticket di assistenza.

## Traccia documentata ad alto livello

1. L'operatore avvia la gestione della richiesta dal CCE/ticket.
2. Il destinatario viene identificato tramite Virtual Room, secondo la SRS.
3. L'operatore seleziona gli IUN per i quali sono richiesti i documenti.
4. Il servizio `pn-service-desk` crea un'operazione padre e sotto-operazioni per gli
   IUN, in modo atomico; la SRS assume un massimo di cinque IUN.
5. Il backend elabora i documenti e invia l'email tramite il workflow asincrono e i
   componenti downstream descritti nella specifica.
6. Gli eventi dei componenti downstream aggiornano lo stato dell'operazione.

Questa è una sintesi della SRS, non un contratto API completo. Verificare requisiti,
stato di rilascio, schema e comportamento corrente nella fonte.

## Fonti

- [SRS: Evolutiva CCE via Email](https://pagopa.atlassian.net/wiki/spaces/PN/pages/2622160934/SRS+Evolutiva+CCE+via+Email), versione 27, 24 marzo 2026.
- [SRS: API per il Call Center Evoluto](https://pagopa.atlassian.net/wiki/spaces/PN/pages/757727482/SRS+API+per+il+Call+Center+Evoluto), versione 148, 4 giugno 2024, riferimento precedente.
- [SRS: Call Center Evoluto via Email](https://pagopa.atlassian.net/wiki/spaces/PN/pages/1841102961/SRS+Call+Center+Evoluto+via+Email), versione 72, 1 ottobre 2026, evoluzione correlata da confrontare con la SRS CCE via Email.

## Informazioni da validare

- se il flusso richiesto è invio di documenti già esistenti oppure invio di una nuova
  notifica SEND;
- se l'operatore parte sempre da un ticket Zendesk e quale ID collega alle operazioni;
- condizioni di eleggibilità del destinatario e dei documenti, inclusi vincoli
  temporali;
- ownership e interfacce tra CCE e `pn-service-desk`;
- conferma di release delle SRS consultate, limiti IUN, autorizzazioni, stati ed errori.
