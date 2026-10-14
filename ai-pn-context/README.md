# Indice del contesto

Usa questo indice per caricare solo il contesto pertinente al task. Le fonti
Confluence collegate sono autorevoli per quanto documentano, ma possono avere versioni,
stati e date diversi: controlla sempre i metadati nel documento sorgente.

## Mappa

```text
ai-pn-context/
├── AGENTS.md
├── README.md
└── domains/
    └── assistenza-send/
        ├── README.md
        ├── domain.md
        ├── actors-and-components.md
        ├── relationships.md
        └── use-cases/
            ├── UC-AS-01-ticket-cittadini.md
            ├── UC-AS-02-ticket-imprese.md
            ├── UC-AS-03-invio-documenti-email-cce.md
            └── UC-AS-04-punti-ritiro-ivr.md
```

## Regola di caricamento per l'agente

1. Apri sempre il `README.md` del dominio che riguarda il task.
2. Leggi `domain.md` per confini, scopo e stato delle informazioni.
3. Aggiungi `actors-and-components.md` e `relationships.md` solo se servono a capire
   struttura o interazioni.
4. Apri solo il caso d'uso interessato; non caricare tutti i casi d'uso per default.
5. Consulta le fonti Confluence collegate prima di cambiare o descrivere il comportamento
   corrente. In caso di divergenza, segnala la divergenza: non risolverla per inferenza.
6. Se la domanda riguarda un dominio non presente in questo indice, non dedurre la
   risposta dalla vista generale della piattaforma, dal nome di un componente o da
   conoscenza esterna. Dichiara che il dominio non è ancora documentato e quindi non
   puoi rispondere in modo affidabile.
7. Per una domanda che attraversa domini, rispondi solo sulla parte coperta da
   Assistenza SEND e dichiara esplicitamente i limiti per le altre parti.

## Domini

- **Unico dominio documentato:** [Assistenza del prodotto SEND](./domains/assistenza-send/README.md),
  relativo all'assistenza dai portali, all'integrazione CCE con la piattaforma aziendale
  e al supporto telefonico/IVR.

## Perimetro della conoscenza

Esistono altri domini di SEND, ma non sono ancora documentati in questo contesto. La
loro esistenza non autorizza a rispondere a domande sul loro funzionamento, sui relativi
casi d'uso, sottosistemi, componenti o relazioni. Fino alla pubblicazione di un dominio
con fonti e contenuti validati, usa una risposta esplicita come:

> Non posso rispondere in modo affidabile su questo argomento: il dominio non è ancora
> documentato nel contesto strutturato disponibile. Al momento è documentato solo il
> dominio Assistenza del prodotto SEND.
