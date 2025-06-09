// Global variables and elements
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
let alliances = [];

// Utilities
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

function shuffle(arr) {
  return arr.sort(() => 0.5 - Math.random());
}

function renderTributeList() {
  tributeList.innerHTML = tributes.map(t =>
    `${t.name} (${t.gender}, Age ${t.age}, D${t.district}, Weapon: ${t.weapon}, Score: ${t.trainingScore})`
  ).join("<br>");
}

// Tribute handling
function tributeDies(victim) {
  aliveTributes = aliveTributes.filter(t => t !== victim);
  fallenTributes.push(victim);
}

function randomWeapon() {
  const weapons = ["spear", "sword", "bow", "axe", "knife", "rock", "mace", "whip"];
  return weapons[Math.floor(Math.random() * weapons.length)];
}

function randomSkill() {
  return Math.floor(Math.random() * 13);
}

// Randomize form
randomizeBtn.addEventListener("click", () => {
  document.getElementById("age").value = Math.floor(Math.random() * 8) + 12;
  document.getElementById("weapon").value = randomWeapon();
  ["combat", "survival", "stealth", "speed", "strength", "intelligence"].forEach(id => {
    document.getElementById(id).value = randomSkill();
  });
});

// Create tribute
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
  const tribute = { name, gender, age, district, weapon, trainingScore, kills: 0 };
  tributes.push(tribute);
  renderTributeList();
});

