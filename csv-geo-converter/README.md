# Conversione CSV dei punti Poste

Lo script converte un file con lo schema
`GEO_FRAZIONARI_GOOGLE_GG_20261028120303.csv` nel formato
`radd-stores-registry.csv`. Il file di destinazione è dedicato ai punti Poste,
quindi non serve una colonna per la tipologia.

## Mapping

| Campo di destinazione | Sorgente o regola |
|---|---|
| `locationId` | UUID generato per ogni riga. |
| `partnerId` | Valore costante per tutte le righe; il default di test è `00000000000`. |
| `codici_esterni` | `FRAZIONARIO_EXT`, mantenuto come testo per conservare gli zeri iniziali. |
| `descrizione` | `DESCRIZIONE`. |
| `indirizzo` | `INDIRIZZO`. |
| `città` | `DESCR_COMUNE`. |
| `provincia` | `COD_PROVINCIA`. |
| `cap` | `CAP`, mantenuto come testo. |
| `telefoni` | Concatenazione di `PREF` e `TEL` quando disponibili, conservando gli zeri iniziali. |
| `latitudine` | `Y_GRADI`, WGS84 / EPSG:4326. |
| `longitudine` | `X_GRADI`, WGS84 / EPSG:4326. |
| `lunedi`–`domenica`, `orari_apertura` | Vuoti; gli orari sono ignorati. |
| `richiede_appuntamento` | `no` per tutti i punti (valore booleano `false`), come nel CSV di riferimento. |
| `website`, `email` | Vuoti; non sono presenti nel sorgente. |

`X_METRI` e `Y_METRI` non vengono usati: le coordinate sono lette direttamente
da `X_GRADI` e `Y_GRADI`.

## Avvio

Dalla root del repository, con Node.js:

```sh
node csv-geo-converter/convert.js <input.csv> <output.csv> [partnerId]
```

Il parametro `partnerId` è facoltativo e, se omesso, vale `00000000000`.
La cartella di destinazione deve già esistere. Lo script non sovrascrive i file:
accanto al CSV convertito crea anche `<nome-output>-anomalies.csv`.

Il file sorgente viene letto come Windows-1252; gli output sono UTF-8 e usano
il separatore `;`. Un'intestazione o un numero di campi non conforme interrompe
la conversione. Le anomalie vengono segnalate su stderr e inserite nel report
con numero di riga, codice, identificativo, dati descrittivi, coordinate
originali, eventuale prima occorrenza e dettaglio. Le righe anomale restano
nell'output; coordinate mancanti, zero o fuori dall'intervallo italiano
(longitudine 6-19, latitudine 35-48) sono lasciate vuote nel CSV convertito.

Le decisioni non ancora definite sono raccolte in
[`decisioni-aperte.md`](./decisioni-aperte.md).
