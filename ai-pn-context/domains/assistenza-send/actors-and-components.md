# Attori e componenti — DOM-AS

## Attori

| ID | Attore | Obiettivo/ruolo | Stato |
| --- | --- | --- | --- |
| `ACT-AS-01` | Cittadino autenticato | Apre una richiesta di assistenza SEND dal Portale Cittadini | Requisito utente; specifica Confluence disponibile |
| `ACT-AS-02` | Utente di un'impresa autenticato | Apre una richiesta generica SEND dal Portale Imprese | Requisito utente; fonte di dettaglio non individuata |
| `ACT-AS-03` | Operatore di assistenza | Usa la piattaforma aziendale/CCE per gestire richieste legate a SEND | Requisito utente; processi e permessi da validare |
| `ACT-AS-04` | Utente telefonico | Chiama il canale SEND e seleziona un'opzione IVR per i Punti di Ritiro | Requisito utente; fonte IVR/VA disponibile |

## Componenti e sistemi

| ID | Nome | Tipo e ownership modellata | Responsabilità nota | Evidenza |
| --- | --- | --- | --- | --- |
| `CMP-AS-01` | Portale Cittadini | Portale SEND | Interfaccia autenticata per l'apertura ticket da parte del cittadino | Utente; SRS ticket cittadini |
| `CMP-AS-02` | Portale Imprese | Portale SEND | Interfaccia autenticata per richiesta generica di assistenza per un'impresa | Utente; da specificare |
| `CMP-AS-03` | CCE / Cruscotto Assistenza | Componente SEND | Interfaccia dell'operatore con funzioni di assistenza integrate ai servizi SEND | Utente; SRS CCE e SRS API CCE |
| `CMP-AS-04` | Piattaforma aziendale di assistenza (Zendesk) | Sistema aziendale condiviso, esterno al perimetro SEND | Gestione ticket e form di assistenza; integrazione con portali/CCE | Utente; SRS ticket cittadini e SRS IVR |
| `CMP-AS-05` | IVR SEND | Sistema telefonico; ownership tecnica da validare | Risponde al canale telefonico SEND e instrada le opzioni di assistenza | Utente; SRS IVR |
| `CMP-AS-06` | Assistente Virtuale Punti di Ritiro | Servizio automatizzato collegato a IVR 1.1; ownership da validare | Gestisce la richiesta di informazioni sui Punti di Ritiro e attiva l'invio dei risultati via SMS | SRS VA, versione 25 |
| `CMP-AS-07` | Canale email | Canale digitale | Consegna via email dei documenti SEND nel caso CCE descritto dalla SRS | SRS Evolutiva CCE via Email |
| `CMP-AS-08` | Canale SMS | Canale digitale | Invia i dettagli dei tre Punti di Ritiro più vicini nel flusso VA descritto | SRS VA, versione 25; provider/integrazione da riconfermare |
| `CMP-AS-09` | `pn-zendesk-auth` | Servizio backend SEND citato dalla SRS ticket cittadini | Fornisce al frontend l'autorizzazione/dati di accesso al form Zendesk, secondo la SRS | SRS ticket cittadini, versione 43 |
| `CMP-AS-10` | `pn-service-desk` | Servizio SEND citato dalla SRS CCE via Email | Gestisce operazioni di assistenza per il rinvio dei documenti notificati via email | SRS Evolutiva CCE via Email, versione 27 |
| `CMP-AS-11` | Virtual Room | Servizio esterno/di supporto, ownership da verificare | Identificazione remota citata per gli scenari CCE relativi all'invio dei documenti | SRS CCE via Email |
| `CMP-AS-12` | Registro/Mappa Punti di Ritiro | Fonte dati esterna o condivisa, ownership da verificare | Dati di localizzazione usati per individuare i punti vicini | SRS VA e documento RADD in bozza |

## Sistemi o interfacce non ancora modellati in dettaglio

La SRS CCE via Email cita anche `pn-data-vault`, Safe Storage e canali esterni nel
processamento. Non li si assegna qui a una responsabilità completa del dominio:
consultare la specifica e la documentazione dei componenti prima di aggiungerli al
modello.

Distinguere sempre:

- **Zendesk** (piattaforma condivisa) da **CCE** (integrazione SEND usata
  dall'operatore);
- **ticket di assistenza** da **operazione SEND** avviata per soddisfare il ticket;
- **nuovo invio di notifica** da **invio via email di documenti/allegati di una
  notifica esistente**;
- **IVR** (instradamento telefonico) da **Assistente Virtuale** (automazione del caso
  Punti di Ritiro) e da **SMS** (canale di restituzione delle informazioni).

## Possibili sottosistemi logici — da validare

Non sono decisioni architetturali; servono come ipotesi per il prossimo ciclo MBSE:

- `SS-AS-01` — Accesso all'assistenza e apertura ticket;
- `SS-AS-02` — Supporto operatore e orchestrazione richieste SEND;
- `SS-AS-03` — Assistenza telefonica e instradamento IVR;
- `SS-AS-04` — Informazioni sui Punti di Ritiro e risposta automatizzata.

Verificare con gli owner se queste responsabilità sono coese, se ne esistono altre e
come si mappano ai componenti concreti.
