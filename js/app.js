'use strict';

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY';

function loadData() {
    const dataString = localStorage.getItem(HABBIT_KEY);
    const dataArray = JSON.parse(dataString);
    if (Array.isArray(dataArray)) habbits = dataArray;
}

function saveData() {
    localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

(() => {
    loadData();
})();
