# DPoP Token
l'utilizzo di DPoP è nella discrezionalità dell'Erogatore che, al momento della definizione di un e-service può abilitare tale feature

l'abilitazione del DPoP obbliga i Frutori a produrre una DPoP Proof quando:

- richiede l'emissione di un access token a PDND
- effettua l'accesso all'e-service

In breve una DPoP Proof è un JWT in cui:

- nel Header JWT è veicolata la chiave pubblica utilizzata per firmare il JWT
- nel Payload del JWT ci sono i riferimenti, HTM e HTU, all'endpoint per cui la stessa è stata generata

in PDND è implementato https://www.rfc-editor.org/rfc/rfc9449 

un elenco completo degli access token (voucher nel nomenclatore PDND) emessi da PDND e maggiori indicaizoni sugli stessi nella page e sub page presenti all'URL https://developer.pagopa.it/it/pdnd-interoperabilita/guides/manuale-operativo-pdnd-interoperabilita/v1.0/riferimenti-tecnici/utilizzare-i-voucher 

# e-service template
gli e-service tempate sono uno strumento messo a disposizione degli Aderenti per semplificare il proceddo di definizione degli e-service

un e-service template e generato da un Aderente che lo mette a disposizione degli altri

un Aderente che deve definire un e-service PUO' insanziare un e-service template definito

maggiori dettagli nella page e sub page presenti all'URL https://developer.pagopa.it/it/pdnd-interoperabilita/guides/manuale-operativo-pdnd-interoperabilita/v1.0/riferimenti-tecnici/template-e-service 

