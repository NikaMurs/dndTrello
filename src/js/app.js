const columnFooterButtons = document.querySelectorAll(".columnFooterButton");

function createColumnFooterNewCard() {
  return `
    <div class="columnFooterNewCard">
        <textarea class="columnFooterNewCardText" id="" placeholder="Enter a title for this card..."></textarea>
        <div class="columnFooterNewCardButtons">
            <button class="columnFooterNewCardAdd">Add Card</button>
            <button class="columnFooterNewCardClose">&#10006;</button>
        </div>
    </div>
    `;
}

function createColumnContentCard(text) {
  return `
    <div class="columnContentCard drop">
        <p class="columnContentCardText">${text}</p>
        <button class="columnContentCardDelete">&#10006;</button>
    </div>
    `;
}

function cardDelete(e) {
  e.target.parentElement.remove();
}

function listenerCardDeletes() {
  const columnContentCardDeletes = document.querySelectorAll(
    ".columnContentCardDelete"
  );
  for (let i = 0; i < columnContentCardDeletes.length; i++) {
    columnContentCardDeletes[i].removeEventListener("click", cardDelete);
  }
  for (let i = 0; i < columnContentCardDeletes.length; i++) {
    columnContentCardDeletes[i].addEventListener("click", cardDelete);
  }
  listenerCards();
}

for (let i = 0; i < columnFooterButtons.length; i++) {
  columnFooterButtons[i].addEventListener("click", (e) => {
    e.target.classList.add("hide");
    e.target.insertAdjacentHTML("afterEnd", createColumnFooterNewCard());

    const addButton = e.target.parentElement.querySelector(
      ".columnFooterNewCardAdd"
    );
    const closeButton = e.target.parentElement.querySelector(
      ".columnFooterNewCardClose"
    );

    addButton.addEventListener("click", (e) => {
      const value = e.target.parentElement.parentElement.querySelector(
        ".columnFooterNewCardText"
      ).value;
      if (value.trim() != "") {
        e.target
          .closest(".column")
          .querySelector(".columnContent")
          .insertAdjacentHTML("beforeEnd", createColumnContentCard(value));
        e.target
          .closest(".columnFooter")
          .querySelector(".columnFooterButton")
          .classList.remove("hide");
        e.target.closest(".columnFooterNewCard").remove();
        listenerCardDeletes();
      }
    });

    closeButton.addEventListener("click", (e) => {
      e.target
        .closest(".columnFooter")
        .querySelector(".columnFooterButton")
        .classList.remove("hide");
      e.target.closest(".columnFooterNewCard").remove();
    });
  });
}

let actualElement;
let actualElementX;
let actualElementY;

function listenerCards() {
  const columnContentCards = document.querySelectorAll(".columnContentCard");
  for (let i = 0; i < columnContentCards.length; i++) {
    columnContentCards[i].removeEventListener("mousedown", onMouseDown);
  }

  for (let i = 0; i < columnContentCards.length; i++) {
    columnContentCards[i].addEventListener("mousedown", onMouseDown);
  }
}

function onMouseDown(e) {
  e.preventDefault();
  actualElementX = e.offsetX;
  actualElementY = e.offsetY;
  actualElement = e.target.parentElement;
  actualElement.classList.add("dragged");
  actualElement.parentElement.style.paddingBottom =
    actualElement.offsetHeight + 9.5 + "px";

  document.documentElement.addEventListener("mouseup", onMouseUp);
  document.addEventListener("mousemove", onMouseMove);
}

let currentElement = null;

function onMouseMove(e) {
  if (actualElement) {
    actualElement.style.top = e.clientY - actualElementY + "px";
    actualElement.style.left = e.clientX - actualElementX + "px";
    actualElement.hidden = true;
    let elementBelow = document
      .elementFromPoint(e.clientX, e.clientY)
      .closest(".drop");
    actualElement.hidden = false;
    if (elementBelow) {
      if (currentElement) {
        currentElement.style.borderBottom = "none";
      }
      currentElement = elementBelow;
      if (currentElement) {
        currentElement.style.borderBottom = `solid ${
          actualElement.offsetHeight + 10
        }px #dee2e5`;
      }
    }
  }
}

function onMouseUp(e) {
  if (actualElement) {
    actualElement.classList.remove("dragged");

    actualElement.style.top = "";
    actualElement.style.left = "";
    actualElement.parentElement.style.paddingBottom = 10 + "px";

    if (document.elementFromPoint(e.clientX, e.clientY).closest(".drop")) {
      document
        .elementFromPoint(e.clientX, e.clientY)
        .closest(".drop")
        .insertAdjacentElement("afterend", actualElement);
    }
    actualElement = undefined;
    actualElementX = undefined;
    actualElementY = undefined;
    if (currentElement) {
      currentElement.style.borderBottom = "none";
    }
  }

  document.documentElement.removeEventListener("mouseup", onMouseUp);
  document.documentElement.removeEventListener("mousemove", onMouseMove);
}

const columns = document.querySelectorAll(".column");
let arr = [];
let arrayLC = [];

window.addEventListener("DOMContentLoaded", () => {
  let data = JSON.parse(localStorage.getItem("data"));
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      columns[i]
        .querySelector(".columnContent")
        .insertAdjacentHTML("beforeend", createColumnContentCard(data[i][j]));
    }
  }
  listenerCardDeletes();
});

window.addEventListener("beforeunload", () => {
  for (let i = 0; i < columns.length; i++) {
    let textContent = columns[i].querySelectorAll(".columnContentCardText");
    arr = [];
    for (let j = 0; j < textContent.length; j++) {
      arr.push(textContent[j].textContent);
    }
    arrayLC.push(arr);
  }
  localStorage.setItem("data", JSON.stringify(arrayLC));
});
