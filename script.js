// =============================
// CONFIGURACIÓN
// =============================

const urlScript = "https://script.google.com/macros/s/AKfycby-2sDzefTaw-y23X-WEeLcZ0bN6Q56nYHyOwaTkfRDzKmLn0XP482i1Wewuid_XPBo/exec";


// =============================
// CARGAR TABLA
// =============================
function cargarTabla() {

    fetch(urlScript)
        .then(res => res.text())
        .then(data => {

            const filas = data.trim().split("\n").map(f => f.split(","));
            const encabezados = filas[0];
            const datos = filas.slice(1);

            let totalActivo = 0;
            let html = "<table><thead><tr>";

            encabezados.forEach(h => html += `<th>${h}</th>`);
            html += "</tr></thead><tbody>";

            datos.forEach(fila => {

                if (fila.length < 8) return;

                const estado = fila[7]?.trim();
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
        })
        .catch(error => {
            console.error("Error cargando datos:", error);
        });
}


// =============================
// AGREGAR CLIENTE
// =============================
function agregarCliente() {

    const nombre = document.getElementById("nombre").value.trim();
    const cantidad = parseInt(document.getElementById("cantidad").value);
    const duracion = parseInt(document.getElementById("duracion").value);

    if (!nombre || !cantidad || !duracion) {
        alert("Completá todos los campos");
        return;
    }

    fetch(urlScript, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre,
            cantidad,
            duracion
        })
    })
    .then(res => res.json())
    .then(response => {

        if (response.status === "ok") {

            document.getElementById("nombre").value = "";
            document.getElementById("cantidad").value = "";
            document.getElementById("duracion").value = "";

            setTimeout(() => {
                cargarTabla();
            }, 500);

        } else {
            alert("Error al guardar");
        }
    })
    .catch(error => {
        console.error("Error enviando datos:", error);
    });
}


// =============================
// INICIAR
// =============================
cargarTabla();
