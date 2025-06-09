const startSimBtn = document.getElementById("startSimBtn");
const resetBtn = document.getElementById("resetBtn");
const downloadLogBtn = document.getElementById("downloadLogBtn");
const randomizeBtn = document.getElementById("randomizeBtn");
const createBtn = document.getElementById("createBtn");
const tributeList = document.getElementById("tributeList");
const eventLogElem = document.getElementById("eventLog");

let tributes = [];
let aliveTributes = [];
let eventLog = [];
let dayCount = 0;
let simulationRunning = false;

function logEvent(text) {
  eventLog.push(text);
  eventLogElem.textContent = eventLog.join("\n");
}

function roundUpAvg(...values) {
  return Math.ceil(values.reduce((a, b) => a + b, 0) / values.length);
}

function renderTributeList() {
  tributeList.innerHTML = tributes.map(t =>
    `${t.name} (${t.gender}, D<b>${t.district}</b>, Weapon: ${t.weapon}, Score: ${t.trainingScore})`
  ).join("<br>");
}

function resetSimulation() {
  tributes = [];
  aliveTributes = [];
  eventLog = [];
  dayCount = 0;
  simulationRunning = false;
  eventLogElem.textContent = "";
  renderTributeList();
  resetBtn.disabled = true;
  downloadLogBtn.disabled = true;
}

function randomWeapon() {
  const weapons = ["spear", "sword", "bow", "axe", "knife", "rock", "mace", "whip"];
  return weapons[Math.floor(Math.random() * weapons.length)];
}

function randomSkill() {
  return Math.floor(Math.random() * 10) + 1;
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
}

function selectRandomTribute(exclude) {
  const options = aliveTributes.filter(t => t !== exclude);
  return options[Math.floor(Math.random() * options.length)];
}

function simulateDay() {
  dayCount++;
  logEvent(`\n🌞 Day ${dayCount}`);

  if (aliveTributes.length > 1 && Math.random() < 0.7) {
    const a = selectRandomTribute();
    const b = selectRandomTribute(a);
    if (!a || !b) return;

    const winner = a.trainingScore + Math.random() * 5 > b.trainingScore + Math.random() * 5 ? a : b;
    const loser = winner === a ? b : a;
    tributeDies(loser);

    logEvent(`⚔️ ${winner.name} (D<b>${winner.district}</b>) eliminated ${loser.name} (D<b>${loser.district}</b>) with a ${winner.weapon}.`);
  } else {
    aliveTributes.forEach(t => {
      logEvent(`🍃 ${t.name} (D<b>${t.district}</b>) survived the day by staying hidden.`);
    });
  }

  if (aliveTributes.length <= 1) {
    const winner = aliveTributes[0];
    logEvent(winner ? `🏆 ${winner.name} (D<b>${winner.district}</b>) is the Victor!` : `☠️ No one survived...`);
    simulationRunning = false;
    startSimBtn.disabled = false;
    resetBtn.disabled = false;
    downloadLogBtn.disabled = false;
    return;
  }

  setTimeout(simulateDay, 2000);
}

startSimBtn.addEventListener("click", () => {
  if (tributes.length < 2) return alert("Need at least 2 tributes to start.");

  aliveTributes = tributes.slice();
  simulationRunning = true;
  eventLog = [];
  dayCount = 0;
  eventLogElem.textContent = "";
  startSimBtn.disabled = true;
  resetBtn.disabled = false;
  simulateDay();
});

resetBtn.addEventListener("click", resetSimulation);

downloadLogBtn.addEventListener("click", () => {
  const blob = new Blob([eventLog.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "hunger_games_log.txt";
  a.click();
  URL.revokeObjectURL(url);
});

resetSimulation();
