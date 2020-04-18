const select = new mdc.select.MDCSelect(document.querySelector('.mdc-select'));
const snackbar = new mdc.snackbar.MDCSnackbar(document.querySelector('.mdc-snackbar'));
const radio = new mdc.radio.MDCRadio(document.querySelector('.mdc-radio'));
const formField = new mdc.formField.MDCFormField(document.querySelector('.mdc-form-field'));


const apiEndpoint = "https://pomber.github.io/covid19/timeseries.json";

let countries = [];
let values = [];
let dates = [];
let selected_countries_table = ["Afghanistan"];
let selected_countries_chart = ["table"];
let covid_data;

let headingThere = false;

let searchScreen = document.querySelector(".search_screen");
let chartScreen = document.querySelector(".chart_screen");
let tableScreen = document.querySelector(".table_screen");
let options = document.getElementsByName("radios");

formField.input = radio;

let tabIndex = 0;
let table_done = false;
let chart_done = false;

let table_first = true;


fetch(apiEndpoint)
.then(response => {return response.json()})
.then(data =>{

    covid_data = data;
    // console.log(covid_data);
    let list = document.getElementById("countries");

    for (let country in data) countries.push(country);

    for (let country in countries) {
        values.push(data[countries[country]]);
        
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

// $(document).ready(function () {
    
// })

function addCountry() {
    
    if (select.value == "") {
        snackbar.labelText = "Select a Country first to add!";
        snackbar.open();
        return;
    }
    if (selected_countries_table.includes(select.value))  {
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

    selected_countries_table.push(select.value);
    selected_countries_chart.push(select.value);


    let divider = document.createElement("li");
    divider.classList.add("mdc-list-divider");
    divider.style.borderBottomColor = "grey"
    divider.setAttribute("role", "separator");
    
    list.append(divider);

    document.getElementById("countries_list").style.display = 'block';
    document.getElementById("selected_heading").style.display = 'block';
    document.getElementById("selected_line").style.display = 'block';

    table_done = false;
    chart_done = false;

};

var deleteCountries = () => {
    let list = document.getElementById("countries_list");

    while (list.hasChildNodes())    {
        list.removeChild(list.firstChild);
    }

    selected_countries_table = [];
    selected_countries_chart = [];

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
    if (selected_countries_chart.length == 0 && !chart_done) {
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

    let current;

    for (let i = 0; i < options.length; ++i) {
        if (options[i].checked)
            current = options[i].value;
    }
    var head = document.querySelector(".chart_screen h2");
    head.innerHTML += ":  " + current + " cases";

    create_graph();

}

function table_data() {
    if (table_first)    new_table();

    if (selected_countries_table.length == 0 && !table_done) {
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

    let current;

    for (let i = 0; i < options.length; ++i) {
        if (options[i].checked)
            current = options[i].value;
    }
    var head = document.querySelector(".table_screen h2");
    head.innerHTML += ":  " + current + " cases";

    // console.log(covid_data);

    create_table();
}

function create_table() {
    if (table_done) return;

    let heads = document.querySelector(".mdc-data-table__header-row");

    for (let i = 0; i<selected_countries_table.length; ++i) {
        let header = document.createElement("td");
        header.classList.add("mdc-data-table__header-cell");
        header.classList.add("mdc-data-table__header-cell--numeric")
        header.setAttribute("role", "columnheader");
        header.setAttribute("scope", "col");
        header.innerHTML = [selected_countries_table[i]];
        heads.appendChild(header);
    }

    table_done = true;

    selected_countries_table = [];
}

function create_graph() {
    if (chart_done) return;
}

function new_table() {
    let rows = document.querySelector(".mdc-data-table__content");

    for (let i=0; i<dates.length; ++i)  {
        let row = document.createElement("tr");
        row.classList.add("mdc-data-table__row");

        let rowdata = document.createElement("td");
        rowdata.classList.add("mdc-data-table__cell");
        rowdata.innerHTML = dates[i];

        row.appendChild(rowdata);
        rows.appendChild(row);
    }
}