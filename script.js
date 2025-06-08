class Tribute {
  constructor(name, district, stats, weapon) {
    this.name = name;
    this.district = district;
    this.stats = stats;
    this.weapon = weapon;
    this.alive = true;
  }
}

const tributes = [];
let aliveTributes = [];
let phase = 0; // 0 = not started, 1 = Day 1, 2 = Night 1, 3 = Day 2, etc.

const statusDiv = document.getElementById("status");
const logUl = document.getElementById("log");
const nextPhaseBtn = document.getElementById("nextPhaseBtn");
const tributeForm = document.getElementById("tribute-form");
const simulationSection = document.getElementById("simulation-section");
const addTributeSection = document.getElementById("add-tribute-section");
const randomizeBtn = document.getElementById("randomize-btn");
const randomizeWeaponBtn = document.getElementById("randomize-weapon-btn");

function logEvent(text) {
  const li = document.createElement("li");
  li.textContent = text;
  logUl.appendChild(li);
  logUl.scrollTop = logUl.scrollHeight;
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function combatPower(tribute) {
  const { combat, strength, speed, intelligence } = tribute.stats;

  const weaponBonus = {
    "Bow": 2,
    "Axe": 3,
    "Sword": 3,
    "Knife": 1,
    "Spear": 3,
    "Mace": 4,
    "Throwing Knives": 2,
    "Hand to Hand": 1,
    "No Weapon": 0,
  };

  return combat * 2 + strength + speed + intelligence + (weaponBonus[tribute.weapon] || 0);
}

function attemptKill(attacker, victim) {
  const attackerPower = combatPower(attacker);
  const victimPower = combatPower(victim);

  let chance = 0.5 + (attackerPower - victimPower) * 0.05;

  chance = Math.min(Math.max(chance, 0.1), 0.9);

  if (Math.random() < chance) {
    victim.alive = false;
    aliveTributes = aliveTributes.filter(t => t !== victim);
    logEvent(`${attacker.name} (District ${attacker.district}) killed ${victim.name} (District ${victim.district}) with a ${attacker.weapon}!`);
    return true;
  } else {
    logEvent(`${victim.name} (District ${victim.district}) survived an attack by ${attacker.name} (District ${attacker.district})!`);
    return false;
  }
}

function simulateDayOrNight() {
  phase++;
  const isDay = phase % 2 === 1; // Odd phases are Day, even are Night
  const cycleNum = Math.ceil(phase / 2);

  statusDiv.textContent = `${isDay ? 'Day' : 'Night'} ${cycleNum} - ${aliveTributes.length} tributes alive.`;

  if (aliveTributes.length <= 1) {
    if (aliveTributes.length === 1) {
      logEvent(`🏆 ${aliveTributes[0].name} from District ${aliveTributes[0].district} is the winner!`);
    } else {
      logEvent("No one survived...");
    }
    nextPhaseBtn.disabled = true;
    return;
  }

  const shuffled = [...aliveTributes].sort(() => Math.random() - 0.5);

  for (const tribute of shuffled) {
    if (!tribute.alive) continue;

    const eventChance = Math.random();

    if (eventChance < 0.35) {
      // Kill event
      const victims = aliveTributes.filter(t => t !== tribute);
      if (victims.length === 0) break;
      const victim = getRandomItem(victims);
      attemptKill(tribute, victim);
    } else if (eventChance < 0.55) {
      logEvent(`${tribute.name} (District ${tribute.district}) got injured but survived.`);
    } else if (eventChance < 0.85) {
      logEvent(`${tribute.name} (District ${tribute.district}) found some food and regained strength.`);
    } else {
      logEvent(`${tribute.name} (District ${tribute.district}) is resting peacefully.`);
    }
  }
}

tributeForm.addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("tribute-name").value.trim();
  const district = document.getElementById("district").value;
  if (!name) return alert("Please enter a name.");
  if (!district) return alert("Please select a district.");

  const stats = {
    combat: Number(document.getElementById("combat").value),
    survival: Number(document.getElementById("survival").value),
    stealth: Number(document.getElementById("stealth").value),
    speed: Number(document.getElementById("speed").value),
    strength: Number(document.getElementById("strength").value),
    intelligence: Number(document.getElementById("intelligence").value),
  };

  const weapon = document.getElementById("weapon").value;

  const newTribute = new Tribute(name, district, stats, weapon);
  tributes.push(newTribute);
  aliveTributes.push(newTribute);

  logEvent(`Added tribute: ${name} from District ${district} with weapon: ${weapon}`);

  tributeForm.reset();
  document.getElementById("combat").value = 5;
  document.getElementById("survival").value = 5;
  document.getElementById("stealth").value = 5;
  document.getElementById("speed").value = 5;
  document.getElementById("strength").value = 5;
  document.getElementById("intelligence").value = 5;
  document.getElementById("district").value = "";

  if (aliveTributes.length >= 2) {
    simulationSection.style.display = "block";
  }
});

// Randomize stats button
randomizeBtn.addEventListener("click", () => {
  const randomStat = () => Math.floor(Math.random() * 10) + 1;
  document.getElementById("combat").value = randomStat();
  document.getElementById("survival").value = randomStat();
  document.getElementById("stealth").value = randomStat();
  document.getElementById("speed").value = randomStat();
  document.getElementById("strength").value = randomStat();
  document.getElementById("intelligence").value = randomStat();
});

// Randomize weapon button
const weapons = [
  "Bow",
  "Axe",
  "Sword",
  "Knife",
  "Spear",
  "Mace",
  "Throwing Knives",
  "Hand to Hand",
  "No Weapon",
];

randomizeWeaponBtn.addEventListener("click", () => {
  const randomWeapon = getRandomItem(weapons);
  document.getElementById("weapon").value = randomWeapon;
});

nextPhaseBtn.addEventListener("click", () => {
  simulateDayOrNight();
});
