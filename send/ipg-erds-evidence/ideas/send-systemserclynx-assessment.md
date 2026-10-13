# Evoluzione di SEND per la produzione delle evidenze ERDS

**Revisione 2026-10-12:** capitolo realizzativo della prima implementazione, con le sole strutture obbligatorie ETSI per evento. Il contratto di costruzione campo per campo e le fonti normative sono nella [specifica XML SEND](../specs/send-etsi-submission-evidence.md), che prevale su questo riepilogo. Il precedente modello JSON KNODIAUSECASE e il transaction log XML arricchito non sono più previsti.

## 1. Obiettivo e risultato atteso

La piattaforma SEND opera attualmente come ERDS secondo il modello **black-box**, svolgendo sia le responsabilita' di acquisizione del messaggio dal mittente sia quelle di messa a disposizione al destinatario. Secondo il contesto fornito dal richiedente, il servizio e' gia' certificato e le evidenze attuali sono conformi ai requisiti normativi applicabili, ma non adottano il formato XML definito da **ETSI EN 319 522-3**.

L'intervento adatta la rappresentazione delle evidenze al formato XML ETSI, senza cambiare nella prima fase il modello operativo o le responsabilita' di SEND. **Non sana una non conformita' normativa delle evidenze esistenti:** introduce una rappresentazione standardizzata dei fatti applicativi gia' attestati dal servizio.

Gli obiettivi sono **agevolare la valutazione della conformita' e la certificazione delle evoluzioni del servizio**, attraverso un mapping esplicito e verificabile degli eventi e delle informazioni attestate, e **predisporre il futuro interscambio tra ERDS**, riducendo trasformazioni e mapping proprietari grazie a un formato condiviso.

Il risultato atteso e' la generazione, conservazione e consultazione per destinatario delle evidenze XML dei fatti di competenza di SEND, con le sole strutture obbligatorie per evento. Il passaggio al modello 4-corner e il collegamento a Knodia/Orion restano successivi: richiedono anche protocolli di scambio, trust, routing, protezione dei contenuti e gestione delle evidenze remote.

L'adozione del formato ETSI e' quindi **propedeutica**, non sufficiente da sola a garantire interoperabilita' o certificazione. Non modifica retroattivamente le evidenze gia' emesse; introduzione e coesistenza con gli artefatti attuali devono essere definite prima del rilascio.

Per una richiesta con N occorrenze di destinatari, SEND produce N SubmissionAcceptance all'accettazione definitiva e, successivamente, ContentConsignment oppure ContentConsignmentFailure per ogni scope/ciclo. HTTP 202 non è accettazione; la disponibilità completa sul percorso autenticato non richiede che il destinatario abbia già effettuato login. Un guasto transitorio o l'indisponibilità del signer non costituiscono un fallimento definitivo del contenuto.

### 1.1 Notifiche multi-destinatario

Per una notifica indirizzata a più destinatari, il profilo SEND prevede **un'evidenza separata per ciascun destinatario e per ciascun fatto attestato**. Si tratta di una scelta progettuale di minimizzazione e predisposizione all'interoperabilità, non di un obbligo generale del formato ETSI, che ammette anche evidenze con più destinatari.

Un unico invio della PA può contenere documenti comuni e allegati specifici, ad esempio avvisi di pagamento differenti. Ogni evidenza identifica quindi un solo destinatario e le sole parti del messaggio di sua competenza: la proiezione dei metadati, i documenti comuni e i suoi allegati. Questa separazione evita che la distribuzione dell'evidenza esponga identificativi o riferimenti ai contenuti degli altri destinatari e rende inequivocabile l'associazione tra destinatario e parti del messaggio, senza introdurre strutture XML opzionali.

La richiesta del mittente e la sua accettazione restano uniche: **N SubmissionAcceptance non rappresentano N accettazioni indipendenti**, ma N attestazioni riferite ai singoli destinatari, derivate dalla medesima transizione a ACCEPTED, con lo stesso acceptedAt e la stessa coppia audit BEFORE/SUCCESS interna. Ogni scope ha MessageIdentifier ed EvidenceIdentifier distinti; IUN e correlazioni con la richiesta complessiva rimangono interni.

