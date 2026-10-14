# UC-AS-04 — Ricevere indicazioni sui Punti di Ritiro tramite IVR

| Campo | Valore |
| --- | --- |
| Dominio | `DOM-AS` |
| Attore primario | `ACT-AS-04` — utente che telefona all'assistenza SEND |
| Componenti principali | `CMP-AS-05` IVR SEND, `CMP-AS-06` Assistente Virtuale, `CMP-AS-08` SMS |
| Stato | Requisito iniziale fornito dall'utente; dettaglio operativo documentato da fonti Confluence |

## Obiettivo

Permettere a un utente che chiama il numero di assistenza SEND di trovare i Punti di
Ritiro SEND vicini alla posizione indicata.

## Flusso documentato

1. L'utente chiama il numero dedicato all'assistenza SEND e seleziona l'opzione IVR
   prevista per i Punti di Ritiro.
2. Nel caso descritto dalla fonte del servizio, l'Assistente Virtuale serve l'opzione
   IVR 1.1 per chiamate da telefonia mobile con numero in chiaro.
3. L'utente fornisce un CAP o un indirizzo esteso come posizione di riferimento.
4. L'Assistente Virtuale individua i tre Punti di Ritiro più vicini.
5. Le informazioni (denominazione, indirizzo e numero di telefono) vengono inviate
   all'utente via SMS.

La richiesta iniziale dell'utente parla di una lista fornita “tramite IVR”; la fonte
descrive invece la raccolta della richiesta via IVR e la risposta via SMS, con
condizioni specifiche. Il dialogo vocale effettivo e l'eventuale disponibilità di una
risposta letta a voce vanno confermati.

## Fonti

- [I nuovi IVR per offrire assistenza su canale sincrono](https://pagopa.atlassian.net/wiki/spaces/OTS/pages/1494483104/I+nuovi+IVR+per+offrire+assistenza+su+canale+sincrono), versione 10, 25 marzo 2025.
- [Statistiche e Costi servizio VA - Punti di Ritiro SEND](https://pagopa.atlassian.net/wiki/spaces/OTS/pages/2459926702/Statistiche+e+Costi+servizio+VA+-+Punti+di+Ritiro+SEND), versione 25, 3 aprile 2026.
- [RADD Poste Italiane](https://pagopa.atlassian.net/wiki/spaces/PN/pages/3306455133/RADD+Poste+Italiane), live document in bozza, 5 ottobre 2026.

## Informazioni da validare

- copertura attuale del flusso, orari e opzioni IVR attive;
- eleggibilità del chiamante (mobile/fisso, caller ID nascosto o visibile);
- formato di localizzazione, conferma della posizione e comportamento per input
  ambiguo/non valido;
- fonte dati dei Punti di Ritiro, criterio di distanza e gestione di nessun risultato;
- provider SMS, costi e consenso/avviso all'utente;
- comportamento di fallback verso operatore e gestione di indisponibilità.
