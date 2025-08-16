// Get elements
const habitList = document.getElementById("habitList");
const habitInput = document.getElementById("habitInput");
const addHabitButton = document.getElementById("addHabitButton");
const clearHabitsButton = document.getElementById("clearHabitsButton");

// Load saved habits from localStorage
let habits = JSON.parse(localStorage.getItem("habits")) || [];
renderHabits();

// Add new habit
addHabitButton.addEventListener("click", () => {
    const habitText = habitInput.value.trim();
    if (habitText === "") return;

    habits.push({ text: habitText, done: false });
    habitInput.value = "";
    saveAndRender();
});

// Toggle habit done/undone
habitList.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
        const index = e.target.dataset.index;
        habits[index].done = !habits[index].done;
        saveAndRender();
    }
});

// Clear all habits
clearHabitsButton.addEventListener("click", () => {
    if (confirm("Clear all habits?")) {
        habits = [];
        saveAndRender();
    }
});

// Save to localStorage and update the list
function saveAndRender() {
    localStorage.setItem("habits", JSON.stringify(habits));
    renderHabits();
}

// Display habits
function renderHabits() {
    habitList.innerHTML = "";
    habits.forEach((habit, index) => {
        const li = document.createElement("li");
        li.textContent = habit.text;
        li.dataset.index = index;
        if (habit.done) li.style.textDecoration = "line-through";
        habitList.appendChild(li);
    });
}
