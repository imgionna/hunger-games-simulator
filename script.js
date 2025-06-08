const tributes = [];
let dayCount = 0;
let gameLog = "";
let alliances = [];
let careerPack = [];

const actions = {
  bloodbath: [
  "${actor.name} (D${actor.district}) grabbed a ${actor.weapon} and immediately struck down ${target.name} (D${target.district}).",
  "${actor.name} (D${actor.district}) sprinted for the Cornucopia and impaled ${target.name} (D${target.district}) on a spike.",
  "${actor.name} (D${actor.district}) panicked and beat ${target.name} (D${target.district}) to death with a rock.",
  "${actor.name} (D${actor.district}) was the first to draw blood, slashing ${target.name} (D${target.district}) across the face.",
  "${actor.name} (D${actor.district}) tackled ${target.name} (D${target.district}) into the weapons pile and stabbed them.",
  "${actor.name} (D${actor.district}) slipped away unnoticed while others fought to the death.",
  "${actor.name} (D${actor.district}) took down ${target.name} (D${target.district}) with a surprise axe swing.",
  "${actor.name} (D${actor.district}) tripped and had their throat slit by ${target.name} (D${target.district}).",
  "${actor.name} (D${actor.district}) found a bow and shot ${target.name} (D${target.district}) in the back as they ran.",
  "${actor.name} (D${actor.district}) used a shield to block an attack and retaliated by slicing open ${target.name} (D${target.district}).",
  "${actor.name} (D${actor.district}) crushed ${target.name} (D${target.district})'s skull with a mace.",
  "${actor.name} (D${actor.district}) grabbed supplies and vanished into the trees.",
  "${actor.name} (D${actor.district}) killed ${target.name} (D${target.district}) with a well-aimed throwing knife.",
  "${actor.name} (D${actor.district}) stabbed ${target.name} (D${target.district}) repeatedly before anyone could react.",
  "${actor.name} (D${actor.district}) grabbed ${target.name} (D${target.district})'s bag and bashed them with it until they stopped moving.",
  "${actor.name} (D${actor.district}) snatched food and ran while chaos unfolded.",
  "${actor.name} (D${actor.district}) tried to run but was speared in the back by ${target.name} (D${target.district}).",
  "${actor.name} (D${actor.district}) killed three tributes with a stolen trident.",
  "${actor.name} (D${actor.district}) crawled under the Cornucopia and hid.",
  "${actor.name} (D${actor.district}) leapt over a dead body to stab ${target.name} (D${target.district}) in the neck.",
  "${actor.name} (D${actor.district}) fought off two attackers and walked away bleeding but alive.",
  "${actor.name} (D${actor.district}) bashed ${target.name} (D${target.district})’s face in with a crate lid.",
  "${actor.name} (D${actor.district}) sliced open ${target.name} (D${target.district})’s leg, then finished the job as they fell.",
  "${actor.name} (D${actor.district}) feigned alliance, then slit ${target.name} (D${target.district})’s throat at the Cornucopia.",
  "${actor.name} (D${actor.district}) was killed trying to wrestle away a ${target.weapon} from ${target.name} (D${target.district})."
];
  combatKill: [
  "${actor.name} (D${actor.district}) ambushed and killed ${target.name} (D${target.district}) using a ${actor.weapon}.",
  "${actor.name} (D${actor.district}) snuck up on ${target.name} (D${target.district}) and slit their throat with a ${actor.weapon}.",
  "${actor.name} (D${actor.district}) overpowered ${target.name} (D${target.district}) in a brutal brawl and bludgeoned them with a ${actor.weapon}.",
  "${actor.name} (D${actor.district}) shot ${target.name} (D${target.district}) through the heart with a ${actor.weapon}.",
  "${actor.name} (D${actor.district}) impaled ${target.name} (D${target.district}) with a ${actor.weapon} after a chase through the woods.",
  "${actor.name} (D${actor.district}) disarmed ${target.name} (D${target.district}) and finished them off with their own ${target.weapon}.",
  "${actor.name} (D${actor.district}) pushed ${target.name} (D${target.district}) off a cliff during a heated struggle.",
  "${actor.name} (D${actor.district}) broke ${target.name} (D${target.district})’s neck after ambushing them from the shadows.",
  "${actor.name} (D${actor.district}) threw a ${actor.weapon} into ${target.name} (D${target.district})’s chest from a distance.",
  "${actor.name} (D${actor.district}) tricked ${target.name} (D${target.district}) into a trap and crushed them with a falling log.",
  "${actor.name} (D${actor.district}) snapped ${target.name} (D${target.district})’s spine after catching them off-guard.",
  "${actor.name} (D${actor.district}) set fire to ${target.name} (D${target.district})’s shelter, then cut them down as they fled.",
  "${actor.name} (D${actor.district}) strangled ${target.name} (D${target.district}) with a cord made from vines.",
  "${actor.name} (D${actor.district}) lured ${target.name} (D${target.district}) into a snare, then stabbed them repeatedly with a ${actor.weapon}.",
  "${actor.name} (D${actor.district}) rammed a ${actor.weapon} through ${target.name} (D${target.district})’s chest in the middle of a skirmish.",
  "${actor.name} (D${actor.district}) drowned ${target.name} (D${target.district}) in a shallow stream during a fight.",
  "${actor.name} (D${actor.district}) hacked ${target.name} (D${target.district}) apart in a rage-fueled frenzy.",
  "${actor.name} (D${actor.district}) booby-trapped a trail and watched ${target.name} (D${target.district}) get impaled.",
  "${actor.name} (D${actor.district}) waited in the trees and pounced on ${target.name} (D${target.district}), killing them with a ${actor.weapon}.",
  "${actor.name} (D${actor.district}) beat ${target.name} (D${target.district}) to death after catching them stealing supplies."
];
  combatSurvive: [
  "${actor.name} (D${actor.district}) barely escaped an ambush by ${target.name} (D${target.district}), suffering a minor injury.",
  "${actor.name} (D${actor.district}) disarmed ${target.name} (D${target.district}) and fled before reinforcements arrived.",
  "${actor.name} (D${actor.district}) used a smokescreen to evade ${target.name} (D${target.district})’s deadly attack.",
  "${actor.name} (D${actor.district}) fought off ${target.name} (D${target.district}) with a broken ${actor.weapon}, then escaped.",
  "${actor.name} (D${actor.district}) was wounded by ${target.name} (D${target.district}), but managed to hide before the final blow.",
  "${actor.name} (D${actor.district}) lured ${target.name} (D${target.district}) into a trap and used the distraction to flee.",
  "${actor.name} (D${actor.district}) endured several blows before throwing ${target.name} (D${target.district}) off and running for cover.",
  "${actor.name} (D${actor.district}) outsmarted ${target.name} (D${target.district}) by feigning death and crawling away.",
  "${actor.name} (D${actor.district}) took shelter in a hollow tree to avoid a fatal strike by ${target.name} (D${target.district}).",
  "${actor.name} (D${actor.district}) was saved at the last second by an unexpected muttation attack on ${target.name} (D${target.district})."
];
  survival: [
  "${actor.name} (D${actor.district}) spent the day foraging for edible plants.",
  "${actor.name} (D${actor.district}) built a makeshift shelter and rested.",
  "${actor.name} (D${actor.district}) caught a fish and ate it raw.",
  "${actor.name} (D${actor.district}) avoided confrontation and stayed hidden.",
  "${actor.name} (D${actor.district}) took time to heal minor wounds.",
  "${actor.name} (D${actor.district}) found a fresh water source and drank.",
  "${actor.name} (D${actor.district}) set up snares but caught nothing.",
  "${actor.name} (D${actor.district}) climbed a tree to scout the area safely.",
  "${actor.name} (D${actor.district}) gathered firewood and started a small campfire.",
  "${actor.name} (D${actor.district}) rested in a safe clearing during the heat of the day.",
  "${actor.name} (D${actor.district}) avoided the main paths to stay undetected.",
  "${actor.name} (D${actor.district}) sharpened their ${actor.weapon} for future use.",
  "${actor.name} (D${actor.district}) tracked animal footprints but didn’t follow them.",
  "${actor.name} (D${actor.district}) found berries but was unsure if they were safe to eat.",
  "${actor.name} (D${actor.district}) took shelter from the rain under thick foliage.",
  "${actor.name} (D${actor.district}) rested after a minor injury slowed them down.",
  "${actor.name} (D${actor.district}) listened for signs of other tributes nearby.",
  "${actor.name} (D${actor.district}) silently observed the surrounding forest for threats.",
  "${actor.name} (D${actor.district}) moved cautiously through the underbrush.",
  "${actor.name} (D${actor.district}) avoided making any noise to keep their location secret."
];
  alliance: [
  "${actor.name} (D${actor.district}) formed an alliance with ${target.name} (D${target.district}) for mutual protection.",
  "${actor.name} (D${actor.district}) promised to watch ${target.name} (D${target.district})’s back during the night.",
  "${actor.name} (D${actor.district}) shared food and supplies with ${target.name} (D${target.district}).",
  "${actor.name} (D${actor.district}) agreed to hunt with ${target.name} (D${target.district}) to increase their chances of survival.",
  "${actor.name} (D${actor.district}) betrayed ${target.name} (D${target.district}) by stealing their supplies.",
  "${actor.name} (D${actor.district}) stabbed ${target.name} (D${target.district}) in the back after forming a shaky alliance.",
  "${actor.name} (D${actor.district}) sabotaged ${target.name} (D${target.district})’s trap while pretending to help.",
  "${actor.name} (D${actor.district}) convinced ${target.name} (D${target.district}) to trust them, then abandoned them.",
  "${actor.name} (D${actor.district}) and ${target.name} (D${target.district}) plotted to take out a common threat together.",
  "${actor.name} (D${actor.district}) secretly planned to betray ${target.name} (D${target.district}) at the first opportunity.",
  "${actor.name} (D${actor.district}) saved ${target.name} (D${target.district}) from an attack to build trust.",
  "${actor.name} (D${actor.district}) gave ${target.name} (D${target.district}) valuable information about nearby dangers.",
  "${actor.name} (D${actor.district}) shared a campfire and stories with ${target.name} (D${target.district}) to pass time.",
  "${actor.name} (D${actor.district}) lied to ${target.name} (D${target.district}) about the location of food supplies.",
  "${actor.name} (D${actor.district}) feigned weakness to gain ${target.name} (D${target.district})’s trust.",
  "${actor.name} (D${actor.district}) tricked ${target.name} (D${target.district}) into falling into a trap.",
  "${actor.name} (D${actor.district}) agreed to share weapons with ${target.name} (D${target.district}).",
  "${actor.name} (D${actor.district}) left ${target.name} (D${target.district}) behind during a dangerous escape.",
  "${actor.name} (D${actor.district}) sent a warning to ${target.name} (D${target.district}) about incoming tributes.",
  "${actor.name} (D${actor.district}) promised to avenge ${target.name} (D${target.district}) if they were killed."
];
  feastCombat: [
  "${actor.name} (D${actor.district}) rushed to the feast and grabbed a weapon before anyone else.",
  "${actor.name} (D${actor.district}) made a surprise attack at the feast and killed ${target.name} (D${target.district}).",
  "${actor.name} (D${actor.district}) fought fiercely for a place at the feast, injuring several tributes.",
  "${actor.name} (D${actor.district}) grabbed a heavy shield and held the front line at the feast.",
  "${actor.name} (D${actor.district}) picked off an injured tribute at the feast and took their supplies.",
  "${actor.name} (D${actor.district}) was overwhelmed by other tributes and barely escaped the feast.",
  "${actor.name} (D${actor.district}) teamed up with ${target.name} (D${target.district}) to fend off attackers at the feast.",
  "${actor.name} (D${actor.district}) snuck around the edges of the feast, stealing food and weapons.",
  "${actor.name} (D${actor.district}) got cornered at the feast but managed to break free with minor wounds.",
  "${actor.name} (D${actor.district}) threw a makeshift weapon and wounded ${target.name} (D${target.district}) during the feast."
];
  feastSurvive: [
  "${actor.name} (D${actor.district}) cautiously approached the feast, eyes peeled for danger.",
  "${actor.name} (D${actor.district}) stayed hidden near the feast, avoiding conflict.",
  "${actor.name} (D${actor.district}) grabbed some food and slipped away unnoticed from the feast.",
  "${actor.name} (D${actor.district}) observed the chaos at the feast from a safe distance.",
  "${actor.name} (D${actor.district}) found a secure hiding spot near the feast to rest.",
  "${actor.name} (D${actor.district}) avoided the main crowd at the feast and survived unscathed.",
  "${actor.name} (D${actor.district}) used distractions to sneak food and supplies from the feast.",
  "${actor.name} (D${actor.district}) waited for the fighting to die down before moving in at the feast.",
  "${actor.name} (D${actor.district}) helped a wounded tribute escape the feast safely.",
  "${actor.name} (D${actor.district}) took advantage of the feast chaos to scout the area for threats."
];
  naturalDeath: [
  "${actor.name} (D${actor.district}) succumbed to starvation after days without food.",
  "${actor.name} (D${actor.district}) fell from a cliff while trying to escape danger.",
  "${actor.name} (D${actor.district}) was caught in a sudden wildfire and did not survive.",
  "${actor.name} (D${actor.district}) drank contaminated water and died from poisoning.",
  "${actor.name} (D${actor.district}) was bitten by a venomous snake and passed away.",
  "${actor.name} (D${actor.district}) suffered hypothermia during a cold night in the wilderness.",
  "${actor.name} (D${actor.district}) collapsed from exhaustion after days without rest.",
  "${actor.name} (D${actor.district}) was caught in a mudslide and buried alive.",
  "${actor.name} (D${actor.district}) failed to find shelter during a violent storm and froze to death.",
  "${actor.name} (D${actor.district}) was trapped in quicksand and drowned."
];
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
  const randomWeapon = randomChoice(weapons);
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

  if (!name || isNaN(district) || district < 1 || district > 12 || isNaN(age)) {
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
  logEvent("Game Over", `🏆 **${winner.name} (D${winner.district})** wins the Hunger Games!`);
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
      logEvent("", `💀 **${t.name} (D${t.district})** has fallen. *BOOM*`);
      t.loggedDead = true;
    });
  }
  dayCount++;
}

function simulateEncounters(isNight = false, isBloodbath = false) {
  const alive = tributes.filter(t => t.alive);
  const shuffled = [...alive].sort(() => Math.random() - 0.5);

  for (let actor of shuffled) {
    if (!actor.alive) continue;

    if (Math.random() < 0.4 && alive.length > 1) {
      let target;
      do {
        target = randomChoice(alive);
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
