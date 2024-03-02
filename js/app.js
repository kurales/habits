'use strict';

let habits = [];
const HABIT_KEY = 'HABIT_KEY';

/* PAGE */

const page = {
    menu: document.querySelector('.menu__list'),
    head: {
        h1: document.querySelector('h1'),
        progressPrecent: document.querySelector('.progress__percent'),
        progressLine: document.querySelector('.progress__line '),
    },
    content: {
        daysWrapper: document.querySelector('.habit'),
        nextDay: document.querySelector('.habit__add .habit__day'),
    },
};

/* LOAD & SAVE */

function loadData() {
    const dataString = localStorage.getItem(HABIT_KEY);
    const dataArray = JSON.parse(dataString);
    if (Array.isArray(dataArray)) habits = dataArray;
}

function saveData() {
    localStorage.setItem(HABIT_KEY, JSON.stringify(habits));
}

/* RENDER */

function rerenderMenu(activeHabit) {
    for (const habit of habits) {
        const existed = document.querySelector(`[data-habit-id="${habit.id}"]`);
        if (!existed) {
            const element = document.createElement('button');
            element.dataset.habitId = habit.id;
            element.classList.add('menu__item');
            element.innerHTML = `<img src="/img/${habit.icon}.svg" alt="${habit.name}">`;
            if (activeHabit.id === habit.id) {
                element.classList.add('menu__item_active');
            }
            page.menu.append(element);
            element.addEventListener('click', () => rerender(habit.id));
            continue;
        }
        if (activeHabit.id === habit.id) {
            existed.classList.add('menu__item_active');
        } else {
            existed.classList.remove('menu__item_active');
        }
    }
}

function rerenderHead(activeHabit) {
    page.head.h1.innerText = activeHabit.name;
    const progress =
        activeHabit.days.length / activeHabit.target >= 1
            ? 100
            : (activeHabit.days.length / activeHabit.target) * 100;
    page.head.progressPrecent.innerText = progress.toFixed(0) + '%';
    page.head.progressLine.setAttribute('style', `width: ${progress}%`);
}

function rerender(activeHabitId) {
    const activeHabit = habits.find((habit) => habit.id === activeHabitId);
    if (!activeHabit) return;
    rerenderMenu(activeHabit);
    rerenderHead(activeHabit);
}

/* INIT */

(() => {
    loadData();
    rerender(habits[0].id);
})();
