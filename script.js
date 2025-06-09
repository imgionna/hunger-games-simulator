// Hunger Games Simulator by district with tributes, skills, weapons, and simulation

const districtsCount = 12;
const maxTributesPerGender = 2;
const careerDistricts = [1, 2, 4];

// Weapons pool
const weaponsPool = [
  "Bow and Arrow", "Spear", "Knife", "Axe", "Sword", "Trident", "Mace", "Dagger",
  "Slingshot", "Hatchet", "Club", "Crossbow", "Throwing Knives", "Whip", "Boomerang"
];

// Tribute class constructor
class Tribute {
  constructor({
    name,
    gender,
    age,
    district,
    weapon,
    combat,
    survival,
    stealth,
    speed,
    strength,
    intelligence
  }) {
    this.name = name;
    this.gender = gender;
    this.age = age;
    this.district = district;
    this.weapon = weapon;
    this.combat = combat;
    this.survival = survival;
    this.stealth = stealth;
    this.speed = speed;
    this.strength = strength;
    this.intelligence = intelligence;
    this.alive = true;
    this.alliance = null;
    this.trainingScore = combat + survival + stealth + speed + strength + intelligence;
    if (careerDistricts.includes(this.district)) {
      this.trainingScore += 5; // slight advantage for career districts
    }
  }
}

// Pre-filled tributes from books, 1 male & 1 female per district (simplified names, add more if desired)
const prefilledTributesData = [
  // District 1 - Careers
  { name: "Marvel", gender: "male", age: 17, district: 1, weapon: "Sword", combat: 9, survival: 6, stealth: 7, speed: 8, strength: 8, intelligence: 6 },
  { name: "Glimmer", gender: "female", age: 16, district: 1, weapon: "Bow and Arrow", combat: 7, survival: 7, stealth: 8, speed: 8, strength: 6, intelligence: 7 },

  // District 2 - Careers
  { name: "Cato", gender: "male", age: 18, district: 2, weapon: "Mace", combat: 10, survival: 7, stealth: 5, speed: 8, strength: 10, intelligence: 5 },
  { name: "Clove", gender: "female", age: 17, district: 2, weapon: "Throwing Knives", combat: 9, survival: 6, stealth: 9, speed: 7, strength: 6, intelligence: 6 },

  // District 3
  { name: "Wiress", gender: "female", age: 17, district: 3, weapon: "Slingshot", combat: 6, survival: 7, stealth: 8, speed: 7, strength: 5, intelligence: 9 },
  { name: "Beetee", gender: "male", age: 18, district: 3, weapon: "Crossbow", combat: 7, survival: 7, stealth: 6, speed: 7, strength: 6, intelligence: 10 },

  // District 4 - Careers
  { name: "Finnick", gender: "male", age: 17, district: 4, weapon: "Trident", combat: 9, survival: 8, stealth: 7, speed: 9, strength: 8, intelligence: 7 },
  { name: "Mags", gender: "female", age: 80, district: 4, weapon: "Spear", combat: 7, survival: 10, stealth: 7, speed: 4, strength: 6, intelligence: 8 },

  // District 5
  { name: "Foxface", gender: "female", age: 16, district: 5, weapon: "Dagger", combat: 6, survival: 8, stealth: 9, speed: 7, strength: 5, intelligence: 8 },
  { name: "Thresh", gender: "male", age: 18, district: 5, weapon: "Axe", combat: 8, survival: 8, stealth: 6, speed: 7, strength: 9, intelligence: 6 },

  // District 6
  { name: "Enobaria", gender: "female", age: 18, district: 6, weapon: "Knife", combat: 9, survival: 7, stealth: 6, speed: 8, strength: 7, intelligence: 7 },
  { name: "Brutus", gender: "male", age: 18, district: 6, weapon: "Club", combat: 9, survival: 6, stealth: 5, speed: 7, strength: 10, intelligence: 5 },

  // District 7
  { name: "Johanna", gender: "female", age: 17, district: 7, weapon: "Axe", combat: 8, survival: 7, stealth: 7, speed: 7, strength: 9, intelligence: 6 },
  { name: "Blight", gender: "male", age: 18, district: 7, weapon: "Hatchet", combat: 7, survival: 7, stealth: 6, speed: 7, strength: 8, intelligence: 6 },

  // District 8
  { name: "Cashmere", gender: "female", age: 18, district: 8, weapon: "Whip", combat: 7, survival: 6, stealth: 8, speed: 7, strength: 6, intelligence: 7 },
  { name: "Brine", gender: "male", age: 18, district: 8, weapon: "Spear", combat: 8, survival: 7, stealth: 6, speed: 7, strength: 7, intelligence: 6 },

  // District 9
  { name: "UnnamedF9F", gender: "female", age: 16, district: 9, weapon: "Knife", combat: 6, survival: 7, stealth: 7, speed: 7, strength: 6, intelligence: 6 },
  { name: "UnnamedM9", gender: "male", age: 17, district: 9, weapon: "Knife", combat: 7, survival: 6, stealth: 6, speed: 7, strength: 6, intelligence: 6 },

  // District 10
  { name: "UnnamedF10", gender: "female", age: 16, district: 10, weapon: "Knife", combat: 6, survival: 7, stealth: 7, speed: 7, strength: 6, intelligence: 6 },
  { name: "UnnamedM10", gender: "male", age: 17, district: 10, weapon: "Knife", combat: 7, survival: 6, stealth: 6, speed: 7, strength: 6, intelligence: 6 },

  // District 11
  { name: "Rue", gender: "female", age: 12, district: 11, weapon: "Dagger", combat: 6, survival: 8, stealth: 10, speed: 9, strength: 5, intelligence: 7 },
  { name: "Thresh", gender: "male", age: 18, district: 11, weapon: "Axe", combat: 8, survival: 8, stealth: 6, speed: 7, strength: 9, intelligence: 6 },

  // District 12
  { name: "Katniss", gender: "female", age: 16, district: 12, weapon: "Bow and Arrow", combat: 8, survival: 9, stealth: 8, speed: 7, strength: 6, intelligence: 8 },
  { name: "Peeta", gender: "male", age: 16, district: 12, weapon: "Knife", combat: 7, survival: 7, stealth: 6, speed: 7, strength: 7, intelligence: 9 },
];

