const urlScript = "https://script.google.com/macros/s/AKfycby-2sDzefTaw-y23X-WEeLcZ0bN6Q56nYHyOwaTkfRDzKmLn0XP482i1Wewuid_XPBo/exec";


// ================= CARGAR TABLA =================
function cargarTabla() {

    const oldScript = document.getElementById("jsonpScript");
    if (oldScript) oldScript.remove();

    const script = document.createElement("script");
    script.id = "jsonpScript";
    script.src = urlScript + "?callback=renderTabla";

    document.body.appendChild(script);
}


// ================= RENDER TABLA =================
function renderTabla(data) {

    if (!data || data.length === 0) return;

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


// ================= AGREGAR CLIENTE SIN FETCH =================
function agregarCliente() {

    const nombre = document.getElementById("nombre").value.trim();
    const cantidad = document.getElementById("cantidad").value;
    const duracion = document.getElementById("duracion").value;

    if (!nombre || !cantidad || !duracion) {
        alert("Completá todos los campos");
        return;
    }

    // Crear formulario oculto
    const form = document.createElement("form");
    form.method = "POST";
    form.action = urlScript;
    form.target = "hidden_iframe";

    form.innerHTML = `
        <input name="nombre" value="${nombre}">
        <input name="cantidad" value="${cantidad}">
        <input name="duracion" value="${duracion}">
    `;

    document.body.appendChild(form);

    form.submit();

    document.body.removeChild(form);

    document.getElementById("nombre").value = "";
    document.getElementById("cantidad").value = "";
    document.getElementById("duracion").value = "";

    setTimeout(() => {
        cargarTabla();
    }, 1000);
}


// Crear iframe oculto para evitar redirección
const iframe = document.createElement("iframe");
iframe.name = "hidden_iframe";
iframe.style.display = "none";
document.body.appendChild(iframe);


cargarTabla();

