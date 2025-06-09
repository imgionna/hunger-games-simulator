const startSimBtn = document.getElementById("startSimBtn");
const resetBtn = document.getElementById("resetBtn");
const downloadLogBtn = document.getElementById("downloadLogBtn");
const randomizeBtn = document.getElementById("randomizeBtn");
const createBtn = document.getElementById("createBtn");
const tributeList = document.getElementById("tributeList");
const eventLogElem = document.getElementById("eventLog");

let tributes = [];
let aliveTributes = [];
let fallenTributes = [];
let eventLog = [];
let dayCount = 0;
let simulationRunning = false;

function logEvent(text) {
  eventLog.push(text);
  eventLogElem.innerHTML = eventLog.join("<br>");
}

function bold(t) {
  return `**${t.name} (D${t.district})**`;
}

function roundUpAvg(...values) {
  return Math.ceil(values.reduce((a, b) => a + b, 0) / values.length);
}

function renderTributeList() {
  tributeList.innerHTML = tributes.map(t =>
    `${t.name} (${t.gender}, D${t.district}, Weapon: ${t.weapon}, Score: ${t.trainingScore})`
  ).join("<br>");
}

function resetSimulation() {
  tributes = [];
  aliveTributes = [];
  fallenTributes = [];
  eventLog = [];
  dayCount = 0;
  simulationRunning = false;
  eventLogElem.innerHTML = "";
  renderTributeList();
  resetBtn.disabled = true;
  downloadLogBtn.disabled = true;
}

function randomWeapon() {
  const weapons = ["spear", "sword", "bow", "axe", "knife", "rock", "mace", "whip"];
  return weapons[Math.floor(Math.random() * weapons.length)];
}

function randomSkill() {
  return Math.floor(Math.random() * 13); // 0–12
}

randomizeBtn.addEventListener("click", () => {
  document.getElementById("weapon").value = randomWeapon();
  ["combat", "survival", "stealth", "speed", "strength", "intelligence"].forEach(id => {
    document.getElementById(id).value = randomSkill();
  });
});

createBtn.addEventListener("click", () => {
  const name = document.getElementById("name").value;
  const gender = document.getElementById("gender").value;
  const age = parseInt(document.getElementById("age").value);
  const district = parseInt(document.getElementById("district").value);
  const weapon = document.getElementById("weapon").value;
  const skills = ["combat", "survival", "stealth", "speed", "strength", "intelligence"].map(id => parseInt(document.getElementById(id).value));

  if (!name || !age || !district || !weapon || skills.some(s => isNaN(s))) {
    alert("Please fill out all fields.");
    return;
  }

  const trainingScore = roundUpAvg(...skills);
  const tribute = { name, gender, age, district, weapon, trainingScore };
  tributes.push(tribute);
  renderTributeList();
});

function tributeDies(victim) {
  aliveTributes = aliveTributes.filter(t => t !== victim);
  fallenTributes.push(victim);
}

function selectCombatPair() {
  let a, b;
  const shuffled = aliveTributes.sort(() => 0.5 - Math.random());

  for (let i = 0; i < shuffled.length; i++) {
    a = shuffled[i];
    for (let j = 0; j < shuffled.length; j++) {
      b = shuffled[j];
      if (a !== b && a.district !== b.district) {
        return [a, b]; // different district pair found
      }
    }
  }

  // fallback: allow same district only if nothing else is possible
  a = shuffled[0];
  b = shuffled.find(t => t !== a);
  return [a, b];
}

function simulateFallenTributes() {
  if (fallenTributes.length === 0) {
    logEvent(`🌌 No tributes fell tonight.`);
    return;
  }

  logEvent(`\n💀 <b>Fallen Tributes:</b>`);
  fallenTributes.forEach(t => {
    logEvent(`🔔 ${t.name} (D${t.district}) — 💫`);
  });

  fallenTributes = [];
}

function simulateArenaEvent() {
  if (Math.random() < 0.3) {
    logEvent(`🌪️ A sudden storm ravages the arena! Everyone scrambles for cover.`);
  } else if (Math.random() < 0.2) {
    logEvent(`🐻 Mutts are released into the arena, causing chaos!`);
  }
}

function simulateDay() {
  if (dayCount === 0) {
    logEvent(`<b>🌅 The Bloodbath Begins!</b>`);
    const initialKills = Math.min(6, Math.floor(aliveTributes.length / 3));
    for (let i = 0; i < initialKills; i++) {
      const [a, b] = selectCombatPair();
      if (!a || !b) break;

      const winner = a.trainingScore + Math.random() * 5 > b.trainingScore + Math.random() * 5 ? a : b;
      const loser = winner === a ? b : a;
      tributeDies(loser);
      logEvent(`🩸 ${bold(winner)} strikes down ${bold(loser)} with a ${winner.weapon}!`);
    }
    dayCount++;
    setTimeout(simulateDay, 2500);
    return;
  }

  logEvent(`\n☀️ <b>Day ${dayCount}</b>`);
  simulateArenaEvent();

  if (aliveTributes.length > 1 && Math.random() < 0.6) {
    const [a, b] = selectCombatPair();
    if (!a || !b) return;

    const winner = a.trainingScore + Math.random() * 5 > b.trainingScore + Math.random() * 5 ? a : b;
    const loser = winner === a ? b : a;
    tributeDies(loser);
    logEvent(`⚔️ ${bold(winner)} defeats ${bold(loser)} in a surprise attack.`);
  } else {
    const survivor = aliveTributes[Math.floor(Math.random() * aliveTributes.length)];
    logEvent(`🍂 ${bold(survivor)} spends the day hiding in the trees.`);
  }

  logEvent(`\n🌙 <b>Night ${dayCount}</b>`);
  if (Math.random() < 0.4 && aliveTributes.length > 1) {
    const [a, b] = selectCombatPair();
    const winner = a.trainingScore + Math.random() * 5 > b.trainingScore + Math.random() * 5 ? a : b;
    const loser = winner === a ? b : a;
    tributeDies(loser);
    logEvent(`🌌 Under the stars, ${bold(winner)} ambushes ${bold(loser)} in their sleep.`);
  } else {
    logEvent(`🌜 The night passes quietly.`);
  }

  simulateFallenTributes();

  dayCount++;

  if (aliveTributes.length <= 1) {
    const winner = aliveTributes[0];
    if (winner) {
      logEvent(`\n🏆 <b>${winner.name} (D${winner.district})</b> is the Victor of the Hunger Games!`);
    } else {
      logEvent(`\n💀 All tributes have perished. No victor emerges.`);
    }

    simulationRunning = false;
    startSimBtn.disabled = false;
    resetBtn.disabled = false;
    downloadLogBtn.disabled = false;
    return;
  }

  setTimeout(simulateDay, 4000);
}

startSimBtn.addEventListener("click", () => {
  if (tributes.length < 2) return alert("Need at least 2 tributes to start.");

  aliveTributes = tributes.slice();
  fallenTributes = [];
  eventLog = [];
  dayCount = 0;
  eventLogElem.innerHTML = "";
  simulationRunning = true;
  startSimBtn.disabled = true;
  resetBtn.disabled = false;
  simulateDay();
});

resetBtn.addEventListener("click", resetSimulation);

downloadLogBtn.addEventListener("click", () => {
  const blob = new Blob([eventLog.join("\n").replace(/<[^>]*>/g, '')], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "hunger_games_log.txt";
  a.click();
  URL.revokeObjectURL(url);
});

resetSimulation();
