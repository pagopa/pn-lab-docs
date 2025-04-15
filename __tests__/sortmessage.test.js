const { precalculateVariablesAndConstraints, solveMessageAllocation } = require("../ortool/sortmessage");

test("precalcola variabili e vincoli correttamente", () => {
  const messages = [
    { id: 1, zipCode: "12345" },
    { id: 2, zipCode: "67890" },
  ];

  const partners = [
    { id: "A", zipCode: "12345", capacity: 1 },
    { id: "B", zipCode: "67890", capacity: 2 },
  ];

  const { variables, constraints, varMap } = precalculateVariablesAndConstraints(messages, partners);

  // Verifica che le variabili siano state calcolate correttamente
  expect(variables).toHaveLength(4); // 2 messaggi x 2 partner
  expect(variables).toEqual(
    expect.arrayContaining([
      { name: "x_0_0", coef: 1, type: "binary" },
      { name: "x_0_1", coef: 1, type: "binary" },
      { name: "x_1_0", coef: 1, type: "binary" },
      { name: "x_1_1", coef: 1, type: "binary" },
    ])
  );

  // Verifica che i vincoli siano stati calcolati correttamente
  expect(constraints).toHaveLength(4); // 2 vincoli per messaggi + 2 vincoli per capacità
});

test("assegna messaggi ai partner rispettando i vincoli", async () => {
  const messages = [
    { id: 1, zipCode: "12345" },
    { id: 2, zipCode: "67890" },
  ];

  const partners = [
    { id: "A", zipCode: "12345", capacity: 1 },
    { id: "B", zipCode: "67890", capacity: 2 },
  ];

  const precalculatedData = precalculateVariablesAndConstraints(messages, partners);
  const result = await solveMessageAllocation(precalculatedData);

  // Verifica che la soluzione sia valida
  expect(result.result.vars).toMatchObject({
    x_0_0: 1, // Messaggio 1 assegnato al partner A
    x_1_1: 1, // Messaggio 2 assegnato al partner B
  });
});