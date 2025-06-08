const tributes = [];
let dayCount = 1;
let gameLog = "";

function addTribute() {
  const name = document.getElementById("name").value;
  const district = parseInt(document.getElementById("district").value);
  const gender = document.getElementById("gender").value;
  const combat = parseInt(document.getElementById("combat").value);
  const survival = parseInt(document.getElementById("survival").value);
  const stealth = parseInt(document.getElementById("stealth").value);
  const speed = parseInt(document.getElementById("speed").value);
  const strength = parseInt(document.getElementById("strength").value);
  const intelligence = parseInt(document.getElementById("intelligence").value);
  const weapon = document.getElementById("weapon").value;
  const age = randomBetween(12, 18);

  if (!name || !district || !gender || !weapon) {
    alert("Please complete all tribute fields.");
    return;
  }

  tributes.push({
    name,
    district,
    gender,
    age,
    stats: { combat, survival, stealth, speed, strength, intelligence },
    weapon,
    alive: true
  });

  logEvent("Reaping", `**${name} (D${district})**, a ${age}-year-old ${gender}, has been reaped.`);
}

function randomizeStats() {
  document.getElementById("combat").value = randomBetween(1, 10);
  document.getElementById("survival").value = randomBetween(1, 10);
  document.getElementById("stealth").value = randomBetween(1, 10);
  document.getElementById("speed").value = randomBetween(1, 10);
  document.getElementById("strength").value = randomBetween(1, 10);
  document.getElementById("intelligence").value = randomBetween(1, 10);
}

function randomizeWeapon() {
  const weapons = ["Bow", "Axe", "Sword", "Knife", "Spear", "Mace", "Throwing Knives", "Hand to Hand", "No Weapon"];
  const index = Math.floor(Math.random() * weapons.length);
  document.getElementById("weapon").value = weapons[index];
}

function startSimulation() {
  if (tributes.length < 2) {
    alert("At least 2 tributes required.");
    return;
  }

  document.getElementById("download-log").style.display = "inline-block";
  document.getElementById("restart").style.display = "inline-block";

  while (tributes.filter(t => t.alive).length > 1) {
    simulateDay();
    simulateNight();
  }

  const winner = tributes.find(t => t.alive);
  logEvent("Game Over", `🏆 **${winner.name} (D${winner.district})** has won the Hunger Games!`);
}

function simulateDay() {
  logEvent(`Day ${dayCount}`, "");
  randomEvents("day");
}

function simulateNight() {
  logEvent(`Night ${dayCount}`, "");
  randomEvents("night");

  const fallen = tributes.filter(t => !t.alive && !t.loggedDead);
  if (fallen.length > 0) {
    logEvent("Fallen Tributes", "");
    fallen.forEach(t => {
      logEvent("", `💀 **${t.name} (D${t.district})** has fallen. *BOOM* 💣`);
      t.loggedDead = true;
    });
  }
  dayCount++;
}

function randomEvents(period) {
  const alive = tributes.filter(t => t.alive);
  for (let i = 0; i < alive.length; i++) {
    if (Math.random() < 0.3 && alive.length > 1) {
      const attacker = alive[i];
      let victim;
      do {
        victim = alive[Math.floor(Math.random() * alive.length)];
      } while (victim === attacker);

      const attackerPower = attacker.stats.combat + attacker.stats.strength + attacker.stats.speed;
      const victimDefense = victim.stats.survival + victim.stats.stealth + victim.stats.intelligence;

      if (attackerPower + randomBetween(0, 10) > victimDefense + randomBetween(0, 10)) {
        victim.alive = false;
        logEvent("", `**${attacker.name} (D${attacker.district})** attacked and eliminated **${victim.name} (D${victim.district})** with a ${attacker.weapon}.`);
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

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
