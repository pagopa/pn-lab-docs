#!/usr/bin/env node
'use strict';

const { randomUUID } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { TextDecoder } = require('node:util');

const EXPECTED_SOURCE_HEADERS = Object.freeze(
  `FRAZIONARIO_EXT|COD_TIPOLOGIA_FRAZ|FLAG_SPRINT|STATO|DESCRIZIONE|INDIRIZZO|CAP|DESCR_COMUNE|LOCALITA|COD_PROVINCIA|PREF|TEL|FAX|S_PATRONO|UFF_APPOGGIO|G0|G1|G2|G3|G4|G5|G6|G7|G8|G9|G10|G11|G12|G13|G14|G15|G16|G17|G18|G19|G20|G21|G22|G23|G24|G25|G26|G27|G28|G29|G30|CASH_DISPENSER|S_CambioValute|S_carta_acq|S_cas_chiuso|S_FaxBureau|S_Obbligazioni|FONDI_COMUNI|S_Ems|S_Lettere_Vet_Pacc_Maxi|S_LibrettoRispMinore|MUTUI|S_PaccoCel1|S_Paccocel3|S_PaccoCelInt|S_Postevita|S_Polizze_ass_casa_famiglia|S_Postacelere|S_PTSHOP|COD_PTB|S_cecPac|S_Postepay_Gift|PRESTITI|S_Raccomandata1|S_R_Tim|S_R_Tiscali|S_R_Wind|S_Postevita1|FLAG_SPORTELLO_AMICO|NUM_SPORT_FILATELIA|NUM_SPORT_POSTAMAT|S_MoneyGram|S_Val_Bol_Tab|S_Val_Bol_Pub|S_Telepass|S_Fermoposta|S_e_boost|RETE_BDM|SERV_MUTUI_BDM|SERV_CONTO_CURATELE|SERV_GRATTA_VINCI|S_CC_BP_Office|S_CC_BP_Imp|S_CC_BP_Imp_Online|S_Prestimpresa|S_Leasing|S_Stampa_Mailing_Digitale|S_Vendita_a_catalogo|S_Cartoleria|S_Imb_Sca|S_Servizio_Imbustatura|S_Servizio_Affrancatura|S_Posta_Raccomandata_Online|S_Servizio_Imballaggio|S_Paccocelere_1_Plus|S_Paccocelere_3|S_Paccocelere_Imp_Inter|S_Paccocelere_Impresa|S_EMS_QPE|S_Postacelere_1_Plus|S_Prelavorazione_Postatarget|S_Postatarget|S_Postatarget_Info|S_Seguimi|S_Accordi_Commerciali_Pacchi|S_Postemail_Certificata|S_Lavorazione_in_distinta|S_Carnet_Prepagati|S_Servizio_Fax_Fotocopie|S1|S2|S3|S4|S5|S6|S7|S8|S9|S10|X_METRI|Y_METRI|X_GRADI|Y_GRADI|RIFERIMENTO_COORD|FONTECOORD|QUALCOORD|INDIRIZZO_ALTR_STR`.split(
    '|',
  ),
);

const TARGET_HEADERS = Object.freeze([
  'locationId',
  'partnerId',
  'codici_esterni',
  'descrizione',
  'indirizzo',
  'città',
  'provincia',
  'cap',
  'telefoni',
  'latitudine',
  'longitudine',
  'lunedi',
  'martedi',
  'mercoledi',
  'giovedi',
  'venerdi',
  'sabato',
  'domenica',
  'orari_apertura',
  'website',
  'email',
  'richiede_appuntamento',
]);

const ANOMALY_HEADERS = Object.freeze([
  'riga',
  'codice_anomalia',
  'FRAZIONARIO_EXT',
  'DESCRIZIONE',
  'INDIRIZZO',
  'DESCR_COMUNE',
  'COD_PROVINCIA',
  'X_GRADI',
  'Y_GRADI',
  'prima_riga',
  'dettaglio',
]);

const DEFAULT_PARTNER_ID = '00000000000';
const ITALY_BOUNDS = Object.freeze({
  minLatitude: 35,
  maxLatitude: 48,
  minLongitude: 6,
  maxLongitude: 19,
});

