google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawGraph);

const select = new mdc.select.MDCSelect(document.querySelector('.mdc-select'));
const snackbar = new mdc.snackbar.MDCSnackbar(document.querySelector('.mdc-snackbar'));
const radio = new mdc.radio.MDCRadio(document.querySelector('.mdc-radio'));
const formField = new mdc.formField.MDCFormField(document.querySelector('.mdc-form-field'));

const apiEndpoint = "https://pomber.github.io/covid19/timeseries.json";

let countries = [];
let dates = [];
let selected_countries = ["India", "Afghanistan"];
let covid_data;
let current_cases = "confirmed";

let dates_table;

let searchScreen = document.querySelector(".search_screen");
let chartScreen = document.querySelector(".chart_screen");
let tableScreen = document.querySelector(".table_screen");
let options = document.getElementsByName("radios");

formField.input = radio;
let tabIndex = 0;

for (let i = 0; i < options.length; ++i) {
    options[i].onclick = function () {
        for (let j=0; j<options.length; ++j)    {
            if (options[j].checked){
                current_cases = options[j].value;
            }
        }
    }
}

fetch(apiEndpoint)
.then(response => {return response.json()})
.then(data =>{

    covid_data = data;
    let list = document.getElementById("countries");

    for (let country in data) countries.push(country);

    for (let country in countries) {
        // values.push(data[countries[country]]);
        
        let option = document.createElement("li");
        option.classList.add("mdc-list-item");
        option.setAttribute("data-value", countries[country]);

        let option_value = document.createElement("span");
        option_value.classList.add("mdc-list-item__text");
        option_value.innerHTML = countries[country];

        option.appendChild(option_value);
        list.appendChild(option);
    }

    for (let each in data["India"])  {
        dates.push(data["India"][each].date);
    }
})
.catch(err => alert(err))

function addCountry() {
    
    if (select.value == "") {
        snackbar.labelText = "Select a Country first to add!";
        snackbar.open();
        return;
    }
    if (selected_countries.includes(select.value))  {
        snackbar.labelText = "Country already in the list!";
        snackbar.open();
        return;
    }

    let list = document.getElementById("countries_list");

    let item = document.createElement("li");
    item.classList.add("mdc-list-item");
    item.setAttribute("tabindex", tabIndex);

    let item_label = document.createElement("span");
    item_label.classList.add("mdc-list-item__text");
    item_label.innerHTML = (select.value);

    item.appendChild(item_label);
    list.appendChild(item);

    selected_countries.push(select.value);


    let divider = document.createElement("li");
    divider.classList.add("mdc-list-divider");
    divider.style.borderBottomColor = "grey"
    divider.setAttribute("role", "separator");
    
    list.append(divider);

    document.getElementById("countries_list").style.display = 'block';
    document.getElementById("selected_heading").style.display = 'block';
    document.getElementById("selected_line").style.display = 'block';
};

var deleteCountries = () => {
    let list = document.getElementById("countries_list");

    while (list.hasChildNodes())    {
        list.removeChild(list.firstChild);
    }

    selected_countries = [];

    document.getElementById("countries_list").style.display = 'none';
    document.getElementById("selected_heading").style.display = 'none';
    document.getElementById("selected_line").style.display = 'none';
    select.value = "";
}

function search_press() {
    searchScreen.style.display = "block";
    chartScreen.style.display = "none";
    tableScreen.style.display = "none";

    $(".search_screen").animate({ opacity: '1' }, 800);
    $(".chart_screen").animate({ opacity: '0' }, 800);
    $(".table_screen").animate({ opacity: '0' }, 800);
}

function chart_data() {
    if (selected_countries.length == 0) {
        snackbar.labelText = "No Countries Selected!";
        snackbar.open();
        return;
    }

    searchScreen.style.display = "none";
    chartScreen.style.display = "block";
    tableScreen.style.display = "none";

    $(".search_screen").animate({ opacity: '0' }, 800);
    $(".chart_screen").animate({ opacity: '1' }, 800);
    $(".table_screen").animate({ opacity: '0' }, 800);
    
    var head = document.querySelector(".chart_screen h2");
    head.innerHTML = "CHART SCREEN:  " + current_cases + " cases";
    drawGraph();
}

function table_data() {
    if (selected_countries.length == 0) {
        snackbar.labelText = "No Countries Selected!";
        snackbar.open();
        return;
    }

    if (document.querySelector(".table_screen").style.display == "block") {
        snackbar.labelText = "Already Done!!";
        snackbar.open();
        return;
    }

    searchScreen.style.display = "none";
    chartScreen.style.display = "none";
    tableScreen.style.display = "block";

    $(".search_screen").animate({ opacity: '0' }, 800);
    $(".chart_screen").animate({ opacity: '0' }, 800);
    $(".table_screen").animate({ opacity: '1' }, 800);

    var head = document.querySelector(".table_screen h2");
    head.innerHTML = "TABLE SCREEN:  " + current_cases + " cases";

    create_table();
}

