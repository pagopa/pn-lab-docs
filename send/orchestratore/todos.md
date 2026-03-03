# Liste delle attività


- Servizio PDND 
- API per EC 
- Spedizione di una raccomandata semplice (RS)
- Interrogazione servizi PDND per recuperare i dettagli del destinario (mail,telefono,indirizzo )
    - ANPR - Servizio di Comunicazione C002 ( indirizzo )
    - INAD - Domicilio Digitale 
- Creazione di una campagna
- Accettazione di messaggio 
- Processamento di una notifica 


## Servizio PDND. - Andrea ? - 
Obiettivo di questa attività è esporre un Servizio all'interno del catalogo PDND dell'Orchestratore ed abilitare un processo per ricedere la fruizione del servizio solo in caso di contratto SEND abilitato.
Bisogna tenere in considerazione che, a seguito di tale fruizione l'ente dovrà:

- Delegare L'orchestratore come ente aggregatore su IO 
- Delegare l'orchestratore a chiamare su PDND per nome e conto proprio

## API per EC -Andrea-
Obiettivo di questa attività è definire openAPI e linee guida per l'utilizzo del servizio Orchestratore

## Spedizione raccomandata semplice (RS) -Vincenzo-
Obiettivo di questa attività è rendere fruibile all'interno della piattaforma SEND un servizio per l'invio di una RS associata ad una campagna. 
La spedizione dovrà essere pianificata dopo aver assicurato TUTTE le spedizioni SEND , ovvero l'ordine di procedenza sarà : 

- Messaggi SEND con modulo commessa (in ordine basato sul modulo commessa, as-is)
- Messaggi SEND senza modulo commessa (in ordine di arrivo)
- Messaggi Orchestratore (in ordine di arrivo)

## Interrogazione PDND -Andrea -
Obiettivo di questa attività e definire un servizio fruibile all'interno della piattaforma SEND che pemetta l'interrogazione del catalogo servizi PDND per recuperare informazioni del destinatario utilizzando le chiavi di autenticazione dell'ente mittente della notifica.
In particolare dovremmo essere in grado di : 

- Verificare il CF  (ADE)  
- Recuperare indirizzo fisico del destinatario (ANPR-Servizio di COmunicazione C002)
- Recuperare domincilio digitale ( INAD)

## Servizio IO 
- Creazione Campagna ( gia esiste o da creare)
- Invio Messaggio
- Get Messaggio 

## Gestione Campagna


## Validazione 
Processo di validazione di una comunicazione : 

- Congruità dei dati 
- Pagamenti ( verificare il pagamento e gestire allegati )
- Dati distanatario


## Workflow 
- Invio IO
- Invio Mail 
- Invio SMS 
- Invio PEC

