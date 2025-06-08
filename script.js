const tributes = [];
let dayCount = 1;
let gameLog = "";
let alliances = []; // to track groups
let careerPack = []; // alliance for careers
let eventsToday = 0;

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

  // auto-career pack
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

  // set up alliances
  alliances.push(careerPack);

  while (tributes.filter(t => t.alive).length > 1) {
    simulateDay();
    simulateNight();
    if (dayCount === 3) triggerFeast();
  }

  const winner = tributes.find(t => t.alive);
  logEvent("Game Over", `\uD83C\uDFC6 **${winner.name} (D${winner.district})** wins the Hunger Games!`);
}

function simulateDay() {
  logEvent(`Day ${dayCount}`, "");
  eventsToday = 0;
  simulateEncounters();
}

function simulateNight() {
  logEvent(`Night ${dayCount}`, "");
  eventsToday = 0;
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

function simulateEncounters(isNight = false) {
  const alive = tributes.filter(t => t.alive);
  const shuffled = [...alive].sort(() => Math.random() - 0.5);

  for (let i = 0; i < shuffled.length; i++) {
    const actor = shuffled[i];
    if (!actor.alive) continue;

    if (Math.random() < 0.25 && shuffled.length > 1) {
      let target;
      do {
        target = shuffled[Math.floor(Math.random() * shuffled.length)];
      } while (target === actor || !target.alive);

      // betrayal chance within alliance
      const sameAlliance = alliances.some(group => group.includes(actor) && group.includes(target));
      if (sameAlliance && Math.random() < 0.85) continue;

      const attack = actor.stats.combat + actor.stats.strength + actor.stats.speed;
      const defense = target.stats.survival + target.stats.stealth;

      const attackScore = attack + randomBetween(0, 10);
      const defenseScore = defense + randomBetween(0, 10);

      if (attackScore > defenseScore) {
        target.alive = false;
        logEvent("", `**${actor.name} (D${actor.district})** ambushed and killed **${target.name} (D${target.district})** using a ${actor.weapon}.`);
      } else {
        const verbs = ["tried to ambush", "clashed with", "attacked but failed against"];
        const verb = verbs[Math.floor(Math.random() * verbs.length)];
        logEvent("", `**${actor.name} (D${actor.district})** ${verb} **${target.name} (D${target.district})** but failed.`);
      }
    } else if (Math.random() < 0.2) {
      logEvent("", `**${actor.name} (D${actor.district})** scavenges for resources and avoids conflict.`);
    }
  }
}

function triggerFeast() {
  logEvent("The Feast", "The Cornucopia is replenished with food, supplies, and weapons!");
  const contenders = tributes.filter(t => t.alive);
  contenders.forEach(t => {
    if (Math.random() < 0.5) {
      logEvent("", `**${t.name} (D${t.district})** risks the feast and gains supplies.`);
    } else {
      logEvent("", `**${t.name} (D${t.district})** stays away from the feast, avoiding danger.`);
    }
  });
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
