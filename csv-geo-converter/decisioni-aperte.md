# Decisioni aperte

- Definire il valore e la lunghezza del `partnerId` reale. Il default
  `00000000000` è un valore di test.
- Lo script attuale genera soltanto i CSV e non invoca un DB, pertanto il locationId è generato random
- Nello schema di output manca la tipologia del Punto di Ritiro, si assume che il file prodotto contenga tutti punti di ritiro di un'unico partner con la stessa tipologia. 
