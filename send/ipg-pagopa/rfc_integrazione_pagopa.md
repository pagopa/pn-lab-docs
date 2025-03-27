# Proposal 1

## Stelle Polari 

- SEND non è responsabile del prezzo dell'avviso; SEND è responsabile di comunicare , a colui che deve gestire il pagamento, i costi di notifica. Se applicare o meno i costi di notifica è una scelta dell'Ente ed esula dalla piattaforma notifiche. 
- SEND è una piattaforma autonoma dalle altre piattaforme di PagoPA.


Diagramma ad alto livello : 
- L'ente invia una notifica attraverso PN 
- PN elabora la modalità di comunicazione ( ed i costi associati )
- PN invia la notifica al cittadino ( digitale/cartacea )
- il Cittadino effettua il pagamento 

Il flusso dell'aggiornamento dei costi di notifica
```mermaid
sequenceDiagram
    actor user as "Cittadino"
    box  rgba(17, 71, 197, 0.41) PN
    participant ec as "EC"
    participant pn as "Piattaforma Notifica"
    end
    box rgba(17, 188, 197, 0.2)  pagoPA
    participant psp as "PSP"
    participant pagopa as "pagoPA"
    participant ec_partner as "EC pagoPA PT"
    end 

    ec ->> pn : Invio Notifica 
    pn -->> ec: Ok 
    note over pn : PN ha preso in carico la notifica
    pn ->> pn: Elabora costi
    pn ->> user : invia notifica
    note over user : Riceve la notifica  con un avviso
    user ->> psp: Paga Notifica
    activate psp 
    note over psp: Flusso di Pagamento PSP 
    psp ->> pagopa : AttivaPagamento()
    pagopa -->> ec_partner : paAttivaPagamento()
    activate ec_partner
    ec_partner ->> pn : verificaCosti
    pn ->> pn : RecuperoCosti
    alt notificaSEND
        pn -->> ec_partner : CostoNotica 
        
    else notifica not SEND
        pn -->>ec_partner : 404 Not Found 
    end
    ec_partner ->> ec_partner: Aggiorna Costi
    
    ec_partner -->> pagopa : RispostaAttivazione 
    pagopa -->> psp : Activate 
    note over psp : il PSP ha bloccato la sessione di pagamento
    deactivate psp
```