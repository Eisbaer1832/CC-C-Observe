import $ from "jquery";
import "oreui-web";
import Chart from "chart.js/auto"

async function get_stress() {
    const stress = await fetch(`/api/stress`)
    const json = await stress.json()
    $("#current_stress").html(`${json.current}su`);
    $("#current_max_capacity").html(`${json.max}su`);
}

async function get_items() {
    const out = await fetch(`/api/stock/history`)
    const stock = await out.json()

    const table_body = $("#item_list")
    stock.forEach(item => {
        table_body.append($(`<tr><th scope="row">${item.item}</th><td>${item.count}</td></tr>`))
    });
    
}

async function init_stock_history() {
    const ctx = document.getElementById('item_history_chart');
    const out = await fetch(`/api/stock/history`)
    const stock = await out.json()

    const time = []
    const count = []
    stock.forEach(item => {
        if (item.item == "Cherry Log") {
            time.push(item.time)
            count.push(item.count)
        }
    })
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: time,
            datasets: [{
            label: 'Cherry Logs',
            data: count,
            borderWidth: 1
            }]
        },
        options: {
            scales: {
            y: {
                beginAtZero: false
            }
            }
        }
    });
}
  
await init_stock_history()
await get_stress()
await get_items()