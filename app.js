
const tg = window.Telegram.WebApp;
tg.expand();

let currentIndex = 0;
let signals = [];

// DOM элементы
const grid = document.getElementById("grid");
const mineCountEl = document.getElementById("mine-count");
const stepIndicator = document.getElementById("step-indicator");
const nextBtn = document.getElementById("next-btn");
const endScreen = document.getElementById("end-screen");

function getCellName(row, col) {
  return String.fromCharCode(65 + row) + (col + 1);
}

function renderGrid(safeCells = []) {
  grid.innerHTML = "";
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const cellName = getCellName(row, col);
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = cellName;

      if (safeCells.includes(cellName)) {
        cell.classList.add("safe");
      }

      grid.appendChild(cell);
    }
  }
}

function showSignal(index) {
  const signal = signals[index];
  if (!signal) return;

  renderGrid(signal.safe_cells);
  mineCountEl.textContent = `Мин: ${signal.mines}`;
  stepIndicator.textContent = `Сигнал ${index + 1} из 3`;

  if (index === signals.length - 1) {
    nextBtn.textContent = "ЗАВЕРШИТЬ";
  } else {
    nextBtn.textContent = "ДАЛЕЕ";
  }
}

function showEndScreen() {
  grid.classList.add("hidden");
  nextBtn.classList.add("hidden");
  document.querySelector(".header").classList.add("hidden");
  endScreen.classList.remove("hidden");
}

function restart() {
  currentIndex = 0;
  grid.classList.remove("hidden");
  nextBtn.classList.remove("hidden");
  document.querySelector(".header").classList.remove("hidden");
  endScreen.classList.add("hidden");
  showSignal(currentIndex);
}

nextBtn.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex < signals.length) {
    showSignal(currentIndex);
  } else {
    showEndScreen();
  }
});

tg.onEvent("web_app_data", (event) => {
  try {
    const data = JSON.parse(event.data);
    if (Array.isArray(data)) {
      signals = data;
      currentIndex = 0;
      showSignal(currentIndex);
    }
  } catch (err) {
    console.error("Ошибка при получении сигнала:", err);
  }
});

if (!tg.initDataUnsafe?.user) {
  signals = [
    { mines: 4, safe_cells: ["A1", "C3", "D5"] },
    { mines: 3, safe_cells: ["B2", "C2", "E5"] },
    { mines: 5, safe_cells: ["A4", "D1", "E3"] },
  ];
  showSignal(0);
}
