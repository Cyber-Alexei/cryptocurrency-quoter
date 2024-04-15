const criptomonedasSelect = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

const objBusqueda = {
  moneda: "",
  criptomoneda: "",
};

// Crear un promise con function expression
const obtenerCriptomonedas = (criptomonedas) =>
  new Promise((resolve) => {
    resolve(criptomonedas);
  });

document.addEventListener("DOMContentLoaded", () => {
  consultarCriptomonedas();
  formulario.addEventListener("submit", submitFormulario);

  criptomonedasSelect.addEventListener("change", leerValor);
  monedaSelect.addEventListener("change", leerValor);
});

function consultarCriptomonedas() {
  const URL =
    "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

  fetch(URL)
    .then((resultado) => resultado.json())
    .then((resultado) => obtenerCriptomonedas(resultado.Data))
    .then((criptomonedas) => selectCriptomonedas(criptomonedas));
}

function selectCriptomonedas(criptomonedas) {
  criptomonedas.forEach((cripto) => {
    const { FullName, Name } = cripto.CoinInfo;

    const option = document.createElement("OPTION");
    option.value = Name;
    option.textContent = FullName;
    criptomonedasSelect.appendChild(option);
  });
}

function leerValor(e) {
  objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
  e.preventDefault();
  // validar formulario usando el objeto que debe rellenar
  const { moneda, criptomoneda } = objBusqueda;

  if (moneda === "" || criptomoneda === "") {
    mostrarAlerta("Ambos campos son obligatorios");
    return;
  }

  // Consultar la API con los resultados
  consultarAPI();
}

function mostrarAlerta(mensaje) {
  const special = document.querySelector(".special123");
  if (!special) {
    const divMensaje = document.createElement("DIV");
    divMensaje.classList.add("error", "special123");
    divMensaje.textContent = mensaje;

    formulario.appendChild(divMensaje);
    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }
}

function consultarAPI() {
  const { moneda, criptomoneda } = objBusqueda;
  const URL = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
  mostrarSpinner();

  fetch(URL)
    .then((resultado) => resultado.json())
    .then((resultado) =>
      mostrarCotizacionHTML(resultado.DISPLAY[criptomoneda][moneda])
    );
}

function mostrarCotizacionHTML(cotizacion) {
  // Limpiar HTML
  limpiarHTML(resultado);

  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

  // Scripting

  const precio = document.createElement("P");
  precio.classList.add("precio");
  precio.innerHTML = `El precio es de: <span>${PRICE}</span>`;

  const precioAlto = document.createElement("P");
  precioAlto.innerHTML = `<p>Precio mas alto del dia: <span>${HIGHDAY}</span></p>`;

  const precioBajo = document.createElement("P");
  precioBajo.innerHTML = `<p>Precio mas alto del dia: <span>${LOWDAY}</span></p>`;

  const ultimasHoras = document.createElement("P");
  ultimasHoras.innerHTML = `<p>Variacion ultimas 24 horas: <span>${CHANGEPCT24HOUR}%</span></p>`;

  const ultimaActualizacion = document.createElement("P");
  ultimaActualizacion.innerHTML = `<p>Ultima actualizacion: <span>${LASTUPDATE}</span></p>`;

  resultado.appendChild(precio);
  resultado.appendChild(precioAlto);
  resultado.appendChild(precioBajo);
  resultado.appendChild(ultimasHoras);
  resultado.appendChild(ultimaActualizacion);
}

// ----------------------------------

function limpiarHTML(elemento) {
  while (elemento.firstChild) {
    elemento.removeChild(elemento.firstChild);
  }
}

function mostrarSpinner() {
  limpiarHTML(resultado);

  const spinner = document.createElement("DIV");
  spinner.classList.add("spinner");
  spinner.innerHTML = `<div class="spinner"></div>`;

  resultado.appendChild(spinner);
}
