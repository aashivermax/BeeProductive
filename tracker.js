const habitInput = document.getElementById("habitInput");
const addHabitButton = document.getElementById("addHabitButton");
const habitList = document.getElementById("habitList");
const clearHabitsButton = document.getElementById("clearHabitsButton");
const compleatedTasks = document.querySelector(".compleated");
const goalInput = document.getElementById("goalInput");
const progressBar = document.getElementById("progressBar");
const beeContainer = document.getElementById("bee-container");

let goalReached = false;

// Load saved habits and goal
document.addEventListener("DOMContentLoaded", () => {
    loadHabits();
    loadGoal();
    spawnFloatingBees(10); // background bees
});

addHabitButton.addEventListener("click", addHabit);
clearHabitsButton.addEventListener("click", clearHabits);
goalInput.addEventListener("input", () => {
    saveGoal();
    updateCompletedCount();
});

function addHabit() {
    const habitText = habitInput.value.trim();
    if(!habitText) return;

    const li = document.createElement("li");
    li.classList.add("habit-item");

    const spanText = document.createElement("span");
    spanText.textContent = habitText;

    const deleteBtn = document.createElement("span");
    deleteBtn.innerHTML = "🗑️";
    deleteBtn.classList.add("delete-icon");
    deleteBtn.onclick = (e) => { e.stopPropagation(); li.remove(); updateCompletedCount(); saveHabits(); };

    li.appendChild(spanText);
    li.appendChild(deleteBtn);

    li.addEventListener("click", () => {
        li.classList.toggle("done");
        updateCompletedCount();
        saveHabits();
        if(li.classList.contains("done")) flyBeeToHive();
    });

    habitList.appendChild(li);
    habitInput.value = "";

    saveHabits();
    updateCompletedCount();
}

function clearHabits() { habitList.innerHTML=""; saveHabits(); updateCompletedCount(); }

function saveHabits() {
    const habits = Array.from(habitList.children).map(li=>({ text: li.firstChild.textContent, done: li.classList.contains("done") }));
    localStorage.setItem("habits", JSON.stringify(habits));
}

function loadHabits() {
    const saved = JSON.parse(localStorage.getItem("habits") || "[]");
    saved.forEach(habit => {
        const li = document.createElement("li");
        li.classList.add("habit-item");

        const spanText = document.createElement("span");
        spanText.textContent = habit.text;

        const deleteBtn = document.createElement("span");
        deleteBtn.innerHTML = "🗑️";
        deleteBtn.classList.add("delete-icon");
        deleteBtn.onclick = (e) => { e.stopPropagation(); li.remove(); updateCompletedCount(); saveHabits(); };

        li.appendChild(spanText);
        li.appendChild(deleteBtn);

        if(habit.done) li.classList.add("done");
        li.addEventListener("click", () => { li.classList.toggle("done"); updateCompletedCount(); saveHabits(); if(li.classList.contains("done")) flyBeeToHive(); });

        habitList.appendChild(li);
    });
    updateCompletedCount();
}

function saveGoal() { localStorage.setItem("dailyGoal", goalInput.value); }
function loadGoal() { const saved = localStorage.getItem("dailyGoal"); if(saved) goalInput.value=saved; updateCompletedCount(); }

function updateCompletedCount() {
    const completedCount = Array.from(habitList.children).filter(li=>li.classList.contains("done")).length;
    const goal = parseInt(goalInput.value)||0;

    compleatedTasks.textContent = goal>0 ? `Tasks Completed: ${completedCount} / ${goal}` : `Tasks Completed: ${completedCount}`;
    if(goal>0){ const percent = Math.min((completedCount/goal)*100,100); progressBar.style.width = percent+"%"; } else progressBar.style.width="0%";

    checkGoal(completedCount, goal);
}

function checkGoal(completedCount, goal){
    if(goal>0 && completedCount>=goal && !goalReached){
        goalReached=true;
        alert("🎉 Congratulations! You've reached your daily habit goal!");
        const audio = new Audio("sounds/success.mp3"); audio.play();
        if(typeof confetti==="function"){
            confetti({ particleCount:150, spread:80, origin:{y:0.6}, zIndex:9999 });
        }
    } else if(completedCount<goal) goalReached=false;
}

// Floating bees in background
function spawnFloatingBees(num){
    for(let i=0;i<num;i++){
        const bee=document.createElement("div");
        bee.classList.add("bee");
        bee.style.left=Math.random()*100+"vw";
        bee.style.top=Math.random()*80+"vh";
        bee.style.animationDuration=(5+Math.random()*5)+"s";
        beeContainer.appendChild(bee);
    }
}

// Fly bee to hive
function flyBeeToHive(){
    const bee=document.createElement("div");
    bee.classList.add("bee");
    bee.style.left=Math.random()*window.innerWidth+"px";
    bee.style.top="0px";
    bee.style.transition="all 1s ease-in-out";
    beeContainer.appendChild(bee);

    setTimeout(()=>{
        const hive=document.querySelector(".mainImg");
        const rect=hive.getBoundingClientRect();
        bee.style.left=rect.left+rect.width/2+"px";
        bee.style.top=rect.top+"px";

        setTimeout(()=>{ bee.remove(); },1000);
    },50);
}
