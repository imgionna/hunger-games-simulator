// Tribute class with stats and weapon
class Tribute {
  constructor(name, stats, weapon) {
    this.name = name;
    this.stats = stats; // object with combat, survival, stealth, speed, strength, intelligence
    this.weapon = weapon;
    this.alive = true;
  }
}

// Globals
const tributes = [];
let aliveTributes = [];
let day = 0;

const statusDiv = document.getElementById("status");
const logUl = document.getElementById("log");
const nextDayBtn = document.getElementById("nextDayBtn");
const tributeForm = document.getElementById("tribute-form");
const simulationSection = document.getElementById("simulation-section");
const addTributeSection = document.getElementById("add-tribute-section");

// Utility functions
function logEvent(text) {
  const li = document.createElement("li");
  li.textContent = text;
  logUl.appendChild(li);
  logUl.scrollTop = logUl.scrollHeight;
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Calculate combat power for a tribute
function combatPower(tribute) {
  const { combat, strength, speed, intelligence } = tribute.stats;
  // Weapon can give a small boost
  const weaponBonus = {
    "Bow": 2,
    "Axe": 3,
    "Sword": 3,
    "Knife": 1,
    "Spear": 3,
    "Mace": 4,
    "Throwing Knives": 2,
  };
  return combat * 2 + strength + speed + intelligence + (weaponBonus[tribute.weapon] || 0);
}

// Attempt to kill victim by attacker
function attemptKill(attacker, victim) {
  const attackerPower = combatPower(attacker);
  const victimPower = combatPower(victim);

  // Base chance attacker kills victim
  let chance = 0.5 + (attackerPower - victimPower) * 0.05; // small multiplier

  // Clamp chance between 0.1 and 0.9
  chance = Math.min(Math.max(chance, 0.1), 0.9);

  if (Math.random() < chance) {
    victim.alive = false;
    aliveTributes = aliveTributes.filter(t => t !== victim);
    logEvent(`${attacker.name} killed ${victim.name} with a ${attacker.weapon}!`);
    return true;
  } else {
    logEvent(`${victim.name} survived an attack by ${attacker.name}!`);
    return false;
  }
}

function simulateDay() {
  day++;
  statusDiv.textContent = `Day ${day} - ${aliveTributes.length} tributes alive.`;

  if (aliveTributes.length <= 1) {
    if (aliveTributes.length === 1) {
      logEvent(`🏆 ${aliveTributes[0].name} is the winner!`);
    } else {
      logEvent("No one survived...");
    }
    nextDayBtn.disabled = true;
    return;
  }

  // Shuffle alive tributes to randomize order
  const shuffled = [...aliveTributes].sort(() => Math.random() - 0.5);

  for (const tribute of shuffled) {
    if (!tribute.alive) continue;

    const eventChance = Math.random();

    if (eventChance < 0.35) {
      // Kill event: pick a victim other than self
      const victims = aliveTributes.filter(t => t !== tribute);
      if (victims.length === 0) break;
      const victim = getRandomItem(victims);
      attemptKill(tribute, victim);
    } else if (eventChance < 0.55) {
      logEvent(`${tribute.name} got injured but survived.`);
    } else if (eventChance < 0.85) {
      logEvent(`${tribute.name} found some food and regained strength.`);
    } else {
      logEvent(`${tribute.name} is resting peacefully.`);
    }
  }
}

// Handle tribute form submit
tributeForm.addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("tribute-name").value.trim();
  if (!name) return alert("Please enter a name.");

  const stats = {
    combat: Number(document.getElementById("combat").value),
    survival: Number(document.getElementById("survival").value),
    stealth: Number(document.getElementById("stealth").value),
    speed: Number(document.getElementById("speed").value),
    strength: Number(document.getElementById("strength").value),
    intelligence: Number(document.getElementById("intelligence").value),
  };

  const weapon = document.getElementById("weapon").value;

  const newTribute = new Tribute(name, stats, weapon);
  tributes.push(newTribute);
  aliveTributes.push(newTribute);

  logEvent(`Added tribute: ${name} with weapon: ${weapon}`);

  tributeForm.reset();
  document.getElementById("combat").value = 5;
  document.getElementById("survival").value = 5;
  document.getElementById("stealth").value = 5;
  document.getElementById("speed").value = 5;
  document.getElementById("strength").value = 5;
  document.getElementById("intelligence").value = 5;

  // Show simulation controls once we have at least 2 tributes
  if (aliveTributes.length >= 2) {
    simulationSection.style.display = "block";
  }
});

// Start simulation button
nextDayBtn.addEventListener("click", () => {
  simulateDay();
});