function parseDelimited(text, delimiter) {
  if (typeof delimiter !== 'string' || delimiter.length !== 1) {
    throw new Error('Il delimitatore deve essere un singolo carattere.');
  }

  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let quoteClosed = false;

  const pushRow = () => {
    row.push(field);
    if (!(row.length === 1 && row[0] === '')) rows.push(row);
    row = [];
    field = '';
    quoteClosed = false;
  };

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (inQuotes) {
      if (character === '"') {
        if (text[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          inQuotes = false;
          quoteClosed = true;
        }
      } else {
        field += character;
      }
      continue;
    }

    if (quoteClosed) {
      if (character === delimiter) {
        row.push(field);
        field = '';
        quoteClosed = false;
        continue;
      }
      if (character === '\r' || character === '\n') {
        pushRow();
        if (character === '\r' && text[index + 1] === '\n') index += 1;
        continue;
      }
      if (character === ' ' || character === '\t') continue;
      throw new Error(`Carattere inatteso dopo una virgoletta alla posizione ${index + 1}.`);
    }

    if (character === delimiter) {
      row.push(field);
      field = '';
    } else if (character === '\r' || character === '\n') {
      pushRow();
      if (character === '\r' && text[index + 1] === '\n') index += 1;
    } else if (character === '"' && field.length === 0) {
      inQuotes = true;
    } else if (character === '"') {
      throw new Error(`Virgoletta inattesa alla posizione ${index + 1}.`);
    } else {
      field += character;
    }
  }

  if (inQuotes) throw new Error('Campo CSV tra virgolette non terminato.');
  if (field.length > 0 || row.length > 0 || quoteClosed) pushRow();
  return rows;
}

function quoteField(value) {
  const text = String(value ?? '');
  if (text === '') return '';
  return `"${text.replaceAll('"', '""')}"`;
}

function serializeRows(rows) {
  const [header, ...records] = rows;
  return [
    header.join(';'),
    ...records.map((record) => record.map(quoteField).join(';')),
  ].join('\r\n') + '\r\n';
}

function serializeAnomalies(warnings) {
  const rows = [
    ANOMALY_HEADERS,
    ...warnings.map((warning) => [
      warning.recordNumber,
      warning.code,
      warning.externalId,
      warning.description,
      warning.address,
      warning.city,
      warning.province,
      warning.xGradi,
      warning.yGradi,
      warning.firstRecordNumber ?? '',
      warning.message,
    ]),
  ];
  return serializeRows(rows);
}

function validateSourceRows(rows) {
  if (rows.length === 0) throw new Error('Il file è vuoto.');

  const header = rows[0].map((value, index) =>
    index === 0 ? value.replace(/^\uFEFF/, '') : value,
  );
  const headerMatches =
    header.length === EXPECTED_SOURCE_HEADERS.length &&
    header.every((value, index) => value === EXPECTED_SOURCE_HEADERS[index]);
  if (!headerMatches) {
    throw new Error(
      'Intestazione non conforme al formato atteso GEO_FRAZIONARI_GOOGLE_GG.',
    );
  }

  for (let index = 1; index < rows.length; index += 1) {
    if (rows[index].length !== EXPECTED_SOURCE_HEADERS.length) {
      throw new Error(
        `La riga ${index + 1} contiene ${rows[index].length} campi; ` +
          `il formato atteso ne richiede ${EXPECTED_SOURCE_HEADERS.length}.`,
      );
    }
  }

  return new Map(header.map((name, index) => [name, index]));
}

