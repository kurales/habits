'use strict';

let habits = [];
const HABIT_KEY = 'HABIT_KEY';
let globalHabitId;

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

function rerenderContent(activeHabit) {
    page.content.daysWrapper.innerHTML = '';
    for (const i in activeHabit.days) {
        const div = document.createElement('div');
        div.classList.add('habit__item');
        div.innerHTML = `<div class="habit__day">Day ${Number(i) + 1}</div>
            <div class="habit__comment">${activeHabit.days[i].comment}</div>
            <button onclick="deleteDay(${i})" class="habit__delete"><img src="/img/trash.svg" alt="Delete day ${
            i + 1
        }"></button>`;
        page.content.daysWrapper.append(div);
        page.content.nextDay.innerHTML = `Day ${activeHabit.days.length + 1}`;
    }
}

function rerender(activeHabitId) {
    globalHabitId = activeHabitId;
    const activeHabit = habits.find((habit) => habit.id === activeHabitId);
    if (!activeHabit) return;
    rerenderMenu(activeHabit);
    rerenderHead(activeHabit);
    rerenderContent(activeHabit);
}

/* ADD DAYS */

function addDays(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const comment = data.get('comment');
    event.target['comment'].classList.remove('error');
    if (!comment) {
        event.target['comment'].classList.add('error');
    }
    habits = habits.map((habit) => {
        if (habit.id === globalHabitId) {
            return {
                ...habit,
                days: habit.days.concat([{ comment }]),
            };
        }
        return habit;
    });
    event.target['comment'].value = '';
    rerender(globalHabitId);
    saveData();
}

/* DELETE DAY */

function deleteDay(index) {
    habits = habits.map((habit) => {
        if (habit.id === globalHabitId) {
            habit.days.splice(index, 1);
            return {
                ...habit,
                days: habit.days,
            };
        }
        return habit;
    });
    rerender(globalHabitId);
    saveData();
}

/* INIT */

(() => {
    loadData();
    rerender(habits[0].id);
})();
