const inputElement = document.querySelector(".inputBox");
const inputBtnElement = document.querySelector(".submitBtn");
const originalValueDivsContainer = document.querySelector(".original-array");
const modifiedArrayContainer = document.querySelector(".modified-array");
const sortButtons = document.querySelectorAll(".sortBtn");
const prevBtn = document.querySelector(".prevBtn");
const nextBtn = document.querySelector(".nextBtn");

let originalArray = [];
let sortingSteps = [];
let currentStep = -1;

// Utility function to display notifications
function showPopUpNotification(text) {
  const tempDiv = document.createElement("div");
  tempDiv.setAttribute("class", "toastDiv");
  tempDiv.innerText = text;
  document.body.appendChild(tempDiv);
  setTimeout(() => {
    document.body.removeChild(tempDiv);
  }, 3000);
}

// Add a new number to the array
function getInputOneByOne() {
  if (originalArray.length > 9)
    return showPopUpNotification("Array limit is 10");
  if (isNaN(parseInt(inputElement.value)) || !inputElement.value) {
    return showPopUpNotification("Enter a valid number.");
  }
  originalArray.push(parseInt(inputElement.value));
  renderOriginalArray();
  inputElement.value = "";
}

// Render the original array
function renderOriginalArray() {
  originalValueDivsContainer.innerHTML = "";
  originalArray.forEach((elem) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerText = elem;
    originalValueDivsContainer.appendChild(tempDiv);
  });
}

// Quick Sort Implementation with Steps Recorded
function quickSort(array, low, high, steps) {
  if (low < high) {
    const pi = partition(array, low, high, steps);
    quickSort(array, low, pi - 1, steps);
    quickSort(array, pi + 1, high, steps);
  }
}

function partition(array, low, high, steps) {
  const pivot = array[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    steps.push({ type: "compare", indices: [j, high], array: [...array] });
    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      steps.push({ type: "swap", indices: [i, j], array: [...array] });
    }
  }
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  steps.push({ type: "swap", indices: [i + 1, high], array: [...array] });
  return i + 1;
}

// Merge Sort Implementation with Steps Recorded
function mergeSort(array, steps) {
  if (array.length <= 1) return array;
  const mid = Math.floor(array.length / 2);
  const left = mergeSort(array.slice(0, mid), steps);
  const right = mergeSort(array.slice(mid), steps);
  return merge(left, right, steps, array);
}

function merge(left, right, steps, originalArray) {
  let result = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    steps.push({
      type: "compare",
      indices: [i, j],
      array: [...originalArray],
    });
    if (left[i] < right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  result = result.concat(left.slice(i), right.slice(j));
  steps.push({ type: "merge", array: result, originalArray });
  return result;
}

// Bubble Sort Implementation with Steps Recorded
function bubbleSort(array, steps) {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      steps.push({
        type: "compare",
        indices: [j, j + 1],
        array: [...array],
      });
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        steps.push({
          type: "swap",
          indices: [j, j + 1],
          array: [...array],
        });
      }
    }
  }
  return array;
}

// Selection Sort Implementation with Steps Recorded
function selectionSort(array, steps) {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      steps.push({
        type: "compare",
        indices: [minIdx, j],
        array: [...array],
      });
      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      steps.push({
        type: "swap",
        indices: [i, minIdx],
        array: [...array],
      });
    }
  }
  return array;
}

// Insertion Sort Implementation with Steps Recorded
function insertionSort(array, steps) {
  const n = array.length;
  for (let i = 1; i < n; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      steps.push({
        type: "compare",
        indices: [j, j + 1],
        array: [...array],
      });
      array[j + 1] = array[j];
      j--;
      steps.push({
        type: "swap",
        indices: [j + 1, j],
        array: [...array],
      });
    }
    array[j + 1] = key;
  }
  return array;
}

// Heap Sort Implementation with Steps Recorded
function heapSort(array, steps) {
  const n = array.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(array, n, i, steps);
  }

  for (let i = n - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    steps.push({
      type: "swap",
      indices: [0, i],
      array: [...array],
    });
    heapify(array, i, 0, steps);
  }
}

function heapify(array, n, i, steps) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && array[left] > array[largest]) {
    largest = left;
  }

  if (right < n && array[right] > array[largest]) {
    largest = right;
  }

  if (largest !== i) {
    [array[i], array[largest]] = [array[largest], array[i]];
    steps.push({
      type: "swap",
      indices: [i, largest],
      array: [...array],
    });
    heapify(array, n, largest, steps);
  }
}

// Handling Sorting Buttons Click Events
sortButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const sortType = button.getAttribute("data-sort");
    let steps = [];
    let sortedArray = [...originalArray];

    switch (sortType) {
      case "quick":
        quickSort(sortedArray, 0, sortedArray.length - 1, steps);
        break;
      case "merge":
        sortedArray = mergeSort(sortedArray, steps);
        break;
      case "bubble":
        bubbleSort(sortedArray, steps);
        break;
      case "selection":
        selectionSort(sortedArray, steps);
        break;
      case "insertion":
        insertionSort(sortedArray, steps);
        break;
      case "heap":
        heapSort(sortedArray, steps);
        break;
    }
    sortingSteps = steps;
    currentStep = -1;
    renderSortingSteps();
  });
});

// Render each sorting step
function renderSortingSteps() {
  if (currentStep < sortingSteps.length - 1) {
    currentStep++;
    const step = sortingSteps[currentStep];
    modifiedArrayContainer.innerHTML = "";
    step.array.forEach((elem) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerText = elem;
      modifiedArrayContainer.appendChild(tempDiv);
    });
  }
}

// Add a new number to the array
inputBtnElement.addEventListener("click", getInputOneByOne);

// Navigation between steps
prevBtn.addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep--;
    renderSortingSteps();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentStep < sortingSteps.length - 1) {
    currentStep++;
    renderSortingSteps();
  }
});

// Add Event Listener for Enter key
