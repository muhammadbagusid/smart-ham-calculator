let currentUser = "";

const doseLimits = {
    norepi: { adult: [0.05, 1], pediatric: [0.05, 2] },
    dopamine: { adult: [2, 20], pediatric: [2, 20] },
    insulin: { adult: [0.05, 0.1], pediatric: [0.05, 0.1] }
};

function login() {
    let name = document.getElementById("nurseName").value;
    if (!name) return alert("Masukkan nama perawat!");
    currentUser = name;
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("appPage").style.display = "block";
    document.getElementById("userDisplay").innerText = "Login sebagai: " + name;
}

function updateDoseRange() {
    let drug = document.getElementById("drug").value;
    let mode = document.getElementById("mode").value;
    let range = doseLimits[drug][mode];
    document.getElementById("doseRange").innerText =
        "Rentang dosis aman: " + range[0] + " - " + range[1];
}

function calculate() {
    let drug = document.getElementById("drug").value;
    let mode = document.getElementById("mode").value;
    let weight = parseFloat(document.getElementById("weight").value);
    let dose = parseFloat(document.getElementById("dose").value);
    let mg = parseFloat(document.getElementById("mg").value);
    let ml = parseFloat(document.getElementById("ml").value);

    if (!weight || !dose || !mg || !ml) {
        alert("Lengkapi semua data!");
        return;
    }

    let mcg_per_min = weight * dose;
    let total_mcg = mg * 1000;
    let concentration = total_mcg / ml;
    let ml_per_hour = (mcg_per_min / concentration) * 60;

    let range = doseLimits[drug][mode];
    let alertText = "";

    if (dose < range[0] || dose > range[1]) {
        alertText = "⚠ Dosis di luar rentang aman!";
    } else {
        alertText = "✓ Dosis dalam rentang aman.";
    }

    document.getElementById("result").innerHTML =
        "Kecepatan: " + ml_per_hour.toFixed(2) + " ml/jam <br>" + alertText;

    let logItem = document.createElement("li");
    logItem.textContent = currentUser + 
        " | " + drug + 
        " | " + ml_per_hour.toFixed(2) + " ml/jam";
    document.getElementById("logList").appendChild(logItem);
}

updateDoseRange();
