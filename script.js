const tributes = [];
let dayCount = 0;
let aliveTributes = [];
let gameLog = "";
let gameRunning = false;
let fallenToday = [];
let usedArenaEvents = [];

const weapons = ["knife", "spear", "bow", "axe", "slingshot", "rock"];
const arenaEvents = [
  { name: "Mutts", type: "combat" },
  { name: "Acid Rain", type: "hazard" },
  { name: "Feast", type: "feast" },
  { name: "Firestorm", type: "hazard" },
];

const actions = {
  bloodbath: [
    "**${actor.name} (D${actor.district})** grabbed a ${actor.weapon} and struck down **${target.name} (D${target.district})**! 💥",
    "**${target.name} (D${target.district})** was caught off guard by **${actor.name} (D${actor.district})** during the chaos. ⚔️",
    "**${actor.name} (D${actor.district})** lunged with their ${actor.weapon} and eliminated **${target.name} (D${target.district})**. 🩸",
  ],
  kill: [
    "**${actor.name} (D${actor.district})** ambushed and killed **${target.name} (D${target.district})**. 🔪",
    "**${target.name} (D${target.district})** stood no chance against **${actor.name} (D${actor.district})**. 💀",
    "**${actor.name} (D${actor.district})** overpowered **${target.name} (D${target.district})** in a brutal fight. ⚔️",
  ],
  survival: [
    "**${actor.name} (D${actor.district})** avoided danger by hiding. 🫣",
    "**${actor.name} (D${actor.district})** climbed a tree to stay safe. 🌲",
    "**${actor.name} (D${actor.district})** managed to find shelter and survive. 🏕️",
  ],
  arena: {
    Mutts: [
      "**${actor.name} (D${actor.district})** was torn apart by mutts. 🐺",
      "**${actor.name} (D${actor.district})** narrowly escaped the mutts. 🏃‍♂️",
    ],
    AcidRain: [
      "**${actor.name} (D${actor.district})** was caught in the acid rain and succumbed. ☠️",
      "**${actor.name} (D${actor.district})** found shelter just in time. ⛺",
    ],
    Firestorm: [
      "**${actor.name} (D${actor.district})** was engulfed in the firestorm. 🔥",
      "**${actor.name} (D${actor.district})** dodged the fire and survived. 😰",
    ],
    Feast: [
      "**${actor.name} (D${actor.district})** killed **${target.name} (D${target.district})** during the Feast. 🍽️🩸",
      "**${actor.name} (D${actor.district})** took supplies and escaped the Feast safely. 🎒",
    ]
  },
};

function addTribute(name, gender, age, district, weapon, skills) {
  const training = Math.ceil((skills.combat + skills.survival + skills.stealth + skills.speed + skills.strength + skills.intelligence) / 6);
  const tribute = {
    name,
    gender,
    age,
    district,
    weapon,
    skills,
    training,
    alive: true,
    kills: 0,
    placement: null,
  };
  tributes.push(tribute);
  updateTributeDisplay();
}

