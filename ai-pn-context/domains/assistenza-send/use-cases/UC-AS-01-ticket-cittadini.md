# UC-AS-01 — Aprire un ticket dal Portale Cittadini

| Campo | Valore |
| --- | --- |
| Dominio | `DOM-AS` |
| Attore primario | `ACT-AS-01` — cittadino autenticato |
| Sistema primario | `CMP-AS-01` — Portale Cittadini |
| Stato | Caso fornito dall'utente; dettaglio di integrazione documentato in SRS Confluence |

## Obiettivo

Permettere a un cittadino autenticato di raggiungere il form di assistenza e aprire una
richiesta relativa al prodotto SEND.

## Flusso noto

1. Il cittadino autenticato avvia la richiesta di assistenza dal Portale Cittadini.
2. La SRS Confluence descrive una pagina/form di richiesta supporto nel portale e
   un'integrazione backend SEND con `pn-zendesk-auth`.
3. Il backend restituisce dati usati dal frontend per accedere alla form Zendesk.
4. Il cittadino compila e invia il ticket sulla piattaforma di assistenza.

I passi 2–4 sono una sintesi della SRS; verificare flusso e implementazione correnti
prima di considerarli AS-IS. La SRS consultata specifica che l'utente è autenticato e
che l'email di contatto inserita per la richiesta non viene verificata rispetto
all'identità dell'utente; riferisce inoltre che il dato viene inoltrato a Zendesk e
non memorizzato dal servizio descritto. Verificare che questa scelta sia ancora valida.

## Risultato atteso

Ticket SEND presentato alla piattaforma di assistenza. Conferma, identificativo ticket,
categorizzazione e messaggi di errore non sono definiti in questa baseline.

## Fonti

- [SRS: Integrazione UX cittadini per apertura ticket di assistenza](https://pagopa.atlassian.net/wiki/spaces/PN/pages/982253664/SRS+Integrazione+UX+cittadini+per+apertura+ticket+di+assistenza), versione 43, 9 settembre 2025.
- [RFC 3.0 - Segnalazioni di utenti identificati nei portali di PagoPA](https://pagopa.atlassian.net/wiki/spaces/OTS/pages/643170305/RFC+3.0+-+Segnalazioni+di+utenti+identificati+nei+portali+di+PagoPA), citato dalla SRS.

## Informazioni da validare

- trigger UI e condizioni di visibilità del pulsante;
- attributi di contesto SEND passati al ticket (prodotto, utente, notifica);
- dati personali raccolti, informativa e retention;
- comportamento per errore di autenticazione, indisponibilità Zendesk o chiusura
  dell'utente;
- differenza tra il form per destinatari e le altre esperienze SEND.
