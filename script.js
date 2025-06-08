const weapons = [
  "bow",
  "axe",
  "sword",
  "knife",
  "spear",
  "mace",
  "throwing knives",
  "hand to hand",
  "no weapon",
];

let tributes = [];
let simulationLog = [];
let simulationStarted = false;

// Random integer inclusive helper
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Randomize tribute stats (1 to 10)
function randomizeStats() {
  return {
    combat: randomInt(1, 10),
    survival: randomInt(1, 10),
    stealth: randomInt(1, 10),
    speed: randomInt(1, 10),
    strength: randomInt(1, 10),
    intelligence: randomInt(1, 10),
  };
}

// Randomize weapon
function randomizeWeapon(stats) {
  const {combat, strength, stealth, speed} = stats;
  if (combat >= 7 && strength >= 7) {
    return ["axe", "sword", "mace", "spear"][randomInt(0,3)];
  } else if (stealth >= 7 || speed >=7) {
    return ["knife", "throwing knives", "hand to hand", "no weapon"][randomInt(0,3)];
  } else {
    return weapons[randomInt(0, weapons.length - 1)];
  }
}

// Update tribute list display
function updateTributesList() {
  const ul = document.getElementById("tributes-list");
  ul.innerHTML = "";
  tributes.forEach((t, idx) => {
    const li = document.createElement("li");
    li.textContent = `${t.name} | Age: ${t.age} | Gender: ${t.gender} | Weapon: ${t.weapon}`;
    ul.appendChild(li);
  });
}

// Add event log section title
function addEventLogSection(title) {
  const eventLog = document.getElementById("event-log");
  const sectionTitle = document.createElement("div");
  sectionTitle.className = "section-title";
  sectionTitle.textContent = title;
  eventLog.appendChild(sectionTitle);
}

// Add event log line
function addEventLog(text) {
  const eventLog = document.getElementById("event-log");
  const p = document.createElement("p");
  p.innerHTML = text;
  eventLog.appendChild(p);
  eventLog.scrollTop = eventLog.scrollHeight;
  simulationLog.push(text);
}

// Add tribute function
function addTribute() {
  if (simulationStarted) {
    alert("Cannot add tributes after simulation started.");
    return;
  }
  const nameInput = document.getElementById("tribute-name");
  const districtInput = document.getElementById("tribute-district");
  const combatInput = document.getElementById("combat");
  const survivalInput = document.getElementById("survival");
  const stealthInput = document.getElementById("stealth");
  const speedInput = document.getElementById("speed");
  const strengthInput = document.getElementById("strength");
  const intelligenceInput = document.getElementById("intelligence");
  const weaponInput = document.getElementById("weapon");

  let name = nameInput.value.trim();
  if (!name) {
    alert("Please enter a tribute name.");
    return;
  }
  const district = districtInput.value;

  const stats = {
    combat: Number(combatInput.value) || randomInt(1,10),
    survival: Number(survivalInput.value) || randomInt(1,10),
    stealth: Number(stealthInput.value) || randomInt(1,10),
    speed: Number(speedInput.value) || randomInt(1,10),
    strength: Number(strengthInput.value) || randomInt(1,10),
    intelligence: Number(intelligenceInput.value) || randomInt(1,10),
  };

  const age = randomInt(12,18);
  const gender = Math.random() < 0.5 ? "Male" : "Female";

  let weapon = weaponInput.value;
  if (!weapons.includes(weapon)) {
    weapon = randomizeWeapon(stats);
  }

  const tribute = {
    name: `${name} (D${district})`,
    age,
    gender,
    stats,
    weapon,
    alive: true,
  };

  tributes.push(tribute);
  updateTributesList();

  addEventLogSection("Reaping");
  addEventLog(`<span class="bold">${tribute.name} (Age: ${tribute.age}, ${tribute.gender})</span> has been reaped.`);

  nameInput.value = "";
  combatInput.value = "";
  survivalInput.value = "";
  stealthInput.value = "";
  speedInput.value = "";
  strengthInput.value = "";
  intelligenceInput.value = "";
  weaponInput.value = "bow";
}

// Randomize stats inputs
document.getElementById("randomize-stats").onclick = () => {
  const stats = randomizeStats();
  document.getElementById("combat").value = stats.combat;
  document.getElementById("survival").value = stats.survival;
  document.getElementById("stealth").value = stats.stealth;
  document.getElementById("speed").value = stats.speed;
  document.getElementById("strength").value = stats.strength;
  document.getElementById("intelligence").value = stats.intelligence;

  const w = randomizeWeapon(stats);
  document.getElementById("weapon").value = w;
};

// Randomize weapon button
document.getElementById("randomize-weapon").onclick = () => {
  const stats = {
    combat: Number(document.getElementById("combat").value) || randomInt(1,10),
    survival: Number(document.getElementById("survival").value) || randomInt(1,10),
    stealth: Number(document.getElementById("stealth").value) || randomInt(1,10),
    speed: Number(document.getElementById("speed").value) || randomInt(1,10),
    strength: Number(document.getElementById("strength").value) || randomInt(1,10),
    intelligence: Number(document.getElementById("intelligence").value) || randomInt(1,10),
  };
  const w = randomizeWeapon(stats);
  document.getElementById("weapon").value = w;
};