function drawGraph() {
    var chart_data = new google.visualization.DataTable();

    chart_data.addColumn('date', 'Date');

    for (let country in selected_countries) {
        chart_data.addColumn('number', selected_countries[country]);
    }

    var wholeRowData = [];
    for (let dateIndex = 0; dateIndex < dates.length; ++dateIndex) {
        let rowData = [];
        rowData.push(new Date(dates[dateIndex]));

        for (let countryIndex = 0; countryIndex < selected_countries.length; ++countryIndex) {

            if (current_cases == "confirmed") {
                rowData.push(covid_data[selected_countries[countryIndex]][dateIndex].confirmed);
            }
            else if (current_cases == "deaths") {
                rowData.push(covid_data[selected_countries[countryIndex]][dateIndex].deaths);
            }
            else  {
                rowData.push(covid_data[selected_countries[countryIndex]][dateIndex].recovered);
            }
        }

        wholeRowData.push(rowData);
    }
    chart_data.addRows(wholeRowData);

    var options = {
        selectionMode: 'multiple',
        tooltip: { trigger: 'selection' },
        aggregationTarget: 'category',
        stroke: '#888',
        strokeWidth: 1,
        lineWidth: 2.5,
        curveType: 'curve',
        pointSize: 2,
        width: 1200,
        height: 500,
        axes: {
            x: {
                100: { side: 'bottom' }
            }
        },
        hAxis: {
            title: 'DATE',
            titleTextStyle: { color: 'white' },
            format: 'MMM dd, yyyy',
            gridlines: { 
                color: 'none',
                opacity: 0.5,
            },
            textStyle: {
                color: 'whitesmoke',
                fontSize: 16,
                bold: true
            },
            minorGridlines: {
                color: 'none',
            }
        },
        vAxis: {
            title: 'No. of Cases',
            titleTextStyle: {color: 'white'},
            gridlines: { color: '#444' , multiple: 1000,},
            minorGridlines: {color: 'none'},
            minValue: 0,
            maxValue: 'auto',
            textStyle: {
                color: 'whitesmoke',
                fontSize: 16,
                bold: true
            },
            minValue: 5000,
            format: 'short',
            viewWindow: {
                min: 0,
                max: 'auto'
            }
        },
        backgroundColor: {
            'fill': '#111',
            'fillOpacity': 0
        },
        legend: {
            textStyle: {
                color: 'white'
            },
            position: 'bottom'
        }
    };

    var chart = new google.visualization.LineChart(document.getElementById("line_chart"));

    chart.draw(chart_data, options);
}

// function initialise_chart(chart_data) {
    
// }

function create_table() {
    clear_data_table();
    insert_raw_data();
    insert_required_data();
}

function clear_data_table() {
    $(".country").empty();
    $(".dates").empty();
}

function insert_raw_data() {

    let tr = document.querySelector(".country");

    let th_head = document.createElement("th");
    th_head.classList.add("mdc-data-table__header-cell");
    th_head.setAttribute("role", "columnheader");
    th_head.innerHTML = "Countries";
    tr.appendChild(th_head);

    for (let country in selected_countries) {
        let th = document.createElement("th");
        th.classList.add("mdc-data-table__header-cell");
        th.classList.add("mdc-data-table__header-cell--numeric");
        th.setAttribute("role", "columnheader");
        th.innerHTML = selected_countries[country];

        tr.appendChild(th);
    }

    let dates_section = document.querySelector(".dates");

    for (let date in dates) {

        let row = document.createElement("tr");
        row.classList.add("mdc-data-table__row");

        let row_data = document.createElement("td");
        row_data.classList.add("mdc-data-table__cell");
        row_data.innerHTML = dates[date];

        row.appendChild(row_data);
        dates_section.appendChild(row);
    }
}

function insert_required_data() {
    let rows = document.querySelector(".dates").children;

    for (let i = 0; i < rows.length; ++i) {
        let each_row = rows[i];

        for (let j = 0; j < selected_countries.length; ++j) {

            let rowdata = document.createElement("td");
            rowdata.classList.add("mdc-data-table__cell");
            rowdata.classList.add("mdc-data-table__cell--numeric")
            rowdata.setAttribute("value", "data");

            if (current_cases == "confirmed"){
                rowdata.innerHTML = covid_data[selected_countries[j]][i].confirmed;
            }
            if (current_cases == "deaths"){
                rowdata.innerHTML = covid_data[selected_countries[j]][i].deaths;
            }
            if (current_cases == "recovered"){
                rowdata.innerHTML = covid_data[selected_countries[j]][i].recovered;
            }
            each_row.appendChild(rowdata);
        }
    }
}