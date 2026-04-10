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

let logs = [];
let totalCalc = 0;
let unsafeCount = 0;
let drugUsage = {};

const modeSelect = document.getElementById("mode");
const drugSelect = document.getElementById("drug");
const safeRange = document.getElementById("safeRange");

modeSelect.innerHTML = `
<option value="adult">Dewasa</option>
<option value="pediatric">Pediatrik</option>
`;

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
    let drugKey = drugSelect.value;
    let drug = drugs[mode][drugKey];

    let mcg_per_min = weight * dose;
    let total_mcg = mg * 1000;
    let concentration = total_mcg / ml;
    let ml_per_hour = (mcg_per_min / concentration) * 60;

    let unsafe = dose < drug.min || dose > drug.max;
    if (unsafe) unsafeCount++;

    totalCalc++;
    drugUsage[drug.name] = (drugUsage[drug.name] || 0) + 1;

    document.getElementById("result").innerHTML =
        "Kecepatan Infus: " + ml_per_hour.toFixed(2) +
        " ml/jam" + (unsafe ? " ⚠ Di luar rentang aman!" : "");

    logs.push({
        drug: drug.name,
        dose: dose,
        result: ml_per_hour.toFixed(2),
        unsafe: unsafe
    });

    updateDashboard();
    renderLog();
}

function updateDashboard() {
    document.getElementById("totalCalc").innerText = totalCalc;
    document.getElementById("unsafeCount").innerText = unsafeCount;

    let mostUsed = Object.keys(drugUsage).reduce((a, b) =>
        drugUsage[a] > drugUsage[b] ? a : b, "-");

    document.getElementById("mostUsed").innerText = mostUsed;
}

function renderLog() {
    let logList = document.getElementById("logList");
    logList.innerHTML = "";
    logs.forEach(log => {
        let li = document.createElement("li");
        li.innerHTML = `${log.drug} | ${log.dose} → ${log.result} ml/jam`;
        logList.prepend(li);
    });
}

function exportCSV() {
    let csv = "Drug,Dose,Result(ml/jam),Unsafe\n";
    logs.forEach(log => {
        csv += `${log.drug},${log.dose},${log.result},${log.unsafe}\n`;
    });

    let blob = new Blob([csv], { type: "text/csv" });
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "SMART-HAM-Log.csv";
    a.click();
}