// Combat logic
function getCombatEvent(actor, target) {
  const templates = [
    `🗡️ ${bold(actor)} ambushed ${bold(target)} with a ${actor.weapon}.`,
    `🏹 ${bold(actor)} sniped ${bold(target)} from a distance.`,
    `⚔️ ${bold(actor)} dueled ${bold(target)} at the riverbank.`,
    `🔪 ${bold(actor)} crept up and slit the throat of ${bold(target)}.`,
    `🔥 ${bold(actor)} set a trap that caught ${bold(target)}.`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

function getCombatWinner(a, b) {
  const aRoll = Math.random() * (a.trainingScore + 5);
  const bRoll = Math.random() * (b.trainingScore + 5);
  return aRoll >= bRoll ? a : b;
}

function selectCombatPair() {
  const shuffled = shuffle([...aliveTributes]);
  for (let i = 0; i < shuffled.length; i++) {
    for (let j = i + 1; j < shuffled.length; j++) {
      if (shuffled[i].district !== shuffled[j].district) return [shuffled[i], shuffled[j]];
    }
  }
  return [shuffled[0], shuffled[1]];
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

function randomTribute(exclude = null) {
  const options = aliveTributes.filter(t => t !== exclude);
  return options[Math.floor(Math.random() * options.length)];
}

// Arena Events
function simulateArenaEvent() {
  const type = Math.floor(Math.random() * 4);

  if (type === 0) {
    logEvent("🐺 Mutts are unleashed in the arena!");
    const t = randomTribute();
    if (Math.random() < t.survival / 15) {
      logEvent(`🦴 ${bold(t)} escaped the mutts by climbing a tree.`);
    } else {
      tributeDies(t);
      logEvent(`🩸 ${bold(t)} was mauled by the mutts.`);
    }
  } else if (type === 1) {
    logEvent("🌪️ A violent storm crashes through!");
    const t = randomTribute();
    if (Math.random() < t.intelligence / 15) {
      logEvent(`☔ ${bold(t)} found cover in time.`);
    } else {
      tributeDies(t);
      logEvent(`⚡ ${bold(t)} was crushed by debris.`);
    }
  } else if (type === 2) {
    logEvent("🍖 A feast is announced!");
    const tribs = shuffle(aliveTributes).slice(0, 4);
    if (tribs.length >= 2) {
      const [a, b] = [tribs[0], tribs[1]];
      const winner = getCombatWinner(a, b);
      const loser = winner === a ? b : a;
      winner.kills++;
      tributeDies(loser);
      logEvent(`🥩 ${getCombatEvent(winner, loser)}`);
    }
  } else {
    logEvent("☠️ Poison fog rolls across the field!");
    const t = randomTribute();
    if (Math.random() < t.intelligence / 20) {
      logEvent(`🌫️ ${bold(t)} held their breath and survived.`);
    } else {
      tributeDies(t);
      logEvent(`☠️ ${bold(t)} inhaled the poison and died.`);
    }
  }
}

// Simulation
function simulateDay() {
  if (dayCount === 0) {
    logEvent(`<b>🌅 The Bloodbath Begins!</b>`);
    const initialKills = Math.min(6, Math.floor(aliveTributes.length / 3));
    for (let i = 0; i < initialKills; i++) {
      const [a, b] = selectCombatPair();
      const winner = getCombatWinner(a, b);
      const loser = winner === a ? b : a;
      winner.kills++;
      tributeDies(loser);
      logEvent(`🩸 ${getCombatEvent(winner, loser)}`);
    }
    dayCount++;
    setTimeout(simulateDay, 2500);
    return;
  }

  logEvent(`\n☀️ <b>Day ${dayCount}</b>`);

  if (Math.random() < 0.5) simulateArenaEvent();

  if (Math.random() < 0.6 && aliveTributes.length > 1) {
    const [a, b] = selectCombatPair();
    const winner = getCombatWinner(a, b);
    const loser = winner === a ? b : a;
    winner.kills++;
    tributeDies(loser);
    logEvent(`⚔️ ${getCombatEvent(winner, loser)}`);
  } else {
    const survivor = randomTribute();
    const outcome = Math.random();
    if (outcome < 0.5) {
      logEvent(`🫥 ${bold(survivor)} avoided danger using stealth.`);
    } else {
      logEvent(`⛺ ${bold(survivor)} crafted traps and survived the day.`);
    }
  }

  logEvent(`\n🌙 <b>Night ${dayCount}</b>`);
  if (Math.random() < 0.3 && aliveTributes.length > 1) {
    const [a, b] = selectCombatPair();
    const winner = getCombatWinner(a, b);
    const loser = winner === a ? b : a;
    winner.kills++;
    tributeDies(loser);
    logEvent(`🌌 In the night, ${getCombatEvent(winner, loser)}`);
  } else {
    logEvent("🌜 Quiet settles over the arena.");
  }

  simulateFallenTributes();

  dayCount++;

  if (aliveTributes.length <= 1) {
    const winner = aliveTributes[0];
    if (winner) {
      logEvent(`\n🏆 <b>${winner.name} (D${winner.district})</b> is the Victor!`);
    } else {
      logEvent(`\n💀 All tributes have perished. No victor emerges.`);
    }

    showSummary();
    simulationRunning = false;
    startSimBtn.disabled = false;
    resetBtn.disabled = false;
    downloadLogBtn.disabled = false;
    return;
  }

  setTimeout(simulateDay, 4000);
}

function showSummary() {
  const placements = [...tributes].sort((a, b) => {
    const aDead = fallenTributes.includes(a);
    const bDead = fallenTributes.includes(b);
    if (aDead && bDead) return fallenTributes.indexOf(a) - fallenTributes.indexOf(b);
    return aDead ? 1 : -1;
  });

  logEvent(`<br><b>📊 Final Standings:</b>`);
  placements.forEach((t, i) => {
    const place = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}th`;
    logEvent(`${place}: ${t.name} (D${t.district}) — 💀 ${t.kills} kill${t.kills !== 1 ? "s" : ""}`);
  });
}

// Start & Reset
startSimBtn.addEventListener("click", () => {
  if (tributes.length < 2) return alert("Need at least 2 tributes to start.");

  aliveTributes = tributes.map(t => ({ ...t, kills: 0 }));
  fallenTributes = [];
  eventLog = [];
  dayCount = 0;
  eventLogElem.innerHTML = "";
  simulationRunning = true;
  startSimBtn.disabled = true;
  resetBtn.disabled = false;
  simulateDay();
});

resetBtn.addEventListener("click", () => {
  tributes = [];
  aliveTributes = [];
  fallenTributes = [];
  eventLog = [];
  dayCount = 0;
  alliances = [];
  eventLogElem.innerHTML = "";
  renderTributeList();
  resetBtn.disabled = true;
  downloadLogBtn.disabled = true;
});

downloadLogBtn.addEventListener("click", () => {
  const blob = new Blob([eventLog.join("\n").replace(/<[^>]*>/g, '')], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "hunger_games_log.txt";
  a.click();
  URL.revokeObjectURL(url);
});
