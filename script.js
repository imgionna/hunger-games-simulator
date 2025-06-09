// ===== Data & Setup =====

const MAX_TRIBUTES_PER_GENDER = 2;
const DISTRICTS_COUNT = 12;
const CAREER_DISTRICTS = [1, 2, 4]; // Career districts have slight advantage

const weapons = [
  "Knife", "Bow", "Spear", "Axe", "Sword", "Trident", "Mace", "Hammer", "Slingshot"
];

// Pre-filled tributes from the book (just a few examples)
const prefilledTributes = [
  // District 1 - Career
  { name: "Glimmer", gender: "female", age: 16, district: 1, weapon: "Bow", combat: 8, survival: 5, stealth: 6, speed: 6, strength: 7, intelligence: 5 },
  { name: "Marvel", gender: "male", age: 18, district: 1, weapon: "Knife", combat: 7, survival: 6, stealth: 5, speed: 6, strength: 7, intelligence: 6 },
  // District 2 - Career
  { name: "Clove", gender: "female", age: 18, district: 2, weapon: "Knife", combat: 9, survival: 4, stealth: 7, speed: 7, strength: 7, intelligence: 5 },
  { name: "Cato", gender: "male", age: 18, district: 2, weapon: "Sword", combat: 10, survival: 5, stealth: 6, speed: 7, strength: 9, intelligence: 6 },
  // District 4 - Career
  { name: "Finnick", gender: "male", age: 24, district: 4, weapon: "Trident", combat: 10, survival: 7, stealth: 8, speed: 9, strength: 8, intelligence: 7 },
  { name: "Mags", gender: "female", age: 80, district: 4, weapon: "Spear", combat: 7, survival: 9, stealth: 6, speed: 5, strength: 6, intelligence: 7 },
  // District 7
  { name: "Johanna", gender: "female", age: 18, district: 7, weapon: "Axe", combat: 9, survival: 6, stealth: 5, speed: 7, strength: 8, intelligence: 6 },
  { name: "Blight", gender: "male", age: 18, district: 7, weapon: "Axe", combat: 8, survival: 5, stealth: 4, speed: 7, strength: 7, intelligence: 5 },
  // District 11
  { name: "Thresh", gender: "male", age: 18, district: 11, weapon: "Sickle", combat: 9, survival: 7, stealth: 5, speed: 6, strength: 9, intelligence: 6 },
  { name: "Rue", gender: "female", age: 12, district: 11, weapon: "Sling", combat: 5, survival: 9, stealth: 8, speed: 7, strength: 4, intelligence: 7 }
];

// Add trainingScore & fill missing data & normalize weapons for prefilled
function enrichTributes(tributes) {
  tributes.forEach(t => {
    // If weapon not in weapons list, add it (e.g., "Sickle", "Sling")
    if (!weapons.includes(t.weapon)) {
      weapons.push(t.weapon);
    }
    t.trainingScore = calcTrainingScore(t);
  });
}

enrichTributes(prefilledTributes);

let tributes = [...prefilledTributes];

// Utility function to calculate training score (sum of skills)
function calcTrainingScore(t) {
  return (
    t.combat +
    t.survival +
    t.stealth +
    t.speed +
    t.strength +
    t.intelligence +
    (CAREER_DISTRICTS.includes(t.district) ? 3 : 0) // career bonus +3
  );
}

// Current state of simulation
let simulationRunning = false;
let eventLog = [];
let dayCount = 0;
let aliveTributes = [];
let alliances = {}; // district alliance arrays: { 'district-1': [tributes...] }
let tributeMapByDistrictGender = {};

// ===== UI Elements =====
const districtsListElem = document.getElementById("districts-list");
const tributeForm = document.getElementById("tribute-form");
const startSimBtn = document.getElementById("start-sim-btn");
const resetBtn = document.getElementById("reset-btn");
const eventLogElem = document.getElementById("event-log");
const downloadLogBtn = document.getElementById("download-log-btn");
const randomizeBtn = document.getElementById("randomize-btn");

const nameInput = document.getElementById("name");
const genderInput = document.getElementById("gender");
const ageInput = document.getElementById("age");
const districtSelect = document.getElementById("district");
const weaponSelect = document.getElementById("weapon");
const combatInput = document.getElementById("combat");
const survivalInput = document.getElementById("survival");
const stealthInput = document.getElementById("stealth");
const speedInput = document.getElementById("speed");
const strengthInput = document.getElementById("strength");
const intelligenceInput = document.getElementById("intelligence");

// ===== Initialize =====

// Populate district select
for (let i = 1; i <= DISTRICTS_COUNT; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = `District ${i}`;
  districtSelect.appendChild(option);
}

// Populate weapon select
function populateWeaponSelect() {
  weaponSelect.innerHTML = "";
  weapons.forEach(w => {
    const opt = document.createElement("option");
    opt.value = w;
    opt.textContent = w;
    weaponSelect.appendChild(opt);
  });
}
populateWeaponSelect();

