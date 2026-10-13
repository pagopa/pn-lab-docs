# Specifica di intervento SEND: evidenze XML ETSI nel modello black-box

**Stato:** proposta da approvare; non autorizza lo sviluppo.

**Revisione 2026-10-12:** prima implementazione con le sole strutture obbligatorie per evento secondo ETSI, confermata dal richiedente. Questa revisione sostituisce il precedente profilo XML arricchito; le fonti probatorie e i controlli interni non vengono eliminati.

## 1. Obiettivo, fonti e perimetro

### Contesto e finalita' dell'intervento

La piattaforma SEND opera attualmente come servizio elettronico di recapito certificato (ERDS) secondo il modello **black-box**, nel quale un unico servizio gestisce sia l'acquisizione del messaggio dal mittente sia la sua messa a disposizione al destinatario. Secondo il contesto fornito dal richiedente, il servizio e' gia' certificato e produce evidenze conformi ai requisiti normativi applicabili; tali evidenze, tuttavia, non sono attualmente rappresentate nel formato XML definito dallo standard **ETSI EN 319 522-3**.

L'intervento introduce la generazione delle evidenze nel formato XML ETSI, mantenendo nella prima fase il modello operativo black-box e le responsabilita' attuali di SEND. **Non si tratta di sanare una non conformita' normativa delle evidenze esistenti**, ma di adottare una rappresentazione standardizzata dei fatti attestati dal servizio, con strutture e significati definiti dagli standard ETSI.

L'adeguamento persegue due obiettivi:

- **Agevolare le attivita' di valutazione della conformita' e certificazione delle evoluzioni del servizio**, rendendo esplicita e verificabile la corrispondenza tra eventi applicativi SEND, informazioni attestate ed elementi previsti dagli standard.
- **Predisporre una base per la futura interoperabilita'**, disponendo di evidenze in un formato condiviso e gia' noto agli altri ERDS, cosi' da ridurre la necessita' di trasformazioni e mapping proprietari nel successivo passaggio al modello 4-corner.

La prima implementazione riguarda SubmissionAcceptance, ContentConsignment e ContentConsignmentFailure relative ai fatti di competenza di SEND, utilizzando le sole strutture obbligatorie per ciascun evento. Restano distinti gli interventi necessari per introdurre lo scambio tra ERDS: protocolli di comunicazione, relazioni di fiducia, routing, protezione dei contenuti e gestione delle evidenze emesse dal servizio remoto.

L'adozione del formato XML ETSI costituisce un **passo propedeutico**, non il completamento della transizione al modello 4-corner ne', da sola, una garanzia di interoperabilita' o certificazione. Consente di affrontare tale evoluzione partendo da un modello delle evidenze gia' standardizzato e verificabile. L'adeguamento non modifica retroattivamente le evidenze gia' emesse; modalita' di introduzione e coesistenza con gli artefatti attuali devono essere definite prima del rilascio.

### Risultato tecnico e perimetro

SEND deve produrre **una evidenza ERDS XML firmata per ciascun destinatario** all'accettazione definitiva della notifica ricevuta tramite `POST /delivery/v2.6/requests`. Ogni evidenza attesta l'accettazione del messaggio destinato a quel soggetto e identifica le parti di sua competenza. Le versioni e impronte esatte sono conservate internamente, non esportate nell'XML minimo. L'evidenza è recuperabile e predisposta al futuro scambio ERDS della POC Knodia, il cui binding dovrà definire la protezione dei contenuti. L'intera richiesta protetta da `INTEGRITY_REST_02` rimane fonte probatoria interna.

**Modello attuale confermato:** SEND opera come black-box, con responsabilità sia S-ERDS sia R-ERDS, senza relay verso Orion. Deve quindi produrre anche ContentConsignment o ContentConsignmentFailure per ciascun messaggio/destinatario sulla base dei propri eventi di messa a disposizione. Il modello 4-corner della POC è una futura evoluzione, non un prerequisito della generazione attuale.

La richiesta API rimane JSON. **L'evidenza è XML ETSI, non il JSON semplificato della POC.** Un eventuale envelope JSON di interoperabilità deve trasportare i byte dell'XML firmato senza ricostruirne il contenuto.

Fonti utilizzate:

