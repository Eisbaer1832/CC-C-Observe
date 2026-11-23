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
    const out = await fetch(`/api/stock`)
    const stock = await out.json()
    const table_body = $("#item_list")
    stock.forEach(item => {
        let split_name = item.item.split(":")
        let namespace = split_name[0]
        let name = split_name[1]
        table_body.append($(`<tr style="text-align: center;"><th style="width:10%" scope="row"><img class="item-img" src="/textures/${namespace}/${name}.png" alt=""></th><th scope="row">${item.item}</th><td>${item.count}</td></tr>`))
    });
    
}

async function init_stock_history() {
    const ctx = document.getElementById('item_history_chart');
    const out = await fetch(`/api/stock/history`)
    let stock = await out.json()
    let items = new Map()

    let times = []
    stock = stock.sort((a,b) => a.count - b.count)
    console.log(stock)
    stock.forEach(item => {
        let stored_item = items.get(item.item)
        
        let add_time = false
        if (stored_item == undefined)  {
            items.set(item.item, {
                    label: item.item,
                    data: [item.count],
                    borderWidth: 1
                })
            add_time = true
        }else {
            let current_data = items.get(item.item).data
            // do not add unchanged counts to improve performance
            if (current_data[current_data.length - 1] != item.count) {
                items.get(item.item).data.push(item.count)
                add_time = true
            }
        }
        if (add_time) {
            if (!times.includes(item.time)) {times.push(item.time)}
        }
    })

    function format(d){
        return `${d.getDate()}.${d.getMonth()};${d.getHours()}:${d.getMinutes()}`
    }
    // format times
    let time_strings = times.map( t => format(new Date(t)) )
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: time_strings,
            datasets: Array.from(items.values())
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            },
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 2,
                        font: { size: 10 }
                    }
                }
            },
        }
    });
}
  
await init_stock_history()
await get_stress()
await get_items()
