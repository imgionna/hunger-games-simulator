const tributes = [];
let dayCount = 0;
let gameLog = "";
let alliances = []; // to track groups
let careerPack = []; // alliance for careers
let eventsToday = 0;

// Preloaded actions
const actions = {
  bloodbath: [...`...`, // fill with bloodbath strings
  ],
  combatKill: [...`...`, // combat kill strings
  ],
  combatSurvive: [...`...`, // combat survive strings
  survival: [...`...`], // neutral survival strings
  alliance: [...`...`], // alliance/betrayal strings
  feastCombat: [...`...`],
  feastSurvive: [...`...`],
  naturalDeath: [...`...`]
};

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomizeStats() {
  document.getElementById("combat").value = randomBetween(1, 10);
  document.getElementById("survival").value = randomBetween(1, 10);
  document.getElementById("stealth").value = randomBetween(1, 10);
  document.getElementById("speed").value = randomBetween(1, 10);
  document.getElementById("strength").value = randomBetween(1, 10);
  document.getElementById("intelligence").value = randomBetween(1, 10);
  document.getElementById("age").value = randomBetween(12, 18);
}

function randomizeWeapon() {
  const weapons = [
    "Bow", "Axe", "Sword", "Knife",
    "Spear", "Mace", "Throwing Knives",
    "Hand to Hand", "No Weapon"
  ];
  const randomWeapon = weapons[Math.floor(Math.random() * weapons.length)];
  document.getElementById("weapon").value = randomWeapon;
}

function randomizeName() {
  const names = ["Ash", "Rowan", "Lark", "Quinn", "Reed", "Kai", "Nova", "Juno", "Vale", "Skye"];
  document.getElementById("name").value = randomChoice(names);
}

function addTribute() {
  const name = document.getElementById("name").value.trim();
  const district = parseInt(document.getElementById("district").value);
  const gender = document.getElementById("gender").value;
  const age = parseInt(document.getElementById("age").value);

  const stats = {
    combat: parseInt(document.getElementById("combat").value),
    survival: parseInt(document.getElementById("survival").value),
    stealth: parseInt(document.getElementById("stealth").value),
    speed: parseInt(document.getElementById("speed").value),
    strength: parseInt(document.getElementById("strength").value),
    intelligence: parseInt(document.getElementById("intelligence").value)
  };

  const weapon = document.getElementById("weapon").value;

  if (!name || !district || isNaN(district) || district < 1 || district > 12 || isNaN(age)) {
    alert("Please fill out all fields with valid values.");
    return;
  }

  if (Object.values(stats).some(stat => isNaN(stat) || stat < 1 || stat > 10)) {
    alert("Stats must be between 1 and 10.");
    return;
  }

  const tribute = {
    name,
    district,
    gender,
    age,
    stats,
    weapon,
    alive: true,
    loggedDead: false
  };

  tributes.push(tribute);
  if ([1, 2, 4].includes(district)) careerPack.push(tribute);
  logEvent("Reaping", `**${name} (D${district})**, a ${age}-year-old ${gender}, has been reaped.`);
}

function startSimulation() {
  if (tributes.length < 2) {
    alert("Add at least 2 tributes.");
    return;
  }
  document.getElementById("download-log").style.display = "inline-block";
  document.getElementById("restart").style.display = "inline-block";

  alliances.push(careerPack);
  simulateBloodbath();

  while (tributes.filter(t => t.alive).length > 1) {
    simulateDay();
    simulateNight();
    if (dayCount === 3) triggerFeast();
  }

  const winner = tributes.find(t => t.alive);
  logEvent("Game Over", `\uD83C\uDFC6 **${winner.name} (D${winner.district})** wins the Hunger Games!`);
}

function simulateBloodbath() {
  logEvent("Bloodbath", "Tributes rush the Cornucopia!");
  simulateEncounters(false, true);
  dayCount = 1;
}

function simulateDay() {
  logEvent(`Day ${dayCount}`, "");
  simulateEncounters();
}

function simulateNight() {
  logEvent(`Night ${dayCount}`, "");
  simulateEncounters(true);
  const fallen = tributes.filter(t => !t.alive && !t.loggedDead);
  if (fallen.length) {
    logEvent("Fallen Tributes", "");
    fallen.forEach(t => {
      logEvent("", `\uD83D\uDC80 **${t.name} (D${t.district})** has fallen. *BOOM*`);
      t.loggedDead = true;
    });
  }
  dayCount++;
}

function simulateEncounters(isNight = false, isBloodbath = false) {
  const alive = tributes.filter(t => t.alive);
  const shuffled = [...alive].sort(() => Math.random() - 0.5);

  for (let i = 0; i < shuffled.length; i++) {
    const actor = shuffled[i];
    if (!actor.alive) continue;

    if (Math.random() < 0.4 && shuffled.length > 1) {
      let target;
      do {
        target = shuffled[Math.floor(Math.random() * shuffled.length)];
      } while (target === actor || !target.alive);

      const sameAlliance = alliances.some(group => group.includes(actor) && group.includes(target));
      if (sameAlliance && Math.random() < 0.85) continue;

      const attackScore = actor.stats.combat + actor.stats.strength + actor.stats.speed + randomBetween(0, 10);
      const defenseScore = target.stats.survival + target.stats.stealth + randomBetween(0, 10);

      if (attackScore > defenseScore) {
        target.alive = false;
        const template = isBloodbath ? randomChoice(actions.bloodbath) : randomChoice(actions.combatKill);
        logEvent("", formatTemplate(template, actor, target));
      } else {
        const template = randomChoice(actions.combatSurvive);
        logEvent("", formatTemplate(template, actor, target));
      }
    } else if (Math.random() < 0.2) {
      const template = randomChoice(actions.survival);
      logEvent("", formatTemplate(template, actor));
    }
  }
}

function triggerFeast() {
  logEvent("The Feast", "The Cornucopia is replenished with food, supplies, and weapons!");
  const contenders = tributes.filter(t => t.alive);
  contenders.forEach(t => {
    if (Math.random() < 0.5) {
      logEvent("", formatTemplate(randomChoice(actions.feastSurvive), t));
    } else {
      const others = contenders.filter(o => o !== t);
      if (others.length) {
        const enemy = randomChoice(others);
        if (Math.random() < 0.6) {
          enemy.alive = false;
          logEvent("", formatTemplate(randomChoice(actions.feastCombat), t, enemy));
        } else {
          logEvent("", formatTemplate(randomChoice(actions.combatSurvive), t, enemy));
        }
      }
    }
  });
}

function formatTemplate(template, actor, target = {}) {
  return template
    .replaceAll("${actor.name}", actor.name)
    .replaceAll("${actor.district}", actor.district)
    .replaceAll("${actor.weapon}", actor.weapon)
    .replaceAll("${target.name}", target.name || "")
    .replaceAll("${target.district}", target.district || "")
    .replaceAll("${target.weapon}", target.weapon || "");
}

function logEvent(title, message) {
  if (title) gameLog += `\n=== ${title} ===\n`;
  if (message) gameLog += message + "\n";
  document.getElementById("event-log").textContent = gameLog;
}

function downloadLog() {
  const blob = new Blob([gameLog], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "hunger_games_log.txt";
  link.click();
}

function restartGame() {
  location.reload();
}