- [OpenAPI SEND, branch develop](https://raw.githubusercontent.com/pagopa/pn-delivery/refs/heads/develop/docs/openapi/api-external-b2b-pa-bundle.yaml): `sendNewNotificationV26`, `NewNotificationRequestV26`, `NewNotificationResponse`, `NewNotificationRequestStatusResponseV26`, `NotificationRecipientV24`, `NotificationDocument` e schemi allegati.
- XSD fornito: `1952203xmlSchema.xsd`, namespace `http://uri.etsi.org/19522/v1#`.
- ETSI EN 319 522-1 V1.2.1, tabella 1 e semantica degli eventi; EN 319 522-2 V1.2.1, clausole 5, 7, 8 e tabella 13; EN 319 522-3 V1.1.1, clausola 5.2.
- eIDAS SAML Attribute Profile, sezione 2.1, richiamato da EN 319 522-3, 5.2.2.11: NameFormat obbligatorio. Requisito verificato nel documento del 28 ottobre 2016 e nella [versione 1.3 pubblicata dalla Commissione europea](https://ec.europa.eu/digital-building-blocks/sites/download/attachments/467109280/eIDAS%20SAML%20Attribute%20Profile%20v1.3%20Final.pdf).
- [AgID, Allegato 2 - Pattern di sicurezza](https://www.agid.gov.it/sites/agid/files/2024-07/Linee_guida_interoperabilit%C3%A0PA_All2_Pattern_sicurezza.pdf), sezione 5.3, `INTEGRITY_REST_02`.
- [POC Use Case 03](https://pagopa.atlassian.net/wiki/spaces/IT/pages/2912092247/POC+Use+Case+03).

Snapshot consultati il 2026-10-09, SHA-256:

| Fonte | SHA-256 |
|---|---|
| Bundle OpenAPI develop | `c1ff1c09456af5f77ac6dffa85496fc490ec43efa783fc1215f294c5409ca0a8` |
| XSD fornito | `e70a925ed77af50eed8fd459b7389ab9448f3f14a554de89c36db91be5695159` |

Il branch develop è mobile: l'implementazione deve fissare un commit/versione e verificare che lo schema corrisponda allo snapshot approvato.

### 1.1 Decisioni e assunzioni esplicite

- **Confermato dal richiedente:** `SubmissionAcceptance` si produce solo quando la richiesta diventa `ACCEPTED` con IUN. Non si produce in corrispondenza di HTTP 202.
- **Confermato dal richiedente:** per questa proposta sia `EventTime` sia `SubmissionTime` sono valorizzati con il timestamp della transizione a ACCEPTED. Il mapping è deterministico, ma la semantica di SubmissionTime richiede la verifica di conformità evidenziata in sezione 5.2.
- **Presupposto richiesto:** la chiamata acquisisce il profilo `INTEGRITY_REST_02`. Sono necessari trust, registrazione del client/chiave e verifica del legame tra client e PA mittente, non soltanto un nuovo header.
- **Decisione del richiedente, 2026-10-12:** con N destinatari, l'accettazione definitiva crea N obblighi di emissione, uno per ciascuna occorrenza `recipients[r]`. Ciascuna evidenza contiene un solo RecipientDetails e solo contenuti comuni o attribuiti a quel destinatario. Questa decisione sostituisce il precedente profilo multi-destinatario.
- **Decisione precedente aggiornata dal profilo minimo:** la proiezione JSON deterministica per destinatario resta parte del messaggio e del manifest interno. L'evidenza ne esporta soltanto Identifier/ContentType, non l'impronta. La firma XML non attesta crittograficamente i bytes della proiezione o la sua derivazione. Il body originale e il JWS PA restano internamente collegati: il JWS **non** firma la proiezione.
- **Confermato dal richiedente, 2026-10-12:** includere solo strutture obbligatorie secondo le cardinalità per evento di EN 319 522-2, tabella 13, i vincoli condizionati applicabili e il binding XML. Non limitarsi ai `minOccurs` dell'XSD: firma, policy, identificativi e assurance del mittente restano obbligatori semanticamente.
- **Firma minima:** XMLDSig enveloped individuale, obbligatoria. XAdES baseline e signature timestamp sono raccomandati (`should`), non imposti (`shall`) dalle clausole consultate; non sono inclusi in questa prima implementazione. La compatibilità di questa scelta con i requisiti del servizio qualificato deve essere approvata prima dell'uso operativo.
- **Limite accettato del profilo minimo:** i digest delle parti sono opzionali e non compaiono nell'evidenza. Rimangono verificati e conservati internamente. La firma protegge l'XML e i descrittori delle parti, ma da sola non permette al verificatore esterno di confrontare crittograficamente i bytes degli allegati con l'evidenza.
- La conformità XSD non basta: il generatore deve rispettare anche semantica, cardinalità per evento, policy, identità/assurance e firma. La conformità ETSI non costituisce, da sola, una nuova qualificazione del servizio.

Questa specifica definisce la costruzione di SubmissionAcceptance dalla POST accettata e delle evidenze di consignment dai successivi fatti interni SEND. La sola POST non permette di attestare consignment o fallimento: occorre il contesto di evento definito in sezione 11. I punti della timeline applicativa e la policy di recupero devono essere identificati sul sistema prima dello sviluppo.

### 1.2 Notifiche multi-destinatario

Il profilo SEND adotta **un'evidenza separata per ciascuna occorrenza di destinatario e per ciascun fatto attestato**. La separazione è una scelta progettuale di minimizzazione e predisposizione all'interoperabilità, non un obbligo generale ETSI: lo schema ammette più RecipientDetails.

Un unico invio può comprendere documenti comuni e allegati specifici, ad esempio avvisi di pagamento differenti. Ogni evidenza contiene un solo RecipientDetails e identifica in PartsInfo soltanto la proiezione, i documenti comuni e gli allegati del relativo scope. In questo modo non espone identificativi o riferimenti ai contenuti degli altri destinatari e associa senza ambiguità destinatario e parti, senza introdurre strutture opzionali. Nel profilo minimo questa associazione è descrittiva: i digest delle parti restano interni, come precisato in sezione 6.3.

La richiesta e la transizione a ACCEPTED restano uniche. Le N SubmissionAcceptance derivano dalla stessa coppia audit BEFORE/SUCCESS e condividono acceptedAt, ma hanno MessageIdentifier ed EvidenceIdentifier distinti per scope. **Non attestano N accettazioni indipendenti**; IUN e correlazioni con la richiesta complessiva rimangono interni. Con due destinatari si producono due SubmissionAcceptance totali, una per destinatario.

La granularità consente in futuro di scambiare con ciascun ERDS soltanto evidenza e contenuto del destinatario di sua competenza. I successivi fatti di consignment sono invece accertati separatamente per scope: disponibilità e fallimento possono avere esiti e tempi differenti tra destinatari.

Un'evidenza unica sarebbe un'alternativa per uso interno o della PA, ma non soddisfa altrettanto direttamente la distribuzione separata. Rimuovere dati da un XML già firmato invalida la firma; la proiezione dell'evidenza richiederebbe una nuova emissione e firma. Rimane il vincolo che documenti comuni e stringhe libere siano distribuibili ai destinatari associati: il frazionamento non ne redige automaticamente il contenuto.

## 2. Regola di emissione

Il contratto API dichiara HTTP 202 come validità sintattica della richiesta, non come accettazione definitiva. La risposta restituisce `notificationRequestId`, che **non è lo IUN**. Lo stato successivo distingue `WAITING`, `ACCEPTED` e `REFUSED`.

| Condizione | Comportamento obbligatorio |
|---|---|
| Integrity assente/invalida nel profilo abilitato | Rifiutare la richiesta prima dell'elaborazione applicativa; nessuna SubmissionAcceptance. |
| HTTP 202 / WAITING | Acquisire il contesto verificato; nessuna SubmissionAcceptance. |
| REFUSED | Nessuna SubmissionAcceptance. Conservare esito e motivazioni. |
| ACCEPTED con IUN, fonti complete, controlli superati e coppia audit BEFORE/SUCCESS valida | Registrare N obblighi di generazione, uno per destinatario, con lo stesso acceptedAt. |
| BEFORE o SUCCESS isolato / coppia non correlabile | Bloccare l'emissione e riconciliare; non dedurre né accettazione attestabile né fallimento applicativo dal solo record isolato. |
| Evento duplicato / replay del worker | Recuperare gli stessi N obblighi/evidenze, senza nuovi identificativi o duplicazioni. |
| Firma o generazione temporaneamente indisponibili | Evidenza in stato interno PENDING/FAILED_RETRYABLE, mai esposta come evidenza finale. Recuperare senza cambiare il fatto attestato. |

Il trigger è la transizione interna autorevole di SEND a ACCEPTED; non una chiamata GET del mittente, un webhook ricevuto da un consumer o il tempo del worker. La transizione deve salvare il proprio timestamp UTC `acceptedAt`, distinto da `sentAt`: il contratto descrive quest'ultimo come momento di ricezione, non come accettazione definitiva.

La fonte esistente è la coppia audit BEFORE/SUCCESS, conservata per 10 anni: non è richiesto un secondo registro indipendente dell'accettazione. Il generatore deve acquisire la coppia in modo recuperabile e registrare idempotentemente il lavoro per tutti i destinatari. Prima della transizione a ACCEPTED devono essere disponibili identità autorizzata, bytes acquisiti, versioni degli allegati e dati di configurazione necessari. L'accettazione resta della notifica complessiva: il frazionamento riguarda i messaggi e le evidenze, non introduce stati ACCEPTED parziali.

## 3. Acquisizione della richiesta e INTEGRITY_REST_02

### 3.1 Input di sicurezza e verifica

Il profilo deve prevedere:

- `Digest: SHA-256=<base64 del digest dei representation data>`;
- `Agid-JWT-Signature`: JWS compact, JOSE header con `alg`, `typ=JWT`, `kid`;
- claim `iat`, `exp`, `aud` e `signed_headers`, includendo Digest e Content-Type; Content-Encoding va incluso quando presente;
- per questo profilo SEND, anche `iss` e `jti` sono obbligatori. È un vincolo SEND aggiuntivo rispetto ai claim condizionati alla logica del servizio nel pattern AgID.

SEND deve verificare firma, algoritmo ammesso, trust della chiave, validità temporale, audience dell'e-service, corrispondenza degli header e digest del corpo. Deve vincolare `iss` e `kid` al client effettivamente autorizzato e tale client alla PA identificata da `senderTaxId`; non basta che il JSON contenga il codice fiscale desiderato.

Per rendere inequivocabile la relazione tra bytes ricevuti e digest, il profilo iniziale accetta UTF-8 e nessuna codifica di contenuto compressa: `Content-Encoding` deve essere assente. Il body conservato è la sequenza di bytes JSON HTTP, escluso il framing HTTP. Il gateway non deve riserializzare il JSON prima della verifica. UTF-8 non valido e chiavi JSON duplicate devono essere rifiutati prima della costruzione dello snapshot.

Un digest calcolato su un JSON ricostruito, riordinato o formattato è **vietato** come verifica del body originale.

### 3.2 Replay, idempotenza e compatibilità

- Rifiutare il riuso del medesimo `jti` durante la finestra protetta; un nuovo tentativo legittimo può usare un JWS nuovo.
- La deduplicazione del JWS non sostituisce l'idempotenza applicativa della richiesta SEND. Conservare il rapporto tra tenant PA, protocollo, idempotenceToken opzionale e richiesta effettivamente riconosciuta da SEND.
- Non introdurre un nuovo obbligo di `idempotenceToken`, oggi opzionale. Basare l'unicità della produzione sull'identificativo interno della richiesta accettata.
- Se SEND riconosce un tentativo come la stessa richiesta, riusare evidenza e snapshot del primo invio accettato. Non sovrascrivere il body originale con una successiva serializzazione equivalente.
- Se una richiesta riconosciuta come duplicata presenta contenuto semanticamente diverso, non sostituire silenziosamente la fonte: seguire la semantica di conflitto esistente.
- Attivare l'obbligo di integrity su un profilo/API versionata o su un perimetro esplicitamente concordato con le PA. I client legacy non devono essere dichiarati compatibili con il nuovo profilo senza inviare i dati richiesti.

Codici e payload degli errori devono essere definiti nell'OpenAPI del profilo riutilizzando `Problem`. Rifiuti crittografici/replay devono essere distinguibili da problemi JSON/digest e da indisponibilità temporanea del trust store; nessuna indisponibilità abilita un bypass.

### 3.3 Snapshot acquisito

Per ogni richiesta verificata SEND deve conservare, con accesso ristretto:

1. bytes esatti del body, digest calcolato e header firmati;
2. JWS originale, `kid`, client/tenant autorizzati, risultato e tempo della verifica;
3. materiale pubblico e versione delle regole sufficienti a riesaminare la verifica;
4. snapshot tipizzato del body e collegamenti alle versioni esatte degli allegati;
5. `notificationRequestId`, IUN quando disponibile e `acceptedAt`;
6. timestamp iniziale di acquisizione, policy e assurance verificati.

Non conservare bearer token o API key nelle fonti probatorie. Il JWS di integrity e gli altri artefatti sensibili vanno in un archivio probatorio protetto, non nei normali log. Il profilo minimo non esporta un transaction log XML.

## 4. Fonti del generatore: nessun valore implicito

Il generatore riceve un contesto composto da:

| Sorgente | Dati utilizzati |
|---|---|
| `verifiedRequest` | Body originale e JSON validato; senderTaxId; recipients nell'ordine originale; riferimenti e impronte degli allegati; esito integrity e legame PA/client. |
| `acceptanceEvent` | Contesto derivato dalla coppia audit BEFORE/SUCCESS correlata: identificativo del fatto, notificationRequestId, IUN e acceptedAt. Non è un nuovo evento probatorio indipendente dagli audit. |
| `acceptanceAuditPair` | Record originali BEFORE e SUCCESS, chiave della stessa esecuzione, riferimenti durevoli, tempi di registrazione e timestamp della transizione. Conservazione audit esistente: 10 anni. |
| `integrityVerification` | Esito PASSED, profilo INTEGRITY_REST_02, tempo e riferimento al controllo effettivamente eseguito sulla richiesta originale. Non dedotto dalla coppia audit. |
| `recipientContext` | Occorrenza originale r, recipientScopeId opaco e persistito, destinatario selezionato e MessageIdentifier dedicato. r non viene esposto nei nomi del messaggio o delle parti. |
| `resolvedContent` | Proiezione canonica del solo destinatario e manifest con documenti comuni e allegati di quel destinatario, bytes/versioni risolti e digest verificati. |
| `issuerProfile` | Identità effettiva dell'emittente SEND, policy URI, attributi legali verificati, livelli di identificazione/assurance, certificato e configurazione di firma. |

Le proprietà di `issuerProfile` sono **input obbligatori di deployment**, non informazioni presenti nel JSON PA. Devono essere versionate e validate all'attivazione del profilo. Le URI di policy e assurance devono identificare policy/livelli effettivamente applicati; non inserire URI eIDAS low/substantial/high per il solo fatto di aver verificato un JWS.

Il profilo iniziale ammette client che agiscono per la PA già autorizzata. L'eventuale invio da parte di un soggetto formalmente delegato richiede identificazione e assurance del delegato da un registro autorevole; `iss` identifica un client, non prova una delega. Tale caso non deve essere assimilato automaticamente al mittente diretto.

## 5. Mapping XML deterministico

### 5.0 Criterio di obbligatorietà e allowlist per evento

Il minimo rispetta congiuntamente i vincoli applicabili: struttura XSD, semantica EN 319 522-2 e binding EN 319 522-3, inclusi i profili richiamati. Un campo opzionale nell'XSD è mantenuto solo se obbligatorio per l'evento o per una condizione applicabile. Non rendere obbligatorio un campo opzionale attraverso una nuova policy SEND per aggirare il perimetro.

| Componente | SubmissionAcceptance A.1 | ContentConsignment D.1 | ContentConsignmentFailure D.2 | Fonte |
|---|---|---|---|---|
| EvidenceIdentifier, version, ERDSEventId, EventTime | Presenti | Presenti | Presenti | EN 319 522-2, tabella 13, G01/G02/G03/G05 |
| EvidenceIssuerPolicyID, EvidenceIssuerDetails/Identity | Presenti | Presenti | Presenti | R01/R02; XSD EntityDetailsType |
| SenderDetails/Identifier e RecipientDetails/Identifier | Presenti; un destinatario per scope | Presenti; un destinatario per scope | Presenti; un destinatario per scope | I02/I06 |
| SenderDetails/AssuranceLevelsDetails | Presente, senza delegato | Presente, senza delegato | Presente, senza delegato | I10/I11, nota (b); clausola 5.4 |
| MessageIdentifier e UserContentInfo/PartsInfo | Presenti | Presenti | Presenti | M01/M02; binding XML |
| SubmissionTime | Presente | Assente | Assente | M03: 1 per A.1; 0..1 per D.1/D.2 |
| EvidenceRefersToRecipient | Assente | Presente, valore 1 | Presente, valore 1 | I09 |
| EventReasons | Assente | Assente | Presente, almeno una reason effettiva | G04; clausola 8.2.4 per eventi negativi |
| ds:Signature | Presente nel documento finale | Presente nel documento finale | Presente nel documento finale | R03; EN 319 522-3, 5.2.2.28 |

**Strutture escluse in tutti e tre gli eventi:** TransactionLogInformation (G06 ammette zero istanze nella tabella 13), Extensions, CertificateDetails e Any nell'issuer, identità aggiuntive di mittente/destinatario, delegati, dettagli di autenticazione, policy/details/resources nei livelli di assurance, FederationAssuranceLevel, AppLayerIdentifier, ComposingParts e digest delle parti. ExternalERDSDetails e ForwardedToExternalSystem non sono applicabili al black-box.

EventReason contiene solo Code, senza Details. L'assurance usa il ramo a due livelli di sezione 5.1. Ogni PartInfo contiene solo Identifier e ContentType. I dati delle fonti che non sono nell'allowlist restano interni, non sono spostati in altri campi XML.

Per gli attributi SAML dell'issuer, NameFormat resta presente con valore `urn:oasis:names:tc:SAML:2.0:attrname-format:uri`: è opzionale nello schema SAML, ma obbligatorio nel profilo eIDAS richiamato da EN 319 522-3, 5.2.2.11 (eIDAS SAML Attribute Profile, 2.1). FriendlyName è invece omesso. AttributeValue è necessario per rappresentare il valore dell'identità, anche se lo schema generico SAML permette attributi privi di valori.

L'attributo Evidence/@Id, opzionale, è omesso: la firma referenzia l'intero documento mediante URI vuota. Gli esempi pre-firma omettono soltanto la firma obbligatoria e pertanto non sono evidenze finali. Anche il validatore del profilo deve rifiutare strutture opzionali, non solo verificare la presenza delle obbligatorie.

Prefissi: `e = http://uri.etsi.org/19522/v1#`, `ds = http://www.w3.org/2000/09/xmldsig#`, `saml = urn:oasis:names:tc:SAML:2.0:assertion`.

**Importante:** l'XSD fornito non imposta `elementFormDefault="qualified"`. Gli elementi globali richiamati con `ref` hanno namespace ETSI; gli elementi locali, ad esempio `EventTime`, `Code`, `Identifier`, `PolicyID`, `ComposingParts` e `ContentType`, non hanno namespace. Non usare un default namespace ETSI su tutto il documento.

| Elemento/attributo XML | Fonte e regola esatta nel profilo SubmissionAcceptance |
|---|---|
| `/e:Evidence` | Radice; UTF-8; ordine figli come `xs:sequence` dell'XSD. |
| `@version` | Costante `EN319522v1.1.1`, prevista dal binding EN 319 522-3 V1.1.1. Non `KNODIAUSECASE` né il nome del file XSD. |
| `@Id` | Assente nel profilo minimo; firma dell'intero documento mediante `ds:Reference/@URI=""`. |
| `e:EvidenceIdentifier` | `urn:uuid:<UUID dell'evidenza>`. UUID distinto per destinatario, generato una sola volta con vincolo su richiesta/evento/recipientScopeId/tipo. Non senderTaxId, IUN, recipientScopeId o jti. |
| `e:ERDSEventId` | `http://uri.etsi.org/19522/Event/SubmissionAcceptance`. |
| `e:EventReasons` | Assente in SubmissionAcceptance: reason opzionale per evento positivo. MessageAccepted resta la classificazione interna, non un campo esportato. |
| `EventReasons/.../Details` | Omettere nel profilo iniziale; la URI identifica già la motivazione. |
| `EventTime` | `acceptanceEvent.acceptedAt`, UTC con suffisso `Z`, precisione millisecondi. Mai l'istante di firma/esportazione, JWS iat o sentAt. |
| `e:EvidenceIssuerPolicyID/PolicyID` | Una o più URI da `issuerProfile.evidencePolicyUris`, ordine configurato e immutabile per questa evidenza. Almeno una obbligatoria per il profilo semantico, anche se opzionale nell'XSD. |
| `e:EvidenceIssuerDetails/e:Identity/saml:Attribute` | Attributi verificati dell'emittente da `issuerProfile.issuerIdentityAttributes`. Per persona giuridica almeno un attributo del profilo eIDAS legal person, con Name URI, NameFormat obbligatorio e AttributeValue effettivo; omettere FriendlyName opzionale. Valori certificati/configurati, non senderDenomination. |
| `e:EvidenceIssuerDetails/e:CertificateDetails` | Assente. Il certificato di firma e la catena restano disponibili attraverso il materiale di verifica del servizio; non duplicarli nei dettagli issuer. |
| `e:SenderDetails/Identifier` | Valore di `verifiedRequest.senderTaxId`, verificato contro l'ente autorizzato. Attributo `IdentifierSchemeName="urn:send:identifier-scheme:it:codice-fiscale"`. Questa URI è una scelta del profilo SEND, non una costante ETSI. |
| `e:SenderDetails/e:Identity` | Omettere nel profilo iniziale: il nome ricevuto non è trasformato in attributo di identità verificato. |
| `e:SenderDetails/AssuranceLevelsDetails` | Obbligatorio in questo caso senza delegato: costruzione secondo sezione 5.1, da onboarding e contesto di autenticazione verificati. |
| `e:SenderDelegateDetails` | Assente nel profilo mittente diretto. Non popolare con API key, JWT sub o iss. |
| `e:RecipientDetails/Identifier` | Un solo elemento, con `recipients[r].taxId` del destinatario selezionato e il medesimo IdentifierSchemeName del codice fiscale italiano. PF/PG non trasforma automaticamente il CF in partita IVA. |
| `e:RecipientDetails/e:Identity` | Omettere: denomination e taxId ricevuti non dimostrano identità verificata dal R-ERDS. |
| Assurance dei destinatari e delegati | Assenti nella submission: non esiste ancora un'autenticazione del destinatario attestabile da questo input. |
| `e:SubmissionTime` | `acceptanceEvent.acceptedAt`, identico a EventTime, secondo la decisione del richiedente. Vedere il rilievo semantico ETSI in sezione 5.2. |
| `EvidenceRefersToRecipient` | Assente: la tabella 13 non lo prevede per SubmissionAcceptance. L'unico RecipientDetails elimina l'ambiguità. Nei futuri eventi di recapito riferiti a questa lista mono-destinatario l'indice XML è 1, non r o il recIndex SEND. |
| `e:MessageIdentifier` | `urn:send:message:<recipientScopeId>`, con recipientScopeId UUID opaco assegnato una sola volta per richiesta/occorrenza r. Distinto per destinatario e stabile nei successivi relay. IUN e r sono correlati internamente, non inseriti nell'identificativo scambiato. |
| `e:UserContentInfo` | Manifest obbligatorio nel profilo semantico; algoritmo sezione 6. |
| `e:ExternalERDSDetails` | Assente per SubmissionAcceptance. Non valorizzare Orion prima di un evento inter-ERDS. |
| `ForwardedToExternalSystem` | Assente: acquisizione da PA e accettazione non attestano inoltro a un sistema esterno. |
| `e:TransactionLogInformation` | Assente. Audit, integrity e derivazione restano fonti interne secondo sezione 7. |
| `e:Extensions` | Assente nel profilo iniziale. Qualsiasi estensione richiede namespace e contratto approvati, non dati aggiunti arbitrariamente. |
| `ds:Signature` | Firma individuale enveloped dell'evidenza, obbligatoria alla pubblicazione: sezione 8. Ultimo figlio dell'Evidence. |

### 5.1 Assurance: costruzione senza inventare un livello

Usare il ramo a componenti separati previsto dall'XSD:

```text
AssuranceLevelsDetails                         [locale, senza namespace]
  e:AuthenticationDetsAndAssuranceLevel
    AssuranceLevel                            [locale]
      AssuranceLevel = issuerProfile.authenticationAssuranceUri
  IdentityProofAssuranceLevel                  [locale]
    AssuranceLevel = onboarding.identityProofAssuranceUri
```

Le sole due URI dei livelli di assurance sono esportate; PolicyID, PolicyIDDetails, PolicyIDDetailsResources, AuthenticationDetails e FederationAssuranceLevel sono omessi perché opzionali (EN 319 522-2, clausola 5.4). Le policy e i dettagli reali restano nel contesto interno. Tali livelli descrivono processi realmente eseguiti e riconducibili alla PA. La verifica di integrity è separata dall'autenticazione: registrare internamente come il client è stato autenticato e autorizzato. Onboarding o livelli mancanti, oppure client non riconducibile alla PA, impediscono l'abilitazione. Non omettere il ramo obbligatorio e non inventare livelli.

### 5.2 SubmissionTime: decisione e rilievo semantico ETSI

ETSI EN 319 522-2 definisce la submission come istante di avvio del processo da parte del mittente, distinto dall'accettazione. L'API corrente non contiene un timestamp esplicito di invocazione lato mittente; `iat` è l'emissione del JWS e non ne è prova.

**Decisione del richiedente per questa specifica:** il generatore assegna `SubmissionTime = EventTime = acceptanceEvent.acceptedAt`. Non usa tempo di ingresso, sentAt, iat o istante di lettura dello stato. L'uguaglianza deve essere controllata dal validatore del profilo SEND.

**Rilievo di conformità:** in SEND l'API ha già ricevuto la richiesta prima dell'accettazione asincrona. L'uguaglianza scelta non dimostra che il tempo di avvio del mittente coincida con l'accettazione. È ammessa sintatticamente dall'XSD, ma non va presentata automaticamente come conforme alla semantica della clausola 8.2.25.

Il mapping richiesto resta esplicito; prima di dichiarare piena conformità ETSI va validato con compliance. Se tale equivalenza non è giustificabile per il binding approvato, la specifica dovrà essere modificata per rappresentare un distinto istante di submission. Non nascondere il problema in una conversione del serializer.

## 6. UserContentInfo: proiezione e manifest per destinatario

Il messaggio attestato per l'occorrenza r è costituito da una **proiezione JSON per quel destinatario**, dai documenti comuni `documents[]` e dai soli allegati presenti in `recipients[r].payments[]`. Il body multi-destinatario non è una parte del messaggio distribuito e il suo digest non è inserito nel manifest pubblico.

La derivazione della proiezione dalla richiesta verificata è tracciata internamente. Non si presenta la proiezione come firmata direttamente dalla PA: una firma JWS sull'intero body non verifica un JSON filtrato. Originale, JWS, digest e regole di derivazione restano nell'archivio probatorio interno; il verificatore esterno può verificare la firma dell'XML e i descrittori delle parti, ma non la corrispondenza crittografica dei bytes o la firma PA senza un ulteriore meccanismo o accesso separatamente autorizzato alle fonti.

### 6.1 Costruzione deterministica della proiezione

Il profilo `recipient-projection:1` ha questa allowlist:

- radice: `profile = "urn:send:recipient-projection:1"`, `messageIdentifier`, `sender`, `notification`, `recipient`, `documents`;
- `sender`: `taxId = senderTaxId`, `denomination = senderDenomination`;
- `notification`: `subject` obbligatorio; `abstract`, `paymentExpirationDate`, `additionalLanguages` solo se presenti nel body;
- `recipient`: `recipientType`, `taxId`, `denomination` del solo `recipients[r]`; `payments` solo se presente, mantenendo ordine e oggetti pagoPa/f24 di quel destinatario;
- `documents`: un descrittore per ogni `documents[k]` in ordine, secondo la trasformazione qui sotto.

Gli oggetti di pagamento mantengono i campi API del destinatario selezionato (`noticeCode`, `creditorTaxId`, `applyCost` per pagoPa; `title`, `applyCost` per f24 e relativi allegati). Per ogni descrittore allegato, comune o di pagamento, copiare `digests.sha256`, `contentType` e, se presenti, `title` e `docIdx`; sostituire `ref` con `partIdentifier` assegnato dalla sezione 6.2. Non esportare key/versionToken o URL temporanei.

Omettere i campi assenti senza aggiungere null/default. Non copiare alcun campo fuori allowlist: protocollo, idempotenceToken, group, cancelledIun, IUN, indice originale r, indirizzi fisici/digitali e dati operativi non inclusi rimangono interni. I nuovi campi API richiedono revisione del profilo, non propagazione automatica.

Serializzare con **JSON Canonicalization Scheme RFC 8785**, UTF-8, senza BOM o newline aggiunto. Preservare ordine degli array e contenuto delle stringhe; non normalizzare Unicode o riscrivere nomi/taxId. Il digest è SHA-256 dei bytes canonici persistiti. Non è il digest del body originale; la verifica dell'integrity all'ingresso continua a operare sui bytes originali non riserializzati.

### 6.2 Costruzione e ordinamento delle parti

1. Prima parte: bytes canonici della proiezione r. Identifier `<MessageIdentifier>/parts/metadata`; ContentType `application/json`.
2. Poi `documents[k]` comuni, nell'ordine dell'array. Identifier `<MessageIdentifier>/parts/documents/<k>`; ContentType dal documento, oggi `application/pdf`.
3. Poi, per ogni `recipients[r].payments[p]`, aggiungere se presente `pagoPa.attachment`: Identifier `<MessageIdentifier>/parts/payments/<p>/pagoPa/attachment`.
4. Per il medesimo payment, aggiungere se presente `f24.metadataAttachment`: Identifier `<MessageIdentifier>/parts/payments/<p>/f24/metadataAttachment`; oggi `application/json`.

Solo k e p locali sono 0-based; nessun identificativo contiene r, il numero totale dei destinatari o il loro taxId. Se sono presenti sia pagoPa sia f24 nello stesso payment, seguire quest'ordine. Riferimenti ripetuti producono una parte per ogni occorrenza autorizzata, anche quando puntano agli stessi bytes. Nessuna parte degli altri destinatari deve comparire, neppure come solo digest.

`AppLayerIdentifier` e `ComposingParts` sono omessi. `PartsInfo` contiene un `e:PartInfo` per ogni parte, nell'ordine appena definito; il numero di parti si ricava dal numero dei figli. Il manifest interno mantiene anche versioni e digest, ma non viene serializzato integralmente nell'XML.

Per ogni PartInfo:

```text
e:PartInfo
  Identifier = identificativo deterministico della parte
  ContentType = tipo del contenuto validato
```

`docIdx` e `title` non determinano l'identificativo: il primo è opzionale e il secondo non identifica univocamente il documento. Non usare URL temporanei o `ref.key` senza versione come identità del contenuto.

### 6.3 Verifica degli allegati e limiti dell'input

Per ogni allegato, risolvere la coppia `ref.key` + `ref.versionToken` e verificare che il digest sui bytes esatti coincida con `digests.sha256`. Il valore API è **già base64 del digest binario**: non farne un secondo hash e non codificarlo nuovamente in base64. Conservare il digest verificato nel manifest interno; non serializzare DigestMethod/DigestValue in PartInfo.

La proiezione mantiene i campi `digests.sha256` già definiti nel suo contratto JSON: non sono strutture dell'evidenza XML. Anche la sua impronta rimane interna. La firma del solo XML minimo non copre i bytes della proiezione o degli allegati, ma soltanto i loro Identifier/ContentType. Una verifica esterna dei bytes richiede un ulteriore meccanismo approvato: non dichiararla garantita da questo profilo.

Conservare una copia/versione durevole dei bytes accettati: il riferimento al caricamento temporaneo non basta per una prova recuperabile nel tempo. Una diversa versione, digest errato, tipo di contenuto incoerente o allegato indisponibile impediscono l'accettazione per il profilo.

Un documento F24 prodotto in seguito, un avviso generato da SEND o un documento modificato dopo l'accettazione non è un input di questa submission e non deve essere aggiunto retroattivamente al manifest. Avrà una propria provenienza e, se necessario, un evento distinto.

Nel contratto API corrente `documents[]` è comune a tutti i destinatari; gli allegati di pagamento sono invece associati a `recipients[r]`. Non dedurre un'assegnazione di documenti privati da title, docIdx o nomi dei file. Se si vogliono documenti principali diversi per destinatario, occorre estendere il contratto con un'associazione esplicita e aggiornarne il mapping prima dell'accettazione.

### 6.4 Minimizzazione e contenuti comuni

Il mittente deve inviare subject, abstract e documenti comuni distribuibili a ciascun destinatario. Il frazionamento non redige automaticamente un PDF comune che contiene dati personali di altri soggetti, né garantisce l'assenza di dati estranei dentro stringhe libere. SEND deve rendere esplicito tale vincolo del profilo e gestire non conformità senza modificare silenziosamente i bytes attestati. La selezione per destinatario elimina la divulgazione strutturale di altri recipients/payments, non sostituisce la corretta classificazione del contenuto da parte della PA.

I campi API conservati nel body originale non vanno trasformati in identità verificata, assurance o evento di recapito. Ad esempio paymentExpirationDate non è scadenza del relay. Il recupero di proiezione e allegati applica lo stesso scope dell'evidenza anche quando lo storage sottostante deduplica un documento condiviso.

## 7. Audit e integrity: fonti interne, non strutture dell'evidenza

Il profilo minimo **non include TransactionLogInformation né TransactionLog**. EN 319 522-2, tabella 13, ammette zero o più istanze di G06; la clausola 8.2.6 prescrive contenuto e policy quando il componente è incluso, non ne rende obbligatoria la presenza per questi eventi. Il precedente `s:SubmissionRecord`, con AcceptanceAudit e IntegrityCheck, è rimosso e il namespace custom SEND non viene dichiarato nell'XML.

La **coppia audit esistente BEFORE/SUCCESS** resta una precondizione obbligatoria di generazione, conservata per 10 anni. L'assenza del componente nell'evidenza non elimina i controlli, la conservazione o la possibilità di riesaminare le fonti con accesso autorizzato.

### 7.1 Regole della coppia audit

- BEFORE è scritto prima dell'operazione; SUCCESS solo dopo il completamento del cambio di stato.
- I due record devono avere stessa chiave di esecuzione/tentativo, operazione di accettazione, richiesta e tenant. Lo stesso IUN da solo non è sufficiente a correlare tentativi differenti.
- SUCCESS deve attestare lo stato finale ACCEPTED e permettere la correlazione all'IUN assegnato. Il timestamp della transizione alimenta acceptedAt; i tempi di scrittura/ingestione dei log non lo sostituiscono.
- Entrambi i record devono essere conservati e recuperabili. La conservazione per 10 anni è dichiarata dal richiedente; verificare sul sistema i campi e il momento effettivo di scrittura, senza affermare che siano già presenti.
- BEFORE isolato o SUCCESS isolato indica incompletezza/anomalia, non prova di mancato cambio di stato. Attendere eventuali ritardi di acquisizione secondo policy, poi allertare e riconciliare; non inventare il record mancante.
- Duplicati della stessa coppia non generano nuove evidenze. Una coppia incoerente o appartenente a esecuzioni diverse non è valida. Correzioni e recuperi devono mantenere tracciabilità delle fonti.

La stessa coppia può supportare tutte le N evidenze della notifica, ma il suo contenuto multi-destinatario e i suoi riferimenti non vengono esportati. Non servono alias di log per la distribuzione ordinaria.

### 7.2 Correlazione interna e controllo integrity

Per ogni EvidenceIdentifier/MessageIdentifier, il contesto interno conserva requestId, IUN, r, recipientScopeId, chiave di esecuzione, riferimenti agli audit originali e relativi tempi, SourceEventId derivato dalla coppia, digest del body originale, JWS originale e suo digest, kid, client, trust material, profilo congelato, derivazione della proiezione, versioni e digest delle parti.

Il controllo integrity conserva separatamente profilo INTEGRITY_REST_02, esito effettivo, verifiedAt e risultati di firma/digest/audience/validità/anti-replay. Esito PASSED è ammesso solo dopo tutte le verifiche, mai dedotto dalla coppia audit. Esito mancante/non riuscito blocca l'emissione. acceptedAt resta il tempo del fatto, non verifiedAt o recordedAt.

Nessuno di questi dati è copiato nell'XML o nascosto in Identifier, ContentType, policy o attributi SAML. Non conservare Authorization, API key, chiavi private o URL con credenziali. Il contesto normalizzato di fixture rappresenta queste fonti interne, non un payload di evidenza.

## 8. Firma dell'evidenza e pubblicazione

Il JWS della PA protegge la richiesta; **non sostituisce** la firma SEND dell'evidenza. Lo XSD rende ds:Signature opzionale, ma EN 319 522-2, clausola 7.1, richiede la firma individuale e EN 319 522-3, clausola 5.2.2.28, la firma enveloped.

Il signer deve:

1. Firmare l'intero documento mediante `ds:Reference URI=""`, digest del documento XML e trasformazioni enveloped/canonicalizzazione approvate; rifiutare riferimenti esterni o firme che coprono solo una porzione. Evidence/@Id non è necessario.
2. Usare la struttura XMLDSig minima: SignedInfo (CanonicalizationMethod, SignatureMethod, Reference con trasformazioni, DigestMethod e DigestValue) e SignatureValue. DigestMethod/DigestValue della firma sono necessari: non sono i digest opzionali di PartInfo. Omettere KeyInfo, Object e attributi Id/Type non necessari.
3. Usare il certificato/identità dell'emittente SEND e una chiave protetta. Il contratto di consultazione deve fornire separatamente, in modo affidabile e univoco per ogni evidenza, il certificato e l'intera catena; le informazioni di stato devono essere disponibili per qualsiasi verificatore secondo EN 319 522-2, 7.1. Il certificato deve essere legato alla configurazione congelata dell'evidenza, non selezionato da input non fidato.
4. Non aggiungere SignedProperties XAdES, SignaturePolicyIdentifier o SignatureTimeStamp nel profilo minimo. Gli standard ETSI consultati raccomandano baseline e timestamp; eventuali obblighi ulteriori del servizio qualificato costituiscono un gate di compliance, non un motivo per dichiararli facoltativi ai fini della qualifica.
5. Validare XSD, regole semantiche e firma del documento finale prima della pubblicazione.
6. Persistire i bytes firmati e il loro SHA-256, poi rendere disponibile l'artefatto `application/xml`.

Un worker non deve produrre nuove varianti firmate a ogni retry di una stessa evidenza già pubblicata. La versione pubblicata è immutabile. Una firma non riuscita lascia l'artefatto non pubblicabile, con errore visibile e retry.

Il profilo crittografico concreto (algoritmi ammessi, canonicalizzazione, certificato, disponibilità del materiale pubblico, validazione e conservazione) deve essere approvato prima dello sviluppo. Senza approvazione della compatibilità con i requisiti del servizio qualificato, il profilo minimo resta una proposta non utilizzabile per dichiarare la qualifica delle nuove evidenze. Non è lecito dichiarare qualificata una firma usando soltanto il kid del client PDND.

## 9. Pipeline, unicità e contratto di consultazione

```text
bytes POST + header
 -> verifica integrity, autenticazione, autorizzazione PA
 -> snapshot durevole e parsing OpenAPI
 -> verifiche applicative e bytes/versioni degli allegati
 -> BEFORE -> cambio stato ACCEPTED con IUN/acceptedAt -> SUCCESS
 -> correlazione e verifica coppia audit + controllo integrity
 -> N obblighi durevoli (recuperabili dalla coppia)
 -> per ogni r: recipientScopeId, evidenceId e contesto congelati
 -> proiezione canonica r + documenti comuni + soli allegati r
 -> mapping XML mono-destinatario + validazione semantica/XSD
 -> firma SEND XMLDSig minima + verifica finale per evidenza
 -> persistenza bytes firmati e parti dello scope r
 -> evidenza r disponibile per consultazione e futuro relay
```

Vincolo di unicità: `(identificativo interno richiesta, SourceEventId, recipientScopeId, SubmissionAcceptance)`. recipientScopeId è unico e persistito per `(richiesta, occorrenza originale r)`. Non usare taxId come chiave: se il contratto ammette occorrenze ripetute, restano scope distinti. Il registro riconosce la transizione una sola volta anche se il bus cambia ID di consegna.

Il fan-out deve essere recuperabile: una registrazione durevole può enumerare gli N destinatari e riconciliare tutti gli obblighi. Il fallimento di firma per uno scope non rigenera o invalida gli artefatti AVAILABLE degli altri. La completezza di emissione della notifica richiede N evidenze AVAILABLE; lo stato della singola evidenza non deve fingere il completamento globale.

Stati interni minimi: PENDING, SIGNING, AVAILABLE, FAILED_RETRYABLE, FAILED_PERMANENT. AVAILABLE implica XML finale valido e verificabile; non implica trasmissione a Orion.

La consultazione deve restituire l'artefatto firmato originale dello scope autorizzato e distinguerlo dall'assenza/pending/errore. La PA mittente può elencare le proprie N evidenze; destinatario o peer può recuperare solo quella del proprio scope e le sue parti, non l'elenco degli altri scope. Gli ID opachi non sostituiscono autorizzazione per tenant/destinatario/peer. Originale multi-destinatario, JWS PA e registro probatorio non sono disponibili al destinatario tramite il recupero ordinario. Non cambiare implicitamente NewNotificationResponse: il recupero richiede un contratto dedicato/versionato.

## 10. Criteri di accettazione e test

| Test | Esito richiesto |
|---|---|
| POST valida, integrity verificata, HTTP 202 | Nessuna SubmissionAcceptance disponibile. |
| Successiva ACCEPTED con IUN, N destinatari e coppia audit valida | N evidenze XML con stesso acceptedAt e N EvidenceIdentifier/MessageIdentifier distinti, correlati internamente all'IUN. |
| Timestamp XML del profilo richiesto | SubmissionTime=EventTime=acceptedAt; la verifica semantica ETSI rimane un gate distinto dalla validazione XSD. |
| WAITING o REFUSED | Nessuna SubmissionAcceptance. |
| BEFORE e SUCCESS della stessa esecuzione, ACCEPTED e integrity PASSED | Emissione ammessa; fonti correlate internamente, nessun estratto audit/integrity nell'XML. |
| Solo BEFORE / solo SUCCESS | Emissione bloccata, anomalia e riconciliazione; non generare failure dal solo log incompleto. |
| BEFORE e SUCCESS dello stesso IUN ma di tentativi differenti | Coppia rifiutata, nessuna emissione. |
| SUCCESS acquisito prima di BEFORE per ritardi nel trasporto log | Attendere la coppia e riconciliare secondo policy; nessuna emissione prematura. |
| Audit validi ma controllo integrity mancante/non riuscito | Nessun PASSED inventato, emissione bloccata. |
| SUCCESS registrato dopo acceptedAt | EventTime e SubmissionTime conservano il tempo del fatto, non quello del log o del worker. Nessun campo custom AcceptedAt. |
| Digest body alterato, firma errata, audience/tenant errati, scadenza, jti riusato | Rifiuto tracciato; nessuna emissione. |
| Header Content-Type non firmato / Content-Encoding presente | Rifiuto secondo profilo iniziale. |
| Chiavi JSON duplicate / UTF-8 invalido | Rifiuto prima dello snapshot tipizzato. |
| PDF/versione/digest difforme o mancante | Nessuna accettazione con manifest apparentemente valido. |
| Due destinatari con PDF comune e avvisi diversi | Ogni XML ha un solo RecipientDetails e PartsInfo con proiezione propria, PDF comune e solo avviso del proprio destinatario. Assenti taxId e riferimenti dell'altro; nessun digest delle parti esportato. |
| Proiezione JSON e originale PA | Digest della proiezione calcolato sui bytes JCS e conservato internamente; verifica del JWS sui bytes originali. La firma XML non è una firma dei bytes della proiezione. |
| Modifica del solo avviso del destinatario B | La proiezione e il manifest A non cambiano, a parità di messaggio A e contenuti comuni. |
| Campi non ammessi o nuovi campi API | Nessuna propagazione automatica nella proiezione; profilo versionato. |
| Documenti, pagoPa attachment, metadata F24 | Manifest scoped nell'ordine specificato; digest verificati, nessun documento generato successivamente. |
| SenderTaxId non corrisponde alla PA autorizzata | Rifiuto, non firma dell'identità auto-dichiarata. |
| Policy/assurance/trust mancanti | Profilo non abilitabile; nessun valore inventato. |
| Crash nel fan-out o doppia consegna evento | Tutti gli N obblighi recuperati, stessi ID per scope, nessuna duplicazione. |
| Firma indisponibile per un destinatario | Gli altri artefatti restano immutati; completamento globale solo con N AVAILABLE. |
| Retry dopo modifica configurazione | Riusa snapshot/profilo dell'evento; non cambia i dati dell'evidenza già pubblicata. |
| XML con namespace default su tutti i figli | Il test deve rilevare la non conformità ai namespace dell'XSD fornito. |
| XML conforme XSD ma senza policy, assurance, firma, contenuto | Validazione semantica/finale fallisce; non pubblicare. |
| Firma valida, poi alterazione di identifier/contentType/evento | Verifica firma fallisce. |
| Bytes di allegato modificati, XML minimo invariato | Il controllo interno rileva il digest difforme; la sola verifica della firma XML non può rilevarlo. Non dichiarare una garanzia esterna inesistente. |
| Firma indisponibile | Nessuna pubblicazione unsigned; errore e recupero verificabili. |
| Struttura opzionale aggiunta, anche se XSD-valida | Validatore del profilo minimo rifiuta: transaction log, digest parti, dettagli assurance, reason positiva, SubmissionTime in D.1/D.2 e altre strutture escluse. |
| ContentConsignment senza reason e senza SubmissionTime | Ammesso con gli altri componenti obbligatori, EvidenceRefersToRecipient=1 e firma finale. |
| ContentConsignmentFailure senza reason | Rifiutato; Code del motivo effettivo è obbligatorio, Details è escluso. |
| Accesso di altra PA / altro destinatario / peer senza scope | Negato anche conoscendo l'ID; nessun accesso ad altre evidenze, parti o originale multi-destinatario. |

Test di unità sull'allowlist per evento, mapping e manifest interno, integrazione acquisizione/ACCEPTED/persistenza, fault injection della pipeline, validazione XSD offline con dipendenze fissate, verifica XMLDSig con materiale pubblico separato e regression delle API SEND. Occorrono fixture con bytes JSON e allegati, JWS di test e trust/certificati di test: un esempio XML pre-firma non dimostra conformità crittografica né accettazione della API.

### 10.1 Esempio input -> XML e limiti della fixture

- [Body API di esempio](fixtures/submission-request.json): due destinatari A/B, un PDF comune e avvisi pagoPa differenti. Bytes UTF-8 esatti, incluso il newline finale. SHA-256 base64 interno: `iM/v2PznFXm/+Z8t2XalDRI4lnjfE59tpy6VhHrLo5M=`.
- Contesto evento di esempio: requestId `AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`, IUN `ABCD-EFGH-IJKL-202610-M-1`, sourceEventId `test-acceptance-event`, acceptedAt `2026-10-09T15:00:05.000Z`.
- [Contesto audit di esempio](fixtures/acceptance-audit-context.json): coppia BEFORE/SUCCESS della stessa esecuzione, controllo integrity separato e collegamenti interni ai due scope. È un contesto sintetico normalizzato, non lo schema dei log reali SEND; non viene esportato nell'evidenza.
- [Proiezione A](fixtures/recipient-a.projection.json) e [proiezione B](fixtures/recipient-b.projection.json): serializzate canonicamente senza newline, digest rispettivamente `sYaOZsn1Xc5idrxxpWpmF10Kr7MkuhHPsTlXvksVRz4=` e `o9EGm3VUUb1OForhh8qmkhY2EPNpBTvZm/MUBG1zoUM=`.
- [XML A prima della firma](fixtures/submission-acceptance.pre-sign.xml) e [XML B prima della firma](fixtures/submission-acceptance.recipient-b.pre-sign.xml): ciascuno con un destinatario e tre parti (proiezione, PDF comune, proprio avviso). MessageIdentifier opachi differenti, correlati internamente all'IUN.
- [Consignment positivo](fixtures/content-consignment.pre-sign.xml) e [consignment negativo](fixtures/content-consignment-failure.pre-sign.xml): esempi dello scope A, rispettivamente con contenuto disponibile e fallimento tecnico definitivo in cicli/scenari alternativi. Non rappresentano due esiti dello stesso ciclo reale. Non hanno SubmissionTime; solo il negativo ha EventReasons.
- Le URI `urn:send:test-only:*` e il nome dell'issuer sono configurazione fittizia, non assurance reali. Non è stata verificata una firma PA.
- Il PDF e un JWS firmato non sono inclusi: il digest dichiarato del documento non è stato verificato contro bytes PDF in questa fixture. La firma manca perché l'artefatto precede il signer; il certificato è escluso dall'XML per scelta del profilo minimo e deve essere disponibile separatamente in produzione.

La fixture verifica mapping e sintassi XML, non il completamento della pipeline o la conformità finale del servizio. Non usare il JSON come richiesta operativamente accettabile senza tutti i controlli applicativi.

Verifiche della revisione minima: validazione XSD offline delle quattro fixture XML pre-firma, allowlist e ordine dei componenti per A.1/D.1/D.2, assenza di strutture opzionali, isolamento per destinatario e corrispondenza di tempi/identificativi al contesto interno. Proiezioni e loro digest restano invariati. Le regole della coppia audit e dell'integrity richiedono controlli interni anche senza un transaction log XML. Le verifiche sono su fixture, non sul servizio SEND; nessun test su audit reali, API, bytes PDF, JWS o firma XMLDSig operativa.

### 10.2 Ambiente di implementazione e comandi

Non è stato esaminato il repository applicativo SEND: stack, nomi dei moduli, test runner e comandi build non sono inventati in questa proposta. Devono essere aggiunti dopo l'approvazione della specifica e l'accesso al repository.

Per verificare il formato con gli strumenti XML:

```bash
xmllint --noout docs/specs/fixtures/submission-acceptance.pre-sign.xml
XML_CATALOG_FILES=/percorso/catalog.xml xmllint --nonet --noout \
  --schema /percorso/1952203xmlSchema.xsd \
  docs/specs/fixtures/submission-acceptance.pre-sign.xml \
  docs/specs/fixtures/submission-acceptance.recipient-b.pre-sign.xml \
  docs/specs/fixtures/content-consignment.pre-sign.xml \
  docs/specs/fixtures/content-consignment-failure.pre-sign.xml
```

Il catalogo deve risolvere offline gli import xml.xsd, XMLDSig, SAML e le dipendenze XML Encryption; non scaricare schemi arbitrari durante la validazione in produzione. L'esempio pre-firma controlla la struttura XSD, **non** è un'evidenza finale pubblicabile.

### 10.3 Struttura logica e convenzioni

Confini applicativi da integrare nei moduli SEND esistenti: verificatore ingress; repository snapshot; trigger di accettazione; manifest resolver; mapper XML; validatore semantico/XSD; signer; repository artefatti; consultazione. I moduli fisici e i file saranno definiti nella successiva fase di piano.

Usare parser/model tipizzati e serializer XML, non concatenazioni di stringhe. XML e schema devono essere validati con risoluzione esterna disabilitata e dipendenze fidate; il validatore delle firme deve impedire signature wrapping e riferimenti esterni non autorizzati.

## 11. ContentConsignment e ContentConsignmentFailure nel black-box SEND

### 11.1 Eventi e condizioni di emissione

**Confermato dal richiedente:** ContentConsignment significa che il contenuto completo, inclusi gli allegati di competenza, è effettivamente accessibile al destinatario autenticato su SEND. Non richiede che il destinatario abbia già effettuato login o prelevato i documenti: attesta la disponibilità attraverso il percorso di accesso autenticato, non un accesso avvenuto.

Il trigger deve attestare congiuntamente:

- messaggio del destinatario pubblicato e recuperabile nel percorso SEND;
- autorizzazioni applicate al destinatario corretto e isolamento dagli altri scope;
- tutte le parti del manifest di consignment disponibili, integre e nelle versioni dichiarate;
- eventuali documenti di pagamento generati per quel destinatario già pronti, se inclusi nel contenuto da rendere disponibile.

Registrare durevolmente `consignedAt` e un SourceEventId applicativo solo dopo questi controlli. L'invio di un avviso, una PEC/SMS, il perfezionamento giuridico, ACCEPTED o la sola creazione di un link non sono trigger sostitutivi.

**Confermato dal richiedente:** ContentConsignmentFailure è emesso solo quando SEND accerta l'impossibilità definitiva di rendere disponibile il messaggio completo, dopo i recuperi previsti dalla policy. Un tentativo fallito, un timeout, mancato login/prelievo o un guasto al signer non costituiscono questo fatto.

Il fatto di fallimento contiene `failureDeclaredAt`, motivo classificato, ID del fatto e versione della policy di recupero applicata. Numero di tentativi, scadenze e condizioni di definitività sono parametri da approvare, non valori deducibili dall'API. Non emettere un evento negativo prima di avere classificazione e decisione definitive.

### 11.2 Mapping XML: differenze rispetto alla submission

Per ciascuna evidenza riutilizzare sender, issuer, policy, assurance del mittente verificati e il medesimo MessageIdentifier del destinatario. L'emittente è il prestatore SEND in tutti e tre gli eventi, non la PA mittente o un ipotetico Orion.

| Campo | ContentConsignment | ContentConsignmentFailure |
|---|---|---|
| EvidenceIdentifier | Nuovo UUID persistito per fatto/tipo/destinatario, distinto dalla submission; Id assente | Medesima regola, distinto dalla submission e dagli altri eventi; Id assente |
| ERDSEventId | `http://uri.etsi.org/19522/Event/ContentConsignment` | `http://uri.etsi.org/19522/Event/ContentConsignmentFailure` |
| EventReasons/EventReason/Code | Assente: reason opzionale per evento positivo; classificazione MessageConsignedToRecipient solo interna | URI ETSI del motivo effettivo, da tabella 11.3; obbligatoria per l'evento negativo, senza Details |
| EventTime | `consignedAt` UTC | `failureDeclaredAt` UTC, non il tempo del primo tentativo o della firma |
| RecipientDetails | Un solo destinatario, dello stesso scope della submission | Stessa regola |
| EvidenceRefersToRecipient | **1**, dopo RecipientDetails e prima di MessageIdentifier nell'XML minimo | **1**, stessa posizione; non l'indice originale della richiesta |
| SubmissionTime | Assente: opzionale per D.1 | Assente: opzionale per D.2 |
| UserContentInfo | Manifest dello snapshot completo effettivamente reso disponibile, come in 11.4 | Manifest del contenuto che SEND doveva rendere disponibile; non dichiara che le parti siano accessibili |
| ExternalERDSDetails / ForwardedToExternalSystem | Assenti nel black-box | Assenti nel black-box |
| ds:Signature | Firma individuale SEND XMLDSig minima secondo sezione 8 | Medesima regola |

Non aggiungere identità/assurance del destinatario dedotte dal solo fatto di disponibilità: per questi eventi il controllo degli accessi è una precondizione, non prova di un'autenticazione già compiuta dal destinatario.

### 11.3 Classificazione dei motivi di fallimento

Registro di mapping basato su EN 319 522-2, tabella 10:

| Fatto accertato da SEND | EventReason URI |
|---|---|
| Quota del destinatario superata, se effettivamente applicata dal servizio | `http://uri.etsi.org/19522/EventReason/MessageNotConsignedForQuota` |
| Malfunzionamento tecnico che impedisce definitivamente la messa a disposizione | `http://uri.etsi.org/19522/EventReason/MessageNotConsignedForMalfunction` |
| Tipo del messaggio non ammesso per il destinatario secondo una regola applicata | `http://uri.etsi.org/19522/EventReason/MessageNotConsignedForUnallowedType` |
| Destinatario non registrato, solo se la registrazione è davvero un requisito del servizio | `http://uri.etsi.org/19522/EventReason/MessageNotConsignedForUnregisteredRecipient` |

Non usare la reason quota per ogni errore. In particolare, mancata registrazione di un account o mancato login non implicano fallimento se SEND consente al destinatario di accedere autenticandosi successivamente. Non usare `S_ERDSP_ReceivedNoDeliveryInfoFromR_ERDSP`: nel black-box non esiste un peer da cui attendere tale informazione.

Per una causa non mappata, il processo deve segnalare esplicitamente il blocco e richiedere una revisione del registro/policy; non fabbricare una reason generica né attestare successo. Details è escluso; la diagnostica resta interna.

### 11.4 Manifest di consignment e contenuti generati dopo ACCEPTED

Se il contenuto reso disponibile coincide con quello accettato, copiare il manifest della submission e le sue parti immutabili. Non ricalcolare la proiezione da dati correnti mutabili.

Se SEND genera documenti aggiuntivi, ad esempio un PDF F24 a partire dai metadati già accettati, la submission resta invariata. Costruire uno snapshot di contenuto di consignment distinto e versionato internamente:

1. mantenere le parti originarie e i loro digest;
2. aggiungere solo documenti generati per quel destinatario, con versione durevole e digest dei bytes verificati;
3. assegnare a ciascun documento generato un ID opaco stabile `<MessageIdentifier>/parts/generated/<UUID>` e ordinare queste parti per ID dopo le parti originarie;
4. aggiornare PartsInfo con Identifier e ContentType; conservare internamente numero di parti, digest e legame tra documenti generati e input/procedura che li hanno prodotti;
5. rendere disponibile ogni parte del manifest completo prima di dichiarare consignment.

Il documento generato non è attribuito alla firma PA: è contenuto prodotto da SEND. Se una parte generata non può essere costruita e improntata, il manifest negativo identifica le parti note dell'ultimo snapshot atteso (almeno quello accettato); il registro interno conserva la parte mancante e la causa, senza digest fittizi. L'evidenza negativa non attesta una consegna completa.

### 11.5 Registro, pipeline e recupero

Il registro distingue **stato del contenuto** da **stato di generazione delle evidenze**. Un guasto di firma di ContentConsignment lascia quell'evidenza PENDING: non genera ContentConsignmentFailure se il contenuto è disponibile.

Un singolo ciclo di messa a disposizione ha esito terminale consigned oppure failed, applicato atomicamente per scope; non emettere entrambi a causa di worker concorrenti. Il replay riusa lo stesso ID. Un successivo recupero dopo un fallimento dichiarato richiede un nuovo ciclo autorizzato e fatti correlati, senza cancellare o riscrivere l'evidenza precedente; questa riapertura richiede policy esplicita.

Non esiste un log distribuito di consignment nel profilo minimo. Il registro interno collega fatto, ciclo, timestamp, policy, snapshot/manifest ed esito alla precedente coppia di accettazione e al controllo integrity. La coppia di accettazione non prova il nuovo evento: occorre una fonte del fatto di disponibilità/fallimento. L'eventuale coppia BEFORE/SUCCESS per il consignment deve essere verificata sul processo reale, non presunta a partire da quella di ACCEPTED.

La registrazione del fatto e del relativo obbligo di emissione deve essere durevole e recuperabile indipendentemente dall'ordine di completamento delle firme. Consignment può essere accertato mentre la firma della submission è ancora pending, purché il fatto ACCEPTED sia già supportato dalla coppia audit valida e dal contesto verificato. La completezza dell'accettazione resta N SubmissionAcceptance AVAILABLE; la completezza dei successivi esiti va monitorata separatamente per destinatario/ciclo.

### 11.6 Interventi e verifiche aggiuntivi

- Collegare il percorso di pubblicazione/accesso SEND a un evento durevole di disponibilità completa, con isolamento destinatario e verifica degli allegati.
- Implementare classificatore e policy di fallimento definitivo, distinguendo guasti transitori e problemi della pipeline probatoria.
- Estendere mapper e validatore per le cardinalità D.1/D.2: EvidenceRefersToRecipient=1, reason negativa obbligatoria, issuer SEND.
- Implementare snapshot di contenuto, correlazione e idempotenza per tipo/fatto/ciclo/destinatario, senza modificare la submission.
- Testare: ACCEPTED senza contenuto disponibile non emette consignment; contenuto completo disponibile emette un solo evento positivo; guasto transitorio non emette failure; fallimento definitivo emette reason corretta; mancato login non emette failure; signer indisponibile non cambia l'esito applicativo; replay/concorrenza non producono esiti terminali contraddittori; nessuna evidenza contiene parti di altri destinatari.

**Limite di verifica:** le fixture XML A.1/D.1/D.2 sono esempi strutturali pre-firma del profilo minimo, non evidenze operative o test di integrazione eseguiti.

### 11.7 Futura evoluzione 4-corner

In futuro, per un messaggio inoltrato a Orion, le evidenze di consignment devono essere emesse dal servizio responsabile della disponibilità su Orion e verificate/conservate da SEND con issuer originale. Il black-box attuale non genera eventi RelayAcceptance/RelayRejection/RelayFailure senza uno scambio inter-ERDS reale. SubmissionRejection e ContentHandover richiedono mapping separati e non sono aggiunti implicitamente al perimetro attuale.

## 12. Interventi richiesti e confini

La capacità richiede interventi su ingress/API security, acquisizione e conservazione delle fonti, correlazione/riconciliazione audit ACCEPTED, messa a disposizione del contenuto per destinatario e fallimento definitivo, generatore/validatore XML minimo, firma e consultazione con materiale di verifica separato. È una modifica applicativa, non un dossier di assessment.

**Sempre:** verificare le fonti; preservare bytes/versioni; distinguere istanti e ruoli; fallire esplicitamente; validare semantica, schema e firma; conservare l'evidenza originale.

**Approvare prima dello sviluppo:** compatibilità ETSI di SubmissionTime=acceptedAt e della scomposizione in submission per destinatario; profilo di proiezione/manifest interno; schemi identificativi SEND; policy/assurance; firma XMLDSig minima e sua compatibilità con i requisiti del servizio qualificato; disponibilità separata del materiale di verifica; campi reali audit e soglie di riconciliazione; rollout API e recupero scoped; eventi timeline che attestano disponibilità completa; soglie/regole di fallimento definitivo, documenti generati e policy di eventuale riapertura.

**Mai:** riserializzare il body per verificarne l'integrity; presentare la proiezione come firmata dal JWS PA; divulgare ad altri scope body/JWS o allegati privati; dedurre autenticazione del destinatario dalla POST; firmare un handover avvenuto su Orion; usare KNODIAUSECASE come versione ETSI XML; pubblicare un artefatto unsigned/XSD-only come evidenza finale.

L'approvazione della specifica sblocca il piano tecnico sul repository SEND; non sono state implementate API o capacità applicative in questa sessione.