La scelta permette inoltre, nella futura configurazione 4-corner, di inoltrare a ciascun ERDS soltanto l'evidenza e il contenuto del destinatario di sua competenza. Gli esiti successivi possono differire tra destinatari: per ciascuno si produce ContentConsignment oppure ContentConsignmentFailure sulla base del fatto effettivamente accertato. Con due destinatari si generano quindi due evidenze di accettazione totali, non due evidenze di accettazione per destinatario.

Un'evidenza unica potrebbe essere adatta all'archivio interno o alla consultazione della PA mittente, ma non soddisfa altrettanto direttamente l'obiettivo di distribuzione separata. Non è possibile rimuovere dall'XML già firmato i dati degli altri destinatari senza invalidarne la firma. La separazione delle evidenze non elimina eventuali dati estranei presenti nei documenti comuni: questi devono essere distribuibili a tutti i destinatari cui sono associati.

## 2. Perimetro XML minimo

Il criterio è l'obbligatorietà ETSI per evento, non la sola obbligatorietà XSD. Restano identificativi dell'evidenza e dell'evento, versione, EventTime, policy e identità dell'issuer SEND, identificativi di mittente e destinatario, assurance obbligatoria del mittente diretto, MessageIdentifier, UserContentInfo/PartsInfo e firma individuale enveloped.

- SubmissionAcceptance include SubmissionTime, ma non EventReasons.
- ContentConsignment include EvidenceRefersToRecipient=1, ma non SubmissionTime o EventReasons.
- ContentConsignmentFailure include EvidenceRefersToRecipient=1 e il Code del motivo effettivo, ma non SubmissionTime o Details.
- PartInfo contiene solo Identifier e ContentType.
- AssuranceLevelsDetails contiene i due livelli obbligatori di autenticazione e identificazione, senza dettagli di autenticazione o policy aggiuntive.

Sono esclusi transaction log XML, AcceptanceAudit/IntegrityCheck custom, Extensions, CertificateDetails nell'issuer, delegati non applicabili, AppLayerIdentifier, ComposingParts e digest delle parti. Il profilo di firma minimo non aggiunge XAdES o timestamp raccomandati; certificato e catena devono essere disponibili separatamente per la verifica.

**Limiti espliciti:** la firma protegge l'XML, non prova da sola la corrispondenza crittografica dei bytes degli allegati privi di digest nell'evidenza. L'omissione di baseline/timestamp richiede approvazione rispetto ai requisiti del servizio qualificato. Anche SubmissionTime=acceptedAt resta un punto di conformità da approvare, non una conseguenza della validità XSD.

## 3. Task da realizzare su SEND

### T01 - Integrare INTEGRITY_REST_02 nell'acquisizione API

Estendere il contratto di POST /delivery/v2.6/requests e verificare firma JWS, digest sui bytes originali, header firmati, trust, audience, validità e anti-replay. Vincolare il client alla PA autorizzata, senza dedurre identità/assurance dal solo JSON.

**Accettazione:** input invalidi sono rifiutati esplicitamente; nessun bypass o riserializzazione prima della verifica. **Verifica:** casi negativi di firma, digest, tenant, replay e header.

### T02 - Conservare snapshot, allegati e contesto probatorio interno

Preservare body e JWS originali, risultato integrity, versioni esatte degli allegati e digest verificati. Acquisire identità issuer, policy e livelli di assurance effettivamente applicati. Non introdurre un secondo registro probatorio dell'accettazione: riutilizzare gli audit esistenti.

**Accettazione:** le fonti sono recuperabili e protette, senza segreti di autenticazione. **Verifica:** risoluzione versioni, controlli digest e accessi autorizzati.

### T03 - Correlare la coppia audit BEFORE/SUCCESS

Acquisire i due record della stessa esecuzione/tentativo, richiesta, operazione e tenant, conservati per 10 anni. SUCCESS deve supportare ACCEPTED, IUN e acceptedAt del cambio di stato. Un record isolato richiede riconciliazione: non prova necessariamente un mancato cambio di stato.

