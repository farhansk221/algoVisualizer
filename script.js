let sortSpeed = 20;
let isSlow = false;

function toggleSpeed() {
  isSlow = !isSlow;
  sortSpeed = isSlow ? 100 : 20;
  document.querySelector('button[onclick="toggleSpeed()"]').textContent =
    `Speed: ${isSlow ? "Speed It" : "Speed Down"}`;
}


let array = [];
let isSorting = false;
let stopRequested = false;

function stopSort() {
  stopRequested = true;
}

function resetFlags() {
  isSorting = true;
  stopRequested = false;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateArray() {
  array = [];
  const container = document.getElementById("array-container");
  container.innerHTML = "";
  for (let i = 0; i < 50; i++) {
    const value = Math.floor(Math.random() * 300) + 10;
    array.push(value);
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value}px`;
    container.appendChild(bar);
  }
}

async function bubbleSort() {
  resetFlags();
  const bars = document.getElementsByClassName("bar");
  for (let i = 0; i < array.length && !stopRequested; i++) {
    for (let j = 0; j < array.length - i - 1 && !stopRequested; j++) {
      bars[j].style.backgroundColor = "red";
      bars[j + 1].style.backgroundColor = "red";

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        bars[j].style.height = `${array[j]}px`;
        bars[j + 1].style.height = `${array[j + 1]}px`;
      }

      await sleep(sortSpeed);
      bars[j].style.backgroundColor = "turquoise";
      bars[j + 1].style.backgroundColor = "turquoise";
    }
  }
}

async function selectionSort() {
  resetFlags();
  const bars = document.getElementsByClassName("bar");
  for (let i = 0; i < array.length && !stopRequested; i++) {
    let minIdx = i;
    bars[minIdx].style.backgroundColor = "blue";
    for (let j = i + 1; j < array.length && !stopRequested; j++) {
      bars[j].style.backgroundColor = "red";
      await sleep(20);
      if (stopRequested) return;
      if (array[j] < array[minIdx]) {
        bars[minIdx].style.backgroundColor = "turquoise";
        minIdx = j;
        bars[minIdx].style.backgroundColor = "blue";
      } else {
        bars[j].style.backgroundColor = "turquoise";
      }
    }
    [array[i], array[minIdx]] = [array[minIdx], array[i]];
    bars[i].style.height = `${array[i]}px`;
    bars[minIdx].style.height = `${array[minIdx]}px`;
    bars[minIdx].style.backgroundColor = "turquoise";
    bars[i].style.backgroundColor = "turquoise";
  }
}

async function insertionSort() {
  resetFlags();
  const bars = document.getElementsByClassName("bar");
  for (let i = 1; i < array.length && !stopRequested; i++) {
    let key = array[i];
    let j = i - 1;
    bars[i].style.backgroundColor = "blue";
    await sleep(20);
    if (stopRequested) return;

    while (j >= 0 && array[j] > key && !stopRequested) {
      bars[j + 1].style.height = `${array[j]}px`;
      array[j + 1] = array[j];
      j--;
      await sleep(20);
    }

    array[j + 1] = key;
    bars[j + 1].style.height = `${key}px`;
    bars[i].style.backgroundColor = "turquoise";
  }
}

async function quickSortHandler() {
  resetFlags();
  await quickSort(0, array.length - 1);
}

async function quickSort(low, high) {
  if (stopRequested) return;
  if (low < high) {
    let pivotIndex = await partition(low, high);
    await quickSort(low, pivotIndex - 1);
    await quickSort(pivotIndex + 1, high);
  }
}

async function partition(low, high) {
  const bars = document.getElementsByClassName("bar");
  let pivot = array[high];
  bars[high].style.backgroundColor = "purple";
  let i = low - 1;

  for (let j = low; j < high && !stopRequested; j++) {
    bars[j].style.backgroundColor = "red";
    await sleep(20);
    if (stopRequested) return high;
    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      bars[i].style.height = `${array[i]}px`;
      bars[j].style.height = `${array[j]}px`;
    }
    bars[j].style.backgroundColor = "turquoise";
  }

  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  bars[i + 1].style.height = `${array[i + 1]}px`;
  bars[high].style.height = `${array[high]}px`;
  bars[high].style.backgroundColor = "turquoise";
  return i + 1;
}

async function mergeSortHandler() {
  resetFlags();
  await mergeSort(0, array.length - 1);
}

async function mergeSort(left, right) {
  if (stopRequested) return;
  if (left >= right) return;
  const mid = Math.floor((left + right) / 2);
  await mergeSort(left, mid);
  await mergeSort(mid + 1, right);
  await merge(left, mid, right);
}

async function merge(left, mid, right) {
  const bars = document.getElementsByClassName("bar");
  const n1 = mid - left + 1;
  const n2 = right - mid;
  const L = [], R = [];

  for (let i = 0; i < n1; i++) L.push(array[left + i]);
  for (let j = 0; j < n2; j++) R.push(array[mid + 1 + j]);

  let i = 0, j = 0, k = left;
  while (i < n1 && j < n2 && !stopRequested) {
    bars[k].style.backgroundColor = "red";
    await sleep(20);
    if (stopRequested) return;
    if (L[i] <= R[j]) {
      array[k] = L[i];
      bars[k].style.height = `${L[i]}px`;
      i++;
    } else {
      array[k] = R[j];
      bars[k].style.height = `${R[j]}px`;
      j++;
    }
    bars[k].style.backgroundColor = "turquoise";
    k++;
  }

  while (i < n1 && !stopRequested) {
    array[k] = L[i];
    bars[k].style.height = `${L[i]}px`;
    bars[k].style.backgroundColor = "turquoise";
    i++; k++;
    await sleep(20);
  }

  while (j < n2 && !stopRequested) {
    array[k] = R[j];
    bars[k].style.height = `${R[j]}px`;
    bars[k].style.backgroundColor = "turquoise";
    j++; k++;
    await sleep(20);
  }
}

generateArray();