// Add tribute button
document.getElementById("add-tribute").onclick = () => addTribute();

// Calculate who wins a scenario between two tributes based on stats, age, gender
function calculateScenarioOutcome(tribute1, tribute2) {
  let score1 = tribute1.stats.combat + tribute1.stats.strength + tribute1.stats.speed;
  let score2 = tribute2.stats.combat + tribute2.stats.strength + tribute2.stats.speed;

  // Age modifier: older tributes get small strength boost
  score1 += (tribute1.age - 12) * 0.3;
  score2 += (tribute2.age - 12) * 0.3;

  // Gender modifier: males +0.5 strength boost
  if (tribute1.gender === "Male") score1 += 0.5;
  if (tribute2.gender === "Male") score2 += 0.5;

  // Weapon advantage
  const weaponPower = {
    bow: 1.5,
    axe: 2,
    sword: 2,
    knife: 1,
    spear: 1.8,
    mace: 2,
    "throwing knives": 1.2,
    "hand to hand": 1,
    "no weapon": 0.5,
  };
  score1 += weaponPower[tribute1.weapon] || 1;
  score2 += weaponPower[tribute2.weapon] || 1;

  return score1 >= score2 ? tribute1 : tribute2;
}

// Simulation main function
function runSimulation() {
  if (simulationStarted) return;
  if (tributes.length < 2) {
    alert("Add at least two tributes to start the simulation.");
    return;
  }
  simulationStarted = true;
  document.getElementById("start-simulation").disabled = true;
  document.getElementById("restart-reaping").style.display = "inline-block";
  document.getElementById("download-log").style.display = "inline-block";

  const eventLog = document.getElementById("event-log");
  eventLog.innerHTML = "";
  simulationLog = [];

  addEventLogSection("Reaping");
  tributes.forEach((t) => {
    addEventLog(`<span class="bold">${t.name} (Age: ${t.age}, ${t.gender})</span> has been reaped.`);
  });

  let day = 1;
  let aliveTributes = tributes.filter((t) => t.alive);

  function simulateDay() {
    if (aliveTributes.length <= 1) {
      endSimulation();
      return;
    }

    addEventLogSection(`Day ${day}`);

    const eventType = Math.random() < 0.6 ? "fight" : "survival";

    if (eventType === "fight" && aliveTributes.length > 1) {
      let idx1 = randomInt(0, aliveTributes.length - 1);
      let idx2;
      do {
        idx2 = randomInt(0, aliveTributes.length - 1);
      } while (idx2 === idx1);

      const t1 = aliveTributes[idx1];
      const t2 = aliveTributes[idx2];
      const winner = calculateScenarioOutcome(t1, t2);
      const loser = winner === t1 ? t2 : t1;
      loser.alive = false;

      addEventLog(
        `<span class="bold">${t1.name}</span> fought <span class="bold">${t2.name}</span>. ` +
        `<span class="bold">${winner.name}</span> won.`
      );
    } else {
      const t = aliveTributes[randomInt(0, aliveTributes.length - 1)];
      const survivalScore = t.stats.survival + t.stats.stealth + t.stats.intelligence + (t.age - 12) * 0.2;
      const successChance = survivalScore / 40;
      if (Math.random() < successChance) {
        addEventLog(`<span class="bold">${t.name}</span> survived a dangerous challenge.`);
      } else {
        t.alive = false;
        addEventLog(`<span class="bold">${t.name}</span> failed a survival challenge and died.`);
      }
    }

    aliveTributes = tributes.filter((t) => t.alive);

    addEventLogSection(`Night ${day}`);

    const fallenTonight = tributes.filter((t) => !t.alive && !t.fallenLogged);
    if (fallenTonight.length > 0) {
      addEventLogSection("Fallen Tributes");
      fallenTonight.forEach((t) => {
        addEventLog(`💥 The cannon sounds for <span class="bold">${t.name}</span>.`);
        t.fallenLogged = true;
      });
    } else {
      addEventLog("No tributes died tonight.");
    }

    day++;
    if (aliveTributes.length <= 1) {
      endSimulation();
    } else {
      setTimeout(simulateDay, 1500);
    }
  }

  function endSimulation() {
    addEventLogSection("Game Over");
    const winner = tributes.find((t) => t.alive);
    if (winner) {
      addEventLog(`<span class="bold">${winner.name}</span> is the winner!`);
    } else {
      addEventLog("No one survived.");
    }
    document.getElementById("restart-reaping").style.display = "inline-block";
  }

  simulateDay();
}

document.getElementById("start-simulation").onclick = () => runSimulation();

document.getElementById("restart-reaping").onclick = () => {
  tributes = [];
  simulationLog = [];
  simulationStarted = false;
  updateTributesList();
  document.getElementById("event-log").innerHTML = "";
  document.getElementById("start-simulation").disabled = false;
  document.getElementById("restart-reaping").style.display = "none";
  document.getElementById("download-log").style.display = "none";
};

document.getElementById("download-log").onclick = () => {
  const blob = new Blob([simulationLog.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "hunger_games_simulation_log.txt";
  a.click();
  URL.revokeObjectURL(url);
};
