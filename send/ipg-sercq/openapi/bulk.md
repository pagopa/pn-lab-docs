# pattern di interazione BULK

nell'ambito del MoDI è previsto il pattern di interazione [BULK_RESOURCE_REST] Richiesta Risorse Massive REST (vedi Allegato Pattern di interazione all'URL https://www.agid.gov.it/sites/agid/files/2024-07/Linee_guida_interoperabilit%C3%A0PA_All1_Pattern_interazione.pdf)

in breve il pattern, in applicazione di https://www.rfc-editor.org/rfc/rfc9110.html#name-range-requests permette di efficientare il trasferimento tra due soggetti, dando seguito ai seguenti passi:

1. il soggetto che produce la risorsa notifica al soggetto interessato l'id della stessa
2. il soggetto interessato recupera la risorsa utilizzando l'id ricevuto


in applicazione del pattern indicato, al passo 2 il soggetto interessato alla risorsa può decide di recuperare la risorsa a chunk, in questo modo è lo stesso che determina l'occupazione di banda del canale e, nel caso di interruzione del canale, può dare seguito al recupero della porzione ancora non recuperata