const drugs = {
    adult: {
        norepi: { name: "Norepinephrine", min: 0.05, max: 1 },
        dopamine: { name: "Dopamine", min: 2, max: 20 },
        insulin: { name: "Insulin Infusion", min: 0.05, max: 0.1 }
    },
    pediatric: {
        norepi: { name: "Norepinephrine", min: 0.05, max: 0.5 },
        dopamine: { name: "Dopamine", min: 5, max: 15 },
        insulin: { name: "Insulin Infusion", min: 0.02, max: 0.1 }
    }
};

const drugSelect = document.getElementById("drug");
const modeSelect = document.getElementById("mode");
const safeRange = document.getElementById("safeRange");

function loadDrugs() {
    drugSelect.innerHTML = "";
    let mode = modeSelect.value;
    for (let key in drugs[mode]) {
        let option = document.createElement("option");
        option.value = key;
        option.text = drugs[mode][key].name;
        drugSelect.appendChild(option);
    }
    updateSafeRange();
}

function updateSafeRange() {
    let mode = modeSelect.value;
    let drug = drugSelect.value;
    let data = drugs[mode][drug];
    safeRange.innerHTML = 
        "Rentang aman: " + data.min + " - " + data.max + " mcg/kgBB/menit";
}

modeSelect.addEventListener("change", loadDrugs);
drugSelect.addEventListener("change", updateSafeRange);

loadDrugs();

function calculateDose() {
    let weight = parseFloat(document.getElementById("weight").value);
    let dose = parseFloat(document.getElementById("dose").value);
    let mg = parseFloat(document.getElementById("mg").value);
    let ml = parseFloat(document.getElementById("ml").value);

    if (!weight || !dose || !mg || !ml) {
        document.getElementById("result").innerHTML = "Lengkapi semua data!";
        return;
    }

    let mode = modeSelect.value;
    let drug = drugSelect.value;
    let data = drugs[mode][drug];

    let mcg_per_min = weight * dose;
    let total_mcg = mg * 1000;
    let concentration = total_mcg / ml;
    let ml_per_hour = (mcg_per_min / concentration) * 60;

    let alert = "";
    if (dose < data.min || dose > data.max) {
        alert = "<span style='color:red'> ⚠ Di luar rentang aman!</span>";
    }

    document.getElementById("result").innerHTML =
        "Kecepatan Infus: " + ml_per_hour.toFixed(2) + " ml/jam" + alert;

    addLog(data.name, dose, ml_per_hour);
}

function addLog(drugName, dose, result) {
    let logList = document.getElementById("logList");
    let li = document.createElement("li");
    li.innerHTML = drugName + " | Dosis: " + dose +
        " → " + result.toFixed(2) + " ml/jam";
    logList.prepend(li);
}
