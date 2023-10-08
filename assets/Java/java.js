document.addEventListener("DOMContentLoaded", () => {
    const monedaInput = document.querySelector("#moneda-input");
    const monedaSelect = document.querySelector("#moneda-select");
    const btn = document.querySelector("#buscar-btn");
    const resultSpan = document.getElementById("result");
    const chartDom = document.getElementById("myChart");
  
    const urlAPI = "https://mindicador.cl/api/";
    let myChart;
  
    btn.addEventListener("click", () => {
      const valorMonedaInput = monedaInput.value;
      const tipoMonedaSelect = monedaSelect.value;
  
      // Verificar si se ha ingresado un número válido
      if (!valorMonedaInput || isNaN(valorMonedaInput) || valorMonedaInput <= 0) {
        alert("Por favor, ingrese un número válido mayor a 0 en el cuadro de CLP.");
        return; // Detener la ejecución si no se ha ingresado un número válido
      }
  
      // Verificar si se ha seleccionado una moneda
      if (tipoMonedaSelect === "Seleccione moneda") {
        alert("Por favor, seleccione una moneda antes de realizar la conversión.");
        return; // Detener la ejecución si no se ha seleccionado una moneda
      }
  
      searchData(tipoMonedaSelect, valorMonedaInput);
    });
  
    async function searchData(tipoMoneda, valorMoneda) {
      try {
        const res = await fetch(urlAPI + tipoMoneda);
        const data = await res.json();
        const { serie } = data;
  
        const datos = crearData(serie.slice(0, 10).reverse());
  
        if (myChart) {
          myChart.destroy();
        }
  
        renderGrafica(datos);
  
        const valorMonedaSeleccionada = data.serie[0].valor;
        resultSpan.innerHTML = (valorMoneda / valorMonedaSeleccionada).toFixed(2);
      } catch (error) {
        console.log("Falló en cargar", error);
      }
    }
  
    function renderGrafica(data) {
        const config = {
          type: "line",
          data: data,
          options: {
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Tiempo",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "CLP",
                },
              },
            },
          },
        };
  
      myChart = new Chart(chartDom, config);
    }
  
    function crearData(serie) {
      const labels = serie.map(({ fecha }) => formateoFecha(fecha));
      const valorSerieMap = serie.map(({ valor }) => valor);
  
      const datasets = [
        {
          label: "Histórico",
          borderColor: "rgb(75, 192, 192)",
          data: valorSerieMap,
        },
      ];
  
      return { labels, datasets };
    }
  
    function formateoFecha(fecha) {
      date = new Date(fecha);
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      return `${day} - ${month} - ${year}`;
    }
  });
  
  