// Show districts and tributes
function renderDistricts() {
  districtsListElem.innerHTML = "";

  for (let i = 1; i <= DISTRICTS_COUNT; i++) {
    const div = document.createElement("div");
    div.className = "district";
    div.id = `district-${i}`;

    const h3 = document.createElement("h3");
    h3.textContent = `District ${i}`;
    if (CAREER_DISTRICTS.includes(i)) {
      h3.textContent += " (Career)";
    }
    div.appendChild(h3);

    // Filter tributes by district and gender
    const maleTributes = tributes.filter(t => t.district === i && t.gender === "male");
    const femaleTributes = tributes.filter(t => t.district === i && t.gender === "female");

    // Male list
    const maleList = document.createElement("ul");
    maleList.className = "tribute-list";
    maleList.textContent = "Males:";
    maleTributes.forEach(t => {
      const li = document.createElement("li");
      li.textContent = `${t.name} (Age ${t.age}) - ${t.weapon}`;
      maleList.appendChild(li);
    });
    div.appendChild(maleList);

    // Female list
    const femaleList = document.createElement("ul");
    femaleList.className = "tribute-list";
    femaleList.textContent = "Females:";
    femaleTributes.forEach(t => {
      const li = document.createElement("li");
      li.textContent = `${t.name} (Age ${t.age}) - ${t.weapon}`;
      femaleList.appendChild(li);
    });
    div.appendChild(femaleList);

    districtsListElem.appendChild(div);
  }
}
renderDistricts();

// ===== Randomize Tribute =====
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomizeTributeForm() {
  const randomName = `Tribute${randomInt(100, 999)}`;
  const genders = ["male", "female"];
  const randGender = genders[randomInt(0, 1)];
  const randAge = randomInt(12, 18);
  const randDistrict = randomInt(1, DISTRICTS_COUNT);
  const randWeapon = weapons[randomInt(0, weapons.length - 1)];
  const randCombat = randomInt(0, 10);
  const randSurvival = randomInt(0, 10);
  const randStealth = randomInt(0, 10);
  const randSpeed = randomInt(0, 10);
  const randStrength = randomInt(0, 10);
  const randIntelligence = randomInt(0, 10);

  nameInput.value = randomName;
  genderInput.value = randGender;
  ageInput.value = randAge;
  districtSelect.value = randDistrict;
  weaponSelect.value = randWeapon;
  combatInput.value = randCombat;
  survivalInput.value = randSurvival;
  stealthInput.value = randStealth;
  speedInput.value = randSpeed;
  strengthInput.value = randStrength;
  intelligenceInput.value = randIntelligence;
}
randomizeBtn.addEventListener("click", randomizeTributeForm);

// ===== Add Tribute =====
tributeForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (simulationRunning) {
    alert("Can't add tributes after simulation starts.");
    return;
  }

  const newTribute = {
    name: nameInput.value.trim(),
    gender: genderInput.value,
    age: Number(ageInput.value),
    district: Number(districtSelect.value),
    weapon: weaponSelect.value,
    combat: Number(combatInput.value),
    survival: Number(survivalInput.value),
    stealth: Number(stealthInput.value),
    speed: Number(speedInput.value),
    strength: Number(strengthInput.value),
    intelligence: Number(intelligenceInput.value)
  };

  // Check limits for district gender tributes
  const districtTributes = tributes.filter(t => t.district === newTribute.district && t.gender === newTribute.gender);
  if (districtTributes.length >= MAX_TRIBUTES_PER_GENDER) {
    alert(`District ${newTribute.district} already has max (${MAX_TRIBUTES_PER_GENDER}) ${newTribute.gender} tributes.`);
    return;
  }

  newTribute.trainingScore = calcTrainingScore(newTribute);

  tributes.push(newTribute);
  renderDistricts();
  tributeForm.reset();
});

// ===== Simulation =====

function logEvent(text) {
  eventLog.push(text);
  eventLogElem.textContent = eventLog.join("\n");
  eventLogElem.scrollTop = eventLogElem.scrollHeight;
}

function resetSimulation() {
  simulationRunning = false;
  dayCount = 0;
  aliveTributes = tributes.slice(); // copy all tributes
  alliances = {};
  eventLog = [];
  eventLogElem.textContent = "";
  startSimBtn.disabled = false;
  resetBtn.disabled = true;
  downloadLogBtn.disabled = true;
  renderDistricts();
}

resetBtn.addEventListener("click", resetSimulation);

