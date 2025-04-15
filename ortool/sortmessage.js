const glpk = require("glpk.js");

/**
 * Pre-calcola le variabili e i vincoli per il problema di allocazione.
 * @param {Array} messages - Lista dei messaggi.
 * @param {Array} partners - Lista dei partner.
 * @returns {Object} - Oggetto contenente variabili, vincoli e mappa delle variabili.
 */
function precalculateVariablesAndConstraints(messages, partners) {
  const numMessages = messages.length;
  const numPartners = partners.length;

  let variables = [];
  let constraints = [];
  let varMap = {};

  console.log("Precomputing variables...");
  for (let i = 0; i < numMessages; i++) {
    for (let j = 0; j < numPartners; j++) {
      // Creazione della variabile x_i_j
      let varName = `x_${i}_${j}`;
      varMap[varName] = { i, j };
      variables.push({ name: varName, coef: 1, type: "binary" }); // Aggiunto il campo "type: binary"
      console.log(`Variable precomputed: ${varName}`);
    }
  }

  console.log("Precomputing constraints for messages...");
  for (let i = 0; i < numMessages; i++) {
    let row = {
      name: `msg_${i}`,
      vars: [],
      rhs: 1,
      bnds: { type: glpk.GLP_UP, ub: 1 }, // Ogni messaggio può essere assegnato a un solo partner
    };
    for (let j = 0; j < numPartners; j++) {
      let varName = `x_${i}_${j}`;
      row.vars.push({ name: varName, coef: 1 });
    }
    constraints.push(row);
    console.log(`Constraint precomputed for message ${i}: ${JSON.stringify(row)}`);
  }

  console.log("Precomputing constraints for partner capacities...");
  for (let j = 0; j < numPartners; j++) {
    let row = {
      name: `capacity_${j}`,
      vars: [],
      rhs: partners[j].capacity,
      bnds: { type: glpk.GLP_UP, ub: partners[j].capacity }, // Capacità massima del partner
    };
    for (let i = 0; i < numMessages; i++) {
      let varName = `x_${i}_${j}`;
      row.vars.push({ name: varName, coef: 1 });
    }
    constraints.push(row);
    console.log(`Constraint precomputed for partner ${j}: ${JSON.stringify(row)}`);
  }

  return { variables, constraints, varMap };
}

/**
 * Esegue l'algoritmo di allocazione dei messaggi.
 * @param {Object} precalculatedData - Dati pre-calcolati (variabili e vincoli).
 * @returns {Object} - Risultato dell'algoritmo.
 */
async function solveMessageAllocation(precalculatedData) {
  const glpkInstance = await glpk(); // Inizializza GLPK
  console.log("GLPK instance initialized.");

  const { variables, constraints } = precalculatedData;

  console.log("Variables:", variables);
  console.log("Constraints:", constraints);

  console.log("Solving the problem...");
  const result = glpkInstance.solve({
    name: "MessageAllocation",
    objective: {
      direction: glpkInstance.GLP_MAX,
      name: "maximize_assignments",
      vars: variables,
    },
    subjectTo: constraints,
  });

  // Aggiungere variabili non utilizzate con valore 0
  variables.forEach((variable) => {
    if (!(variable.name in result.result.vars)) {
      result.result.vars[variable.name] = 0;
    }
  });

  console.log("Solution found:", result);
  return result;
}

module.exports = { precalculateVariablesAndConstraints, solveMessageAllocation };