**Accettazione:** solo una coppia valida con integrity riuscita abilita N obblighi durevoli di emissione. Nessun audit o riferimento audit è esportato nell'XML. **Verifica:** log mancanti, fuori ordine, duplicati o di tentativi differenti; recordedAt non sostituisce acceptedAt.

### T04 - Costruire gli scope e il contenuto per destinatario

Assegnare MessageIdentifier opaco e stabile per ogni occorrenza, mantenendo IUN e indice originale interni. Costruire la proiezione JSON canonica, documenti comuni e soli allegati del destinatario. Conservare internamente versioni, digest e derivazione; esportare in PartsInfo solo Identifier e ContentType.

**Accettazione:** nessun riferimento ad altri destinatari o loro allegati. **Verifica:** due destinatari con avvisi differenti; modificare B non modifica il contenuto A.

### T05 - Implementare mapper e validatore del profilo XML minimo

Applicare l'allowlist per A.1/D.1/D.2 della specifica, rispettando ordine e namespace dello schema fornito. Rifiutare strutture opzionali anche se XSD-valide. L'issuer è il prestatore SEND, non la PA mittente.

**Accettazione:** tutti e soli i componenti obbligatori dell'evento sono presenti; assenza di dati obbligatori blocca la generazione. **Verifica:** fixture XSD offline, controlli semantici positivi e negativi.

### T06 - Collegare consignment e fallimento definitivo ai fatti SEND

Individuare il punto che attesta disponibilità completa, integrità e accessi scoped. Definire policy di recupero e classificazione del fallimento definitivo. La coppia audit di accettazione non prova il successivo consignment: serve una fonte del fatto specifico.

**Accettazione:** un solo esito terminale per scope/ciclo, con reason obbligatoria solo per il negativo. **Verifica:** disponibilità incompleta, guasti transitori, mancato login, concorrenza e documenti generati dopo ACCEPTED.

### T07 - Firmare, validare e archiviare ogni evidenza

Firmare l'intero documento mediante XMLDSig enveloped con Reference URI vuota, senza Evidence/@Id opzionale. Verificare firma, schema e regole semantiche prima di pubblicare. Garantire la disponibilità affidabile del certificato, della catena e delle informazioni di stato per la verifica separata.

**Accettazione:** nessuna evidenza unsigned pubblicata; bytes finali immutabili, stessi ID nei retry. **Verifica:** alterazione XML, riferimenti incompleti/esterni, indisponibilità signer e recupero.

### T08 - Rendere recuperabili evidenze e parti con isolamento

Definire consultazione versionata: la PA può accedere alle proprie evidenze; il destinatario solo al proprio scope. Non esportare body/JWS multi-destinatario o fonti interne nel recupero ordinario. Distinguere assenza, pending ed errore.

**Accettazione:** recupero dell'originale firmato e materiale pubblico di verifica; nessuna perdita nel fan-out. **Verifica:** crash, replay, recupero N obblighi e accesso negato tra tenant/scope.

## 4. Dipendenze e gate prima dello sviluppo

T01/T02 precedono il mapping probatorio; T03/T04 alimentano T05; T06 estende i fatti supportati; T07 precede la disponibilità finale T08. Il piano sui moduli reali SEND segue l'approvazione della specifica.

Occorre approvare: compatibilità con i requisiti del servizio qualificato del profilo crittografico minimo; semantica SubmissionTime=acceptedAt; scomposizione per destinatario; policy/livelli di assurance e identificativi; campi reali e tempi di riconciliazione audit; trigger di disponibilità e regole di definitività.

## 5. Evoluzione futura e verifiche disponibili

Il futuro relay verso Orion richiederà protezione del messaggio e dei bytes dei contenuti secondo il binding approvato, senza presumerla dalla firma del solo XML minimo. Quando il recapito avviene su Orion, le evidenze del fatto remoto conservano l'issuer originale; SEND non le genera come fatti propri. Eventi relay e handover non sono inclusi implicitamente nella prima fase.

Le [fixture](../specs/fixtures/) illustrano due SubmissionAcceptance e scenari alternativi di consignment positivo/negativo. Sono XML pre-firma con identità fittizie: i controlli strutturali non dimostrano il funzionamento operativo SEND o la qualifica delle nuove evidenze.