function convertCsv(sourceText, options = {}) {
  const rows = parseDelimited(sourceText, '|');
  const columnIndex = validateSourceRows(rows);
  const partnerId = options.partnerId ?? DEFAULT_PARTNER_ID;
  const uuidGenerator = options.uuidGenerator ?? randomUUID;

  if (typeof partnerId !== 'string' || partnerId.trim() === '') {
    throw new Error('Il partnerId deve essere una stringa non vuota.');
  }
  if (typeof uuidGenerator !== 'function') {
    throw new Error('uuidGenerator deve essere una funzione.');
  }

  const warnings = [];
  const firstRecordByExternalId = new Map();
  const outputRows = [TARGET_HEADERS];
  const value = (record, name) =>
    (record[columnIndex.get(name)] ?? '').trim();
  const hasValue = (text) => text !== '' && text !== '?';

  for (let index = 1; index < rows.length; index += 1) {
    const record = rows[index];
    const recordNumber = index + 1;
    const externalId = value(record, 'FRAZIONARIO_EXT');
    const rawLongitude = value(record, 'X_GRADI');
    const rawLatitude = value(record, 'Y_GRADI');
    const anomalyContext = {
      externalId: hasValue(externalId) ? externalId : '',
      description: value(record, 'DESCRIZIONE'),
      address: value(record, 'INDIRIZZO'),
      city: value(record, 'DESCR_COMUNE'),
      province: value(record, 'COD_PROVINCIA'),
      xGradi: rawLongitude,
      yGradi: rawLatitude,
    };
    const addWarning = (code, message, extra = {}) => {
      warnings.push({
        recordNumber,
        code,
        ...anomalyContext,
        ...extra,
        message,
      });
    };

    if (!hasValue(externalId)) {
      addWarning('MISSING_EXTERNAL_ID', 'FRAZIONARIO_EXT mancante.');
    } else if (firstRecordByExternalId.has(externalId)) {
      addWarning(
        'DUPLICATE_EXTERNAL_ID',
        `FRAZIONARIO_EXT ${externalId} già presente alla riga ` +
          `${firstRecordByExternalId.get(externalId)}.`,
        { firstRecordNumber: firstRecordByExternalId.get(externalId) },
      );
    } else {
      firstRecordByExternalId.set(externalId, recordNumber);
    }

    let longitude = '';
    let latitude = '';
    const coordinatesPresent =
      hasValue(rawLongitude) && hasValue(rawLatitude);

    if (!coordinatesPresent) {
      addWarning('MISSING_COORDINATES', 'X_GRADI o Y_GRADI mancante.');
    } else {
      const longitudeNumber = Number(rawLongitude);
      const latitudeNumber = Number(rawLatitude);

      if (!Number.isFinite(longitudeNumber) || !Number.isFinite(latitudeNumber)) {
        addWarning(
          'INVALID_COORDINATES',
          `Coordinate non numeriche: X_GRADI=${rawLongitude}, ` +
            `Y_GRADI=${rawLatitude}.`,
        );
      } else if (longitudeNumber === 0 && latitudeNumber === 0) {
        addWarning('ZERO_COORDINATES', 'La coppia di coordinate è 0, 0.');
      } else if (
        longitudeNumber < ITALY_BOUNDS.minLongitude ||
        longitudeNumber > ITALY_BOUNDS.maxLongitude ||
        latitudeNumber < ITALY_BOUNDS.minLatitude ||
        latitudeNumber > ITALY_BOUNDS.maxLatitude
      ) {
        addWarning(
          'OUTSIDE_ITALY_BOUNDS',
          `Coordinate fuori dall'intervallo geografico italiano: ` +
            `latitudine=${rawLatitude}, longitudine=${rawLongitude}.`,
        );
      } else {
        longitude = String(longitudeNumber);
        latitude = String(latitudeNumber);
      }
    }

    const prefix = value(record, 'PREF');
    const phone = value(record, 'TEL');
    const targetRecord = {
      locationId: uuidGenerator(),
      partnerId,
      codici_esterni: externalId === '?' ? '' : externalId,
      descrizione: value(record, 'DESCRIZIONE'),
      indirizzo: value(record, 'INDIRIZZO'),
      città: value(record, 'DESCR_COMUNE'),
      provincia: value(record, 'COD_PROVINCIA'),
      cap: value(record, 'CAP'),
      telefoni: [prefix, phone]
        .filter((part) => hasValue(part))
        .join(''),
      latitudine: latitude,
      longitudine: longitude,
      lunedi: '',
      martedi: '',
      mercoledi: '',
      giovedi: '',
      venerdi: '',
      sabato: '',
      domenica: '',
      orari_apertura: '',
      website: '',
      email: '',
      richiede_appuntamento: 'no',
    };

    outputRows.push(TARGET_HEADERS.map((header) => targetRecord[header]));
  }

  return {
    csv: serializeRows(outputRows),
    warnings,
    anomaliesCsv: serializeAnomalies(warnings),
    recordsConverted: outputRows.length - 1,
  };
}

function anomalyOutputPath(outputPath) {
  const parsedPath = path.parse(outputPath);
  return path.join(parsedPath.dir, `${parsedPath.name}-anomalies.csv`);
}

function main(args) {
  if (args.length < 2 || args.length > 3) {
    throw new Error(
      'Uso: node convert.js <input.csv> <output.csv> [partnerId]',
    );
  }

  const [inputPath, outputPath, partnerId = DEFAULT_PARTNER_ID] = args;
  const anomaliesPath = anomalyOutputPath(outputPath);
  if (
    path.resolve(inputPath) === path.resolve(outputPath) ||
    path.resolve(inputPath) === path.resolve(anomaliesPath)
  ) {
    throw new Error('Input e file di output devono essere distinti.');
  }
  for (const filePath of [outputPath, anomaliesPath]) {
    if (fs.existsSync(filePath)) {
      throw new Error(`Il file di output esiste già: ${filePath}`);
    }
  }

  const sourceBytes = fs.readFileSync(inputPath);
  const sourceText = new TextDecoder('windows-1252').decode(sourceBytes);
  const result = convertCsv(sourceText, { partnerId });

  fs.writeFileSync(outputPath, result.csv, { encoding: 'utf8', flag: 'wx' });
  fs.writeFileSync(anomaliesPath, result.anomaliesCsv, {
    encoding: 'utf8',
    flag: 'wx',
  });
  for (const warning of result.warnings) {
    console.warn(
      `Avviso riga ${warning.recordNumber} [${warning.code}]: ${warning.message}`,
    );
  }
  console.log(
    `Creato ${outputPath}: ${result.recordsConverted} record, ` +
      `${result.warnings.length} anomalie segnalate.`,
  );
  console.log(`Report anomalie creato: ${anomaliesPath}`);
}

if (require.main === module) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(`Errore: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = {
  ANOMALY_HEADERS,
  DEFAULT_PARTNER_ID,
  EXPECTED_SOURCE_HEADERS,
  ITALY_BOUNDS,
  TARGET_HEADERS,
  convertCsv,
  parseDelimited,
};
