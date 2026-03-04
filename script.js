function calculateDose() {

    let weight = parseFloat(document.getElementById("weight").value);
    let dose = parseFloat(document.getElementById("dose").value);
    let mg = parseFloat(document.getElementById("mg").value);
    let ml = parseFloat(document.getElementById("ml").value);

    if (!weight || !dose || !mg || !ml) {
        document.getElementById("result").innerHTML = "Lengkapi semua data!";
        return;
    }

    // Hitung kebutuhan mcg/menit
    let mcg_per_min = weight * dose;

    // Konversi mg ke mcg
    let total_mcg = mg * 1000;

    // Konsentrasi mcg per ml
    let concentration = total_mcg / ml;

    // Hitung ml per menit
    let ml_per_min = mcg_per_min / concentration;

    // Konversi ke ml per jam
    let ml_per_hour = ml_per_min * 60;

    let alert = "";
    if (dose > 1) {
        alert = "<br><span style='color:red'>⚠ Melebihi dosis umum aman!</span>";
    }

    document.getElementById("result").innerHTML =
        "Kecepatan Infus: " + ml_per_hour.toFixed(2) + " ml/jam" + alert;
}