function downloadLog() {
  const blob = new Blob([eventLog.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `hunger_games_simulation_log_day${dayCount}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
downloadLogBtn.addEventListener("click", downloadLog);

// ===== Alliances and Betrayals =====
// Simple alliance: career districts tend to stick together, others can form or betray randomly
function formAlliances() {
  alliances = {};
  CAREER_DISTRICTS.forEach(d => {
    const members = aliveTributes.filter(t => t.district === d);
    if (members.length) alliances[`district-${d}`] = members;
  });
  // Other districts: some random alliances (or solo)
  for (let d = 1; d <= DISTRICTS_COUNT; d++) {
    if (CAREER_DISTRICTS.includes(d)) continue;
    const members = aliveTributes.filter(t => t.district === d);
    if (members.length) {
      if (Math.random() < 0.3 && members.length > 1) {
        alliances[`district-${d}`] = members;
      } else {
        // Solo
        members.forEach(t => alliances[`solo-${t.name}`] = [t]);
      }
    }
  }
}

// ===== Combat Logic =====

function selectRandomAliveTribute(excludeTribute = null) {
  const candidates = aliveTributes.filter(t => t !== excludeTribute);
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function tributeDies(victim) {
  const idx = aliveTributes.indexOf(victim);
  if (idx >= 0) aliveTributes.splice(idx, 1);
}

// Simplified combat outcome - stronger trainingScore wins (random chance involved)
function combatRound(attacker, defender) {
  const attPower = attacker.trainingScore + Math.random() * 5;
  const defPower = defender.trainingScore + Math.random() * 5;

  if (attPower > defPower) {
    tributeDies(defender);
    return { winner: attacker, loser: defender };
  } else {
    tributeDies(attacker);
    return { winner: defender, loser: attacker };
  }
}

// ===== Event Types =====

const bloodbathActions = [
  (actor, target) => `${actor.name} (D${actor.district}) grabbed a ${actor.weapon} and immediately struck down ${target.name} (D${target.district}).`,
  (actor, target) => `${actor.name} (D${actor.district}) ambushed ${target.name} (D${target.district}) with a ${actor.weapon}.`,
  (actor, target) => `${actor.name} (D${actor.district}) silently snuck up on ${target.name} (D${target.district}) and killed them using a ${actor.weapon}.`,
];

const survivalActions = [
  (actor) => `${actor.name} (D${actor.district}) found food and water and survived the day.`,
  (actor) => `${actor.name} (D${actor.district}) hid skillfully from danger and survived.`,
  (actor) => `${actor.name} (D${actor.district}) avoided all conflict today.`,
];

// ===== Simulation Cycle =====

function simulateDay() {
  dayCount++;
  logEvent(`\nDay ${dayCount} begins...`);

  // Bloodbath on day 1 only
  if (dayCount === 1) {
    const kills = Math.min(5, aliveTributes.length);
    for (let i = 0; i < kills; i++) {
      const attacker = selectRandomAliveTribute();
      if (!attacker) break;
      const victim = selectRandomAliveTribute(attacker);
      if (!victim) break;

      const combatResult = combatRound(attacker, victim);
      logEvent(bloodbathActions[Math.floor(Math.random() * bloodbathActions.length)](combatResult.winner, combatResult.loser));
    }
  } else {
    // Other days simulate random events
    formAlliances();

    // Random chance for combat between tributes
    if (aliveTributes.length > 1 && Math.random() < 0.5) {
      const attacker = selectRandomAliveTribute();
      const defender = selectRandomAliveTribute(attacker);
      if (attacker && defender) {
        const result = combatRound(attacker, defender);
        logEvent(`${result.winner.name} (D${result.winner.district}) defeated ${result.loser.name} (D${result.loser.district}) using ${result.winner.weapon}.`);
      }
    } else {
      // Survival actions for some tributes
      const survivors = aliveTributes.slice(0, Math.min(3, aliveTributes.length));
      survivors.forEach(s => logEvent(survivalActions[Math.floor(Math.random() * survivalActions.length)](s)));
    }
  }

  // Check if only 1 tribute left
  if (aliveTributes.length <= 1) {
    if (aliveTributes.length === 1) {
      logEvent(`\n${aliveTributes[0].name} from District ${aliveTributes[0].district} is the winner!`);
    } else {
      logEvent(`\nAll tributes have died. No winner this time.`);
    }
    simulationRunning = false;
    startSimBtn.disabled = false;
    resetBtn.disabled = false;
    downloadLogBtn.disabled = false;
    return;
  }

  renderDistricts();
  setTimeout(simulateDay, 2000);
}

// ===== Start Simulation =====
startSimBtn.addEventListener("click", () => {
  if (simulationRunning) return;

  if (tributes.length < 2) {
    alert("Add more tributes before starting simulation.");
    return;
  }

  simulationRunning = true;
  aliveTributes = tributes.slice();
  eventLog = [];
  eventLogElem.textContent = "";
  dayCount = 0;
  startSimBtn.disabled = true;
  resetBtn.disabled = false;
  downloadLogBtn.disabled = false;
  simulateDay();
});

// ===== Initial Reset =====
resetSimulation();