function updateTributeDisplay() {
  const list = document.getElementById("tributeList");
  list.innerHTML = tributes.map(t => 
    `${t.name} (D${t.district}) - ${t.gender}, Age ${t.age}, Training Score: ${t.training}`
  ).join("<br>");
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

document.getElementById("randomizeBtn").addEventListener("click", () => {
  document.getElementById("name").value = `Tribute${tributes.length + 1}`;
  document.getElementById("gender").value = randomFrom(["Male", "Female"]);
  document.getElementById("age").value = randomInt(12, 18);
  document.getElementById("district").value = randomInt(1, 12);
  document.getElementById("weapon").value = randomFrom(weapons);
  ["combat", "survival", "stealth", "speed", "strength", "intelligence"].forEach(skill => {
    document.getElementById(skill).value = randomInt(0, 12);
  });
});

document.getElementById("createBtn").addEventListener("click", () => {
  const name = document.getElementById("name").value;
  const gender = document.getElementById("gender").value;
  const age = parseInt(document.getElementById("age").value);
  const district = parseInt(document.getElementById("district").value);
  const weapon = document.getElementById("weapon").value;
  const skills = {
    combat: parseInt(document.getElementById("combat").value),
    survival: parseInt(document.getElementById("survival").value),
    stealth: parseInt(document.getElementById("stealth").value),
    speed: parseInt(document.getElementById("speed").value),
    strength: parseInt(document.getElementById("strength").value),
    intelligence: parseInt(document.getElementById("intelligence").value)
  };

  if (tributes.filter(t => t.district === district && t.gender === gender).length >= 1) {
    alert("Each district can only have 1 male and 1 female tribute.");
    return;
  }

  addTribute(name, gender, age, district, weapon, skills);
});

document.getElementById("startSimBtn").addEventListener("click", () => {
  if (tributes.length < 24) return alert("You need 24 tributes to begin the Games!");
  gameRunning = true;
  aliveTributes = [...tributes];
  runBloodbath();
});

function runBloodbath() {
  const count = randomInt(3, 8);
  gameLog += `\n🌅 **The Bloodbath Begins** 🌅\n`;
  processEvents(count, true);
  endPhase("Bloodbath");
}

function runDayNight(phase) {
  const count = randomInt(2, 6);
  if (aliveTributes.length <= 1) {
    endGame();
    return;
  }
  gameLog += `\n${phase === "Day" ? "☀️" : "🌙"} **${phase} ${dayCount}** ${phase === "Day" ? "☀️" : "🌙"}\n`;
  const useArena = Math.random() < 0.4 && usedArenaEvents.length < arenaEvents.length;
  if (useArena) {
    const available = arenaEvents.filter(a => !usedArenaEvents.includes(a.name));
    const chosen = randomFrom(available);
    usedArenaEvents.push(chosen.name);
    processArenaEvent(chosen);
  } else {
    processEvents(count, false);
  }
  endPhase(phase);
}

function processEvents(count, isBloodbath) {
  for (let i = 0; i < count; i++) {
    const actor = randomFrom(aliveTributes);
    if (!actor.alive) continue;
    const others = aliveTributes.filter(t => t !== actor && t.alive);

    if (others.length === 0) break;
    const target = randomFrom(others);

    // District-mate bias: avoid killing unless necessary
    if (actor.district === target.district && others.length > 2 && Math.random() < 0.85) continue;

    const actorScore = actor.training + Math.random() * 6;
    const targetScore = target.training + Math.random() * 6;

    const wins = actorScore >= targetScore;

    if (wins) {
      gameLog += format(actions[isBloodbath ? "bloodbath" : "kill"], actor, target) + "\n";
      target.alive = false;
      actor.kills++;
      fallenToday.push(target);
    } else {
      gameLog += format(actions[isBloodbath ? "bloodbath" : "kill"], target, actor) + "\n";
      actor.alive = false;
      target.kills++;
      fallenToday.push(actor);
    }
  }
}

function processArenaEvent(event) {
  gameLog += `\n⚠️ Arena Event: **${event.name}** ⚠️\n`;
  const affected = aliveTributes.filter(() => Math.random() < 0.5);

  for (let tribute of affected) {
    if (!tribute.alive) continue;
    if (event.type === "feast" && Math.random() < 0.4) {
      const others = aliveTributes.filter(t => t !== tribute && t.alive);
      if (others.length === 0) continue;
      const target = randomFrom(others);
      gameLog += format(actions.arena[event.name][0], tribute, target) + "\n";
      target.alive = false;
      tribute.kills++;
      fallenToday.push(target);
    } else if (Math.random() < 0.4) {
      gameLog += format(actions.arena[event.name][0], tribute) + "\n";
      tribute.alive = false;
      fallenToday.push(tribute);
    } else {
      gameLog += format(actions.arena[event.name][1], tribute) + "\n";
    }
  }
}

function endPhase(phaseName) {
  showFallenTributes();
  aliveTributes = tributes.filter(t => t.alive);
  if (aliveTributes.length <= 1) {
    endGame();
  } else if (phaseName === "Bloodbath") {
    dayCount++;
    setTimeout(() => runDayNight("Day"), 500);
  } else if (phaseName.startsWith("Day")) {
    setTimeout(() => runDayNight("Night"), 500);
  } else if (phaseName.startsWith("Night")) {
    dayCount++;
    setTimeout(() => runDayNight("Day"), 500);
  }
}

function showFallenTributes() {
  if (fallenToday.length === 0) {
    gameLog += `\n🕊️ No tributes fell this phase.\n`;
  } else {
    gameLog += `\n💀 **Fallen Tributes** 💀\n`;
    fallenToday.forEach(t => {
      gameLog += `🔔 ${t.name} (D${t.district}) — Age ${t.age}\n`;
    });
  }
  fallenToday = [];
  document.getElementById("log").innerHTML = gameLog.replace(/\n/g, "<br>");
}

function endGame() {
  gameRunning = false;
  const placements = tributes
    .map(t => ({ ...t }))
    .sort((a, b) => (a.alive === b.alive ? b.kills - a.kills : a.alive ? -1 : 1));

  let placement = 1;
  placements.forEach(t => {
    if (t.alive) t.placement = 1;
    else t.placement = placement++;
  });

  gameLog += `\n🏆 **Final Standings** 🏆\n`;
  placements.forEach(t => {
    gameLog += `#${t.placement} — ${t.name} (D${t.district}) — ${t.kills} kill${t.kills !== 1 ? "s" : ""}\n`;
  });

  document.getElementById("log").innerHTML = gameLog.replace(/\n/g, "<br>");
  document.getElementById("resetBtn").style.display = "block";
  document.getElementById("downloadBtn").style.display = "block";
}

document.getElementById("resetBtn").addEventListener("click", () => {
  tributes.length = 0;
  dayCount = 0;
  aliveTributes = [];
  gameLog = "";
  fallenToday = [];
  usedArenaEvents = [];
  gameRunning = false;
  document.getElementById("log").innerHTML = "";
  updateTributeDisplay();
  document.getElementById("resetBtn").style.display = "none";
  document.getElementById("downloadBtn").style.display = "none";
});

document.getElementById("downloadBtn").addEventListener("click", () => {
  const blob = new Blob([gameLog], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "hunger_games_simulation.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

function format(templateArray, actor, target = null) {
  const template = randomFrom(templateArray);
  return template
    .replace(/\${actor.name}/g, actor.name)
    .replace(/\${actor.district}/g, actor.district)
    .replace(/\${actor.weapon}/g, actor.weapon)
    .replace(/\${target.name}/g, target?.name || "")
    .replace(/\${target.district}/g, target?.district || "");
}
