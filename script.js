const tributes = [];
let dayCount = 1;
let gameLog = "";
let tempAge = 12; // temp variable for random age

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
  tempAge = randomBetween(12, 18);
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

  if (!name || !district || isNaN(district) || district < 1 || district > 12) {
    alert("Please provide a valid name and district (1-12).");
    return;
  }

  const stats = {
    combat: parseInt(document.getElementById("combat").value),
    survival: parseInt(document.getElementById("survival").value),
    stealth: parseInt(document.getElementById("stealth").value),
    speed: parseInt(document.getElementById("speed").value),
    strength: parseInt(document.getElementById("strength").value),
    intelligence: parseInt(document.getElementById("intelligence").value)
  };

  const weapon = document.getElementById("weapon").value;

  if (Object.values(stats).some(stat => isNaN(stat) || stat < 1 || stat > 10)) {
    alert("Stats must be between 1 and 10.");
    return;
  }

  const tribute = {
    name,
    district,
    gender,
    age: tempAge || randomBetween(12, 18),
    stats,
    weapon,
    alive: true,
    loggedDead: false
  };

  tributes.push(tribute);
  logEvent("Reaping", `**${name} (D${district})**, a ${tribute.age}-year-old ${gender}, has been reaped.`);
}

function startSimulation() {
  if (tributes.length < 2) {
    alert("Add at least 2 tributes.");
    return;
  }

  document.getElementById("download-log").style.display = "inline-block";
  document.getElementById("restart").style.display = "inline-block";

  while (tributes.filter(t => t.alive).length > 1) {
    simulateDay();
    simulateNight();
  }

  const winner = tributes.find(t => t.alive);
  logEvent("Game Over", `🏆 **${winner.name} (D${winner.district})** wins the Hunger Games!`);
}

function simulateDay() {
  logEvent(`Day ${dayCount}`, "");
  randomEvents();
}

function simulateNight() {
  logEvent(`Night ${dayCount}`, "");
  randomEvents();

  const fallen = tributes.filter(t => !t.alive && !t.loggedDead);
  if (fallen.length) {
    logEvent("Fallen Tributes", "");
    fallen.forEach(t => {
      logEvent("", `💀 **${t.name} (D${t.district})** has fallen. *BOOM*`);
      t.loggedDead = true;
    });
  }

  dayCount++;
}

function randomEvents() {
  const alive = tributes.filter(t => t.alive);
  for (let i = 0; i < alive.length; i++) {
    if (Math.random() < 0.3 && alive.length > 1) {
      const attacker = alive[i];
      let victim;
      do {
        victim = alive[Math.floor(Math.random() * alive.length)];
      } while (victim === attacker);

      const attackPower =
        attacker.stats.combat + attacker.stats.strength + attacker.stats.speed + attacker.stats.intelligence;
      const defense =
        victim.stats.survival + victim.stats.stealth + victim.stats.intelligence;

      if (attackPower + randomBetween(0, 10) > defense + randomBetween(0, 10)) {
        victim.alive = false;
        logEvent("", `**${attacker.name} (D${attacker.district})** eliminated **${victim.name} (D${victim.district})** with a ${attacker.weapon}.`);
      } else {
        logEvent("", `**${attacker.name} (D${attacker.district})** tried to attack **${victim.name} (D${victim.district})**, but failed.`);
      }
    }
  }
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
