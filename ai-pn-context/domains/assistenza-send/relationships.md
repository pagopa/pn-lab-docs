# Relazioni — DOM-AS

## Relazioni strutturali e di responsabilità

| ID | Sorgente | Relazione | Destinazione | Stato/fonte |
| --- | --- | --- | --- | --- |
| `REL-AS-01` | Portale Cittadini | `presenta` | Flusso di apertura ticket SEND | Utente; SRS ticket cittadini |
| `REL-AS-02` | Portale Imprese | `presenta` | Flusso di apertura ticket generico SEND | Utente; da specificare |
| `REL-AS-03` | CCE | `integra/connettere` | Piattaforma aziendale di assistenza (Zendesk) | Utente; verificare interfacce correnti |
| `REL-AS-04` | IVR SEND | `instrada` | Opzione di assistenza per Punti di Ritiro | SRS IVR/VA |
| `REL-AS-05` | Assistente Virtuale Punti di Ritiro | `restituisce tramite` | Canale SMS | SRS VA, versione 25 |
| `REL-AS-06` | `pn-zendesk-auth` | `abilita accesso a` | Form di assistenza Zendesk | SRS ticket cittadini; sequenza esatta da verificare |
| `REL-AS-07` | CCE | `invoca/usa` | `pn-service-desk` | SRS CCE via Email; il confine tra CCE e client/API va confermato |
| `REL-AS-08` | `pn-service-desk` | `orchestra` | Invio via email dei documenti di notifica | SRS CCE via Email |
| `REL-AS-09` | Assistente Virtuale Punti di Ritiro | `consulta` | Registro/Mappa Punti di Ritiro | SRS VA; dettaglio integrazione da validare |

## Tracce dei casi d'uso

| Caso d'uso | Attore primario | Percorso strutturale noto |
| --- | --- | --- |
| `UC-AS-01` | `ACT-AS-01` | Portale Cittadini → `pn-zendesk-auth` → Zendesk/form di assistenza |
| `UC-AS-02` | `ACT-AS-02` | Portale Imprese → piattaforma di assistenza; integrazione non specificata |
| `UC-AS-03` | `ACT-AS-03` | Operatore/CCE → `pn-service-desk` → Safe Storage/canale esterno → email, secondo SRS CCE via Email |
| `UC-AS-04` | `ACT-AS-04` | Telefonia → IVR SEND, opzione 1.1 → Assistente Virtuale → registro punti → SMS |

La traccia `UC-AS-03` è una sintesi della specifica CCE via Email per invio di documenti
di notifiche esistenti, non prova che il flusso previsto dall'utente sia un invio di
nuova notifica. La specifica di dettaglio definisce API, persistenza e callback/eventi;
consultarla prima di modificare l'implementazione.

## Regole di modellazione delle relazioni

- Una relazione non documentata resta marcata **da validare**, non va completata con
  frecce dedotte dal solo nome dei servizi.
- Distinguere `uses/calls`, `sends event to`, `reads data from`, `owns`, `part of` e
  `realizes use case`; non usare un generico “collegato a”.
- Per ogni interfaccia individuata aggiungere contratto/versione, direzione, trigger,
  dati scambiati, modalità sincrona/asincrona ed errori, citando la fonte.
- Quando una relazione è cambiata da una SRS, mantenere distinta la baseline AS-IS
  dall'eventuale TO-BE e annotare lo stato di rilascio.