let tributes = [];
let alliances = [];
let gameLog = "";
let dayCount = 0;

const districtsContainer = document.getElementById("districts-container");
const logElement = document.getElementById("log");
const trainingScoreSpan = document.getElementById("training-score");

const tributeForm = document.getElementById("tribute-form");
const tributeDistrictSelect = document.getElementById("tribute-district");
const tributeWeaponSelect = document.getElementById("tribute-weapon");

const startSimBtn = document.getElementById("start-simulation-btn");
const resetBtn = document.getElementById("reset-btn");
const downloadBtn = document.getElementById("download-log-btn");
const randomizeBtn = document.getElementById("randomize-btn");

// Fill District Select dropdown
function populateDistrictSelect() {
  tributeDistrictSelect.innerHTML = "";
  for (let i = 1; i <= districtsCount; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `District ${i}`;
    tributeDistrictSelect.appendChild(option);
  }
}

// Fill Weapon Select dropdown
function populateWeaponSelect() {
  tributeWeaponSelect.innerHTML = "";
  for (const weapon of weaponsPool) {
    const option = document.createElement("option");
    option.value = weapon;
    option.textContent = weapon;
    tributeWeaponSelect.appendChild(option);
  }
}

// Display district roster with tributes
function displayDistrictRoster() {
  districtsContainer.innerHTML = "";
  for (let d = 1; d <= districtsCount; d++) {
    const districtDiv = document.createElement("div");
    districtDiv.classList.add("district");
    districtDiv.id = `district-${d}`;
    const districtHeader = document.createElement("h3");
    districtHeader.textContent = `District ${d}`;
    districtDiv.appendChild(districtHeader);

    // Find tributes for this district, grouped by gender
    const males = tributes.filter(t => t.district === d && t.gender === "male");
    const females = tributes.filter(t => t.district === d && t.gender === "female");

    const maleHeader = document.createElement("strong");
    maleHeader.textContent = "Males:";
    districtDiv.appendChild(maleHeader);
    if (males.length === 0) districtDiv.appendChild(document.createTextNode(" None"));
    males.forEach(t => {
      const tDiv = document.createElement("div");
      tDiv.classList.add
