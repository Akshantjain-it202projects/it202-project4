const select = new mdc.select.MDCSelect(document.querySelector('.mdc-select'));
const snackbar = new mdc.snackbar.MDCSnackbar(document.querySelector('.mdc-snackbar'));

const apiEndpoint = "https://pomber.github.io/covid19/timeseries.json";

let countries = [];
let values = [];
let selected_countries = ["Afghanistan"];
let covid_data;

let headingThere = false;

let searchScreen = document.querySelector(".search_screen");
let chartScreen = document.querySelector(".chart_screen");
let tableScreen = document.querySelector(".table_screen");

let tabIndex = 0;

fetch(apiEndpoint)
.then(response => {return response.json()})
.then(data =>{

    covid_data = data;
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
}

function table_data() {
    if (selected_countries.length == 0) {
        snackbar.labelText = "No Countries Selected!";
        snackbar.open();
        return;
    }

    searchScreen.style.display = "none";
    chartScreen.style.display = "none";
    tableScreen.style.display = "block";
}

function create_table() {
    
}

function create_graph() {
    
}