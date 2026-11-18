const { spawnSync } = require('node:child_process');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const {
  ANOMALY_HEADERS,
  EXPECTED_SOURCE_HEADERS,
  TARGET_HEADERS,
  convertCsv,
  parseDelimited,
} = require('./convert.js');

function sourceRecord(overrides = {}) {
  const values = Object.fromEntries(
    EXPECTED_SOURCE_HEADERS.map((header) => [header, '?']),
  );
  Object.assign(values, {
    FRAZIONARIO_EXT: '00170',
    DESCRIZIONE: 'OCCIMIANO',
    INDIRIZZO: 'VIA VITTORIO EMANUELE II 64',
    CAP: '15040',
    DESCR_COMUNE: 'OCCIMIANO',
    COD_PROVINCIA: 'AL',
    PREF: '0142 ',
    TEL: '809130',
    X_GRADI: '8.50657189',
    Y_GRADI: '45.06007413',
  }, overrides);

  return EXPECTED_SOURCE_HEADERS.map((header) => values[header]).join('|');
}

function sourceCsv(records, headers = EXPECTED_SOURCE_HEADERS) {
  return [headers.join('|'), ...records].join('\r\n');
}

test('maps a valid source record to the registry schema', () => {
  const result = convertCsv(sourceCsv([sourceRecord()]), {
    partnerId: '00000000000',
    uuidGenerator: () => '00000000-0000-4000-8000-000000000001',
  });
  const rows = parseDelimited(result.csv, ';');

  assert.deepEqual(rows[0], TARGET_HEADERS);
  assert.equal(rows.length, 2);
  assert.equal(rows[1][0], '00000000-0000-4000-8000-000000000001');
  assert.equal(rows[1][1], '00000000000');
  assert.equal(rows[1][2], '00170');
  assert.equal(rows[1][4], 'VIA VITTORIO EMANUELE II 64');
  assert.equal(rows[1][7], '15040');
  assert.equal(rows[1][8], '0142809130');
  assert.equal(rows[1][9], '45.06007413');
  assert.equal(rows[1][10], '8.50657189');
  assert.ok(rows[1].slice(11, 19).every((value) => value === ''));
  assert.equal(rows[1][21], 'no');
  assert.deepEqual(result.warnings, []);
});

test('CLI writes a sidecar CSV with row details for every anomaly', (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'csv-geo-converter-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));

  const inputPath = path.join(directory, 'input.csv');
  const outputPath = path.join(directory, 'registry.csv');
  const anomaliesPath = path.join(directory, 'registry-anomalies.csv');
  fs.writeFileSync(
    inputPath,
    sourceCsv([
      sourceRecord(),
      sourceRecord({
        FRAZIONARIO_EXT: '00200',
        X_GRADI: '?',
        Y_GRADI: '?',
      }),
    ]),
  );

  const result = spawnSync(
    process.execPath,
    [path.join(__dirname, 'convert.js'), inputPath, outputPath],
    { encoding: 'utf8' },
  );
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stderr, /MISSING_COORDINATES/);

  const anomalyRows = parseDelimited(
    fs.readFileSync(anomaliesPath, 'utf8'),
    ';',
  );
  assert.deepEqual(anomalyRows[0], ANOMALY_HEADERS);
  assert.equal(anomalyRows.length, 2);
  assert.equal(anomalyRows[1][0], '3');
  assert.equal(anomalyRows[1][2], '00200');
  assert.equal(anomalyRows[1][7], '?');
  assert.equal(anomalyRows[1][8], '?');
});

test('rejects a source file whose header is not the expected format', () => {
  const headers = EXPECTED_SOURCE_HEADERS.slice();
  headers[0] = 'STORE_ID';

  assert.throws(
    () => convertCsv(sourceCsv([sourceRecord()], headers)),
    /intestazione.*formato atteso/i,
  );
});

test('rejects records with a different number of fields than the header', () => {
  const record = sourceRecord().split('|');
  record.pop();

  assert.throws(
    () => convertCsv(sourceCsv([record.join('|')])),
    /riga 2.*131 campi.*richiede 132/i,
  );
});

test('parses quoted delimiters, escaped quotes, and embedded newlines', () => {
  assert.deepEqual(
    parseDelimited('"A|B"|"say ""hi""\r\nthere"', '|'),
    [['A|B', 'say "hi"\r\nthere']],
  );
});

test('reports coordinate anomalies and duplicate external IDs without dropping records', () => {
  const input = sourceCsv([
    sourceRecord(),
    sourceRecord({ FRAZIONARIO_EXT: '00200', X_GRADI: '?', Y_GRADI: '?' }),
    sourceRecord({ FRAZIONARIO_EXT: '00300', X_GRADI: '0', Y_GRADI: '0' }),
    sourceRecord({
      FRAZIONARIO_EXT: '00400',
      X_GRADI: '59.91163677',
      Y_GRADI: '47.22788337',
    }),
    sourceRecord({ DESCRIZIONE: 'DUPLICATO' }),
  ]);
  let nextId = 0;
  const result = convertCsv(input, {
    uuidGenerator: () => `uuid-${++nextId}`,
  });
  const rows = parseDelimited(result.csv, ';');
  const anomalyRows = parseDelimited(result.anomaliesCsv, ';');

  assert.equal(rows.length, 6);
  assert.deepEqual(anomalyRows[0], ANOMALY_HEADERS);
  assert.equal(anomalyRows.length, 5);
  assert.deepEqual(
    result.warnings.map(({ code }) => code),
    [
      'MISSING_COORDINATES',
      'ZERO_COORDINATES',
      'OUTSIDE_ITALY_BOUNDS',
      'DUPLICATE_EXTERNAL_ID',
    ],
  );
  assert.ok(rows[2][9] === '' && rows[2][10] === '');
  assert.ok(rows[3][9] === '' && rows[3][10] === '');
  assert.ok(rows[4][9] === '' && rows[4][10] === '');
  assert.equal(rows[5][2], '00170');
  assert.equal(anomalyRows[1][0], '3');
  assert.equal(anomalyRows[1][2], '00200');
  assert.equal(anomalyRows[1][7], '?');
  assert.equal(anomalyRows[4][2], '00170');
  assert.equal(anomalyRows[4][9], '2');
});
