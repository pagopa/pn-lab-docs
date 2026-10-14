# Istruzioni per l'agente: contesto strutturato SEND

Per ogni richiesta che riguarda dominio, casi d'uso, sottosistemi, componenti o
architettura funzionale di SEND:

1. Leggi prima [`README.md`](./README.md) e segui il suo perimetro e le
   regole di caricamento selettivo.
2. L'unico dominio SEND attualmente documentato è **Assistenza del prodotto SEND**
   (`DOM-AS`). Gli altri domini esistono, ma non sono ancora documentati.
3. Se la richiesta riguarda un dominio non documentato, non dare una risposta
   sostanziale né colmare i vuoti usando conoscenza generale, documentazione
   architetturale generica, nomi di componenti o inferenze. Rispondi esplicitamente:

   > Non posso rispondere in modo affidabile su questo argomento: il dominio non è
   > ancora documentato nel contesto strutturato disponibile. Al momento è documentato
   > solo il dominio Assistenza del prodotto SEND.

4. Per domande miste, rispondi solo alla parte che rientra nel dominio Assistenza SEND e
   dichiara il limite per le parti non documentate.
5. Anche dentro Assistenza SEND, distingui fatti forniti dall'utente, contenuti delle
   fonti e punti da validare. Non presentare bozze o SRS come prova automatica del
   comportamento attuale.

Queste istruzioni si applicano alle richieste sul modello di dominio SEND, non alle
attività generiche di sviluppo o manutenzione di questo repository.
