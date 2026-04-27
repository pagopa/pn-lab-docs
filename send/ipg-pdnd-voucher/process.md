# Flusso di autenticazione Servizio PDND

Al fine di poter fruire del servizio SEND tramite PDND , l'Ente (aka fruitore) dovrà : 

1. Sottoscrivere contratto SEND
2. Richiedere richiesta di fruitore sul catalogo PDND
3. Accettata la richiesta potrà procedere con l'utilizzo del servizio 


## Sottoscrizione del contratto

Il processo di sottoscrizione avviene su piattaforma Area Riservata. Il processo è già in essere, al termine del processo tutte le PA che hanno sottoscritto un contratto sono disponibili presso .. 
<TBD>


## Richiesta di fruizione


```mermaid
  sequenceDiagram
    participant ea as "Ente Aderente"
    participant pn as SEND 
    participant pdnd as "PDND"

    ea ->> pdnd : Richiesta Fruizione (SEND)

    loop Every X Hours 
    note over pn : SEND avvia il processo di autorizzazione dell'erogazioni pending 
    pn ->> pdnd GET: get /agreements (PENDING,eserviceIds==SEND) 
    pdnd -->> pn : 200 -OK Array [agreementId]
        loop for each agreementId 
        pn ->> pdnd : GET /agreements/{agreementId}
        pdnd -->> pn : AgremmentModel (consumerId)
        note over pn : Traduce il consumerId in un identificativo esterno 
        pn ->> pdnd : GET /tenants/{consumerId}
        pdnd -->> pn : 200-OK externalId (origin,value)
        pn ->> on : check ExternalId 
            alt exist 
            pn ->> pdpd : Accept Agreement POST /agreements/{agreementId}/approve 
            pn ->> pn : Map clientId <-> ApiKey 
            else
            pn ->> pdnd : Reject Agrrement POST /agreements/{agreementId}/reject
            end
        end
    end
```

## Utilizzo del Servizio 

Quando l'Ente Aderente, dopo aver ottenuto la richiesta di fruizione, potrà

1. Staccare un token pdnd
2. Richiamare il servizio utilizzando token pdnd

``` mermaid
sequenceDiagram 

    participant ea as "Ente Aderente"
    participant pdnd as "PDND"
    participant pn as "SEND"

    ea ->> pdnd : request token 
    pdnd -->> ea : 200-OK tokenBearer
    ea ->> pn : Any message ( Auth: BearerToken)
    note over pn : valida il token JWT. <br/> Se il token è valido la Lambda estrae un identificativo univoco (client_id) e lo mappa a una API Key di API Gateway, impostando usageIdentifierKey
    pn ->> pn : Auth_check ()
    pn ->>pn : operation 
    pn -->> ea : MessageResponse
```