const urlScript = "https://script.google.com/macros/s/AKfycby-2sDzefTaw-y23X-WEeLcZ0bN6Q56nYHyOwaTkfRDzKmLn0XP482i1Wewuid_XPBo/exec";


// ================= CARGAR TABLA =================
function cargarTabla() {

    const script = document.createElement("script");
    script.src = urlScript + "?callback=renderTabla";
    document.body.appendChild(script);
}


// ================= RENDER TABLA =================
function renderTabla(data) {

    const encabezados = data[0];
    const datos = data.slice(1);

    let totalActivo = 0;
    let html = "<table><thead><tr>";

    encabezados.forEach(h => html += `<th>${h}</th>`);
    html += "</tr></thead><tbody>";

    datos.forEach(fila => {

        const estado = fila[7];
        const total = parseFloat(fila[6]) || 0;

        if (estado === "Activo") {
            totalActivo += total;
        }

        let clase = "";
        if (estado === "Vencido") clase = "vencido";
        if (estado === "Por vencer") clase = "por-vencer";

        html += `<tr class="${clase}">`;
        fila.forEach(celda => html += `<td>${celda}</td>`);
        html += "</tr>";
    });

    html += "</tbody></table>";

    document.getElementById("tabla").innerHTML = html;
    document.getElementById("total-activo").textContent =
        totalActivo.toLocaleString("es-AR");
}


// ================= AGREGAR CLIENTE =================
function agregarCliente() {

    const nombre = document.getElementById("nombre").value.trim();
    const cantidad = parseInt(document.getElementById("cantidad").value);
    const duracion = parseInt(document.getElementById("duracion").value);

    if (!nombre || !cantidad || !duracion) {
        alert("Completá todos los campos");
        return;
    }

    const formData = new URLSearchParams();
    formData.append("nombre", nombre);
    formData.append("cantidad", cantidad);
    formData.append("duracion", duracion);

    fetch(urlScript, {
        method: "POST",
        body: formData
    })
    .then(() => {
        document.getElementById("nombre").value = "";
        document.getElementById("cantidad").value = "";
        document.getElementById("duracion").value = "";

        setTimeout(() => {
            cargarTabla();
        }, 800);
    });
}


cargarTabla();
