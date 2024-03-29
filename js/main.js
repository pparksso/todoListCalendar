const showDay = document.querySelector(".left .showDay");
const showDate = document.querySelector(".left .showDate");
const showyear = document.querySelector(".right .year");
const showMonth = document.querySelector(".right .month");
const date = document.querySelector(".right .date");
const preBtn = document.querySelector(".right .prevBtn");
const nextBtn = document.querySelector(".right .nextBtn");
const todoWrite = document.querySelector("#todoWrite");
const todoBtn = document.querySelector(".todoBtn");
const todoList = document.querySelector(".todoList");

const monthlyArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weeklyArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let siblings = [];

const today = new Date();
let current = new Date(); //달력을 이번달, 다음달로 이동하게 하기위한 새로운 객체, 버튼이 눌러지면 계속해서 인수가 바뀐다.
let dateLoop = new Date(); //요일을 바꾸기 위한 객체
const todayYear = today.getFullYear();
const todayMonth = today.getMonth();
const todayWeek = today.getDay();
const todayDate = today.getDate();

//처음 로드됐을 때 들어갈 숫자들
showyear.innerHTML = `${todayYear}`;
showMonth.innerHTML = `${monthlyArr[todayMonth]}`;
showDay.innerHTML = `<h2>${weeklyArr[todayWeek]}</h2>`;
showDate.innerHTML = `<h1>${todayDate}</h1>`;

const makeCalendar = function (year, month) {
  const thisFirst = new Date(year, month, 1);
  const preLast = new Date(year, month, 0);
  const thisLast = new Date(year, month + 1, 0);
  const firstDay = thisFirst.getDay();
  const preLastDay = preLast.getDay();
  const thisLastDay = thisLast.getDay();
  const preLastDate = preLast.getDate();
  const thisLastDate = thisLast.getDate();

  let tempHtml = "";

  //저번달의 마지막 날짜와 요일을 구해서 그만큼 채워지게 짬, 만약에 마지막 날짜가 토요일이면 생성 안되게 해놨음
  for (let i = preLastDate - preLastDay; i <= preLastDate; i++) {
    if (preLastDay === 6) {
      break;
    } else {
      tempHtml += `<li class="off"><span>${i}</span></li>`;
    }
  }
  //이번달의 마지막날짜까지 채워지게하고, 요일을 클릭할 때 마다 바꾸기위해 새로운 날짜생성객체를 만듬. j(date)가 늘어나는 객체를 만들고, 그 날짜의 요일 인덱스를 data-day에 넣음.
  for (let j = 1; j <= thisLastDate; j++) {
    dateLoop = new Date(year, month, j);
    tempHtml += `<li data-date = "${j}" data-day = ${dateLoop.getDay()}><span>${j}</span></li>`;
  }
  //이번달의 마지막 요일 후 남은 칸만큼 숫자가 채워지게
  for (let k = 1; k <= 6 - thisLastDay; k++) {
    tempHtml += `<li class="off"><span>${k}</span></li>`;
  }
  date.innerHTML = tempHtml;
};

//달을 이동할 때마다 바뀌는 리스트를 다시 배열에 넣어줘야하기 때문에 함수로 만들어 각 이벤트리스너 안의 리스트 생성 후의 순서에 넣어줌
const siblingsList = function () {
  let dateList = document.querySelectorAll(".right .date li");
  siblings = [...dateList];

  siblings.forEach((item) => {
    item.addEventListener("click", () => {
      if (item.classList.contains("off")) {
        return false;
      }
      siblings.forEach((item2) => {
        item2.classList.remove("click");
      });
      showDate.innerHTML = `<h2>${item.dataset.date}</h2>`;
      showDay.innerHTML = `<h1>${weeklyArr[item.dataset.day]}</h1>`;
      item.classList.add("click");
    });
  });
};

makeCalendar(todayYear, todayMonth);
siblingsList();

//계속해서 current의 인수는 바뀐다.
preBtn.addEventListener("click", () => {
  current = new Date(current.getFullYear(), current.getMonth() - 1);
  makeCalendar(current.getFullYear(), current.getMonth());
  siblingsList();
  showyear.innerHTML = `${current.getFullYear()}`;
  showMonth.innerHTML = `${monthlyArr[current.getMonth()]}`;
});
nextBtn.addEventListener("click", () => {
  current = new Date(current.getFullYear(), current.getMonth() + 1);
  makeCalendar(current.getFullYear(), current.getMonth());
  siblingsList();
  showyear.innerHTML = `${current.getFullYear()}`;
  showMonth.innerHTML = `${monthlyArr[current.getMonth()]}`;
});

//todolist

let todoEl = "";
let todoArray = [];
let todoObj = {};

const todoMake = (todayYear, todayMonth, todayDate) => {
  let doItValue = todoWrite.value;
  ObjDate = `${todayYear}/${todayMonth}/${todayDate}`;
  todoObj["date"] = ObjDate;
  todoObj["todo"] = doItValue;
  todoArray.push(todoObj);
  window.localStorage.setItem("todo", JSON.stringify(todoArray));
  todoJson = JSON.parse(localStorage.getItem(`todo`));
  todoArray = [...new Set(todoJson)];
  const todoObjTodo = todoArray.filter((item) => {
    if (item.date === `${todayYear}/${todayMonth}/${todayDate}`) {
      return true;
    }
  });
  todoObjTodo.forEach((item) => {
    todoEl = item.todo;
  });
};
const todoListMaker = () => {
  let todoYear = current.getFullYear();
  let todoMonth = current.getMonth();
  let clickDate = document.querySelector(".right .date .click");
  let ObjDate = "";
  if (clickDate === null) {
    todoMake(todayYear, todayMonth, todayDate);
  } else {
    let clickDateEl = clickDate.getAttribute("data-date");
    todoMake(todoYear, todoMonth, clickDateEl);
  }
  todoList.innerHTML += `<li class = "todoListEl"><span class = "todoItem">${todoEl}</span><button class="xBtn" data-date='${ObjDate}' data-todo="${todoEl}">X</button></li>`;

  const xBtns = document.querySelectorAll(".xBtn");
  xBtns.forEach((item, idex) => {
    item.addEventListener("click", function () {
      item.parentNode.remove();
      todoJson = JSON.parse(localStorage.getItem(`todo`));
      todoArray = [...new Set(todoJson)];
      for (let i = 0; i < todoArray.length; i++) {
        if (todoArray[i].date === item.dataset.date && todoArray[i].todo === item.dataset.todo) {
          todoArray.splice(i, 1);
        }
      }
      window.localStorage.setItem("todo", JSON.stringify(todoArray));
    });
  });

  const todoItems = document.querySelectorAll(".todoItem");
  todoItems.forEach((item) => {
    item.addEventListener("click", function () {
      item.classList.toggle("check");
    });
  });
};

//처음 로드 됐을 때 상태
const xBtnWork = () => {
  const xBtns = document.querySelectorAll(".xBtn");
  xBtns.forEach(function (item) {
    item.addEventListener("click", function () {
      item.parentNode.remove();
      todoJson = JSON.parse(localStorage.getItem(`todo`));
      todoArray = [...new Set(todoJson)];
      for (let i = 0; i < todoArray.length; i++) {
        if (todoArray[i].date === item.dataset.date && todoArray[i].todo === item.dataset.todo) {
          todoArray.splice(i, 1);
        }
      }
      window.localStorage.setItem("todo", JSON.stringify(todoArray));
    });
  });
};
const startDisplay = () => {
  const todoListEls = document.querySelectorAll(".todoListEl");
  let ObjDate = `${todayYear}/${todayMonth}/${todayDate}`;
  let todoJson = JSON.parse(localStorage.getItem(`todo`));
  todoArray = [...new Set(todoJson)];

  const todoObjTodo = todoArray.filter((item) => {
    if (item.date === `${todayYear}/${todayMonth}/${todayDate}`) {
      return true;
    }
  });
  todoObjTodo.forEach((item) => {
    todoEl = item.todo;
    todoList.innerHTML += `<li class = "todoListEl"><span class = "todoItem">${todoEl}</span><button class="xBtn" data-date='${ObjDate}' data-todo="${todoEl}">X</button></li>`;
  });
  xBtnWork();
};

startDisplay();

todoBtn.addEventListener("click", function () {
  if (todoWrite.value === "") {
    false;
  } else {
    todoListMaker();
    todoWrite.value = "";
  }
});

todoWrite.addEventListener("keydown", function (e) {
  if (e.keyCode === 13) {
    if (todoWrite.value === "") {
      false;
    } else {
      todoListMaker();
      todoWrite.value = "";
    }
  }
});

const dates = document.querySelectorAll(".right .date li");
dates.forEach((item) => {
  item.addEventListener("click", () => {
    todoList.innerHTML = "";
    let todoYear = current.getFullYear();
    let todoMonth = current.getMonth();
    let clickDate = document.querySelector(".right .date .click");
    let clickDateEl = clickDate.getAttribute("data-date");
    let ObjDate = `${todoYear}/${todoMonth}/${clickDateEl}`;
    let todoJson = JSON.parse(localStorage.getItem(`todo`));
    todoArray = [...new Set(todoJson)];
    const todoObjTodo = todoArray.filter(function (item) {
      if (item.date === `${todoYear}/${todoMonth}/${clickDateEl}`) {
        return true;
      }
    });
    todoObjTodo.forEach(function (item) {
      todoEl = item.todo;
      todoList.innerHTML += `<li class = "todoListEl"><span class = "todoItem">${todoEl}</span><button class="xBtn" data-date='${ObjDate}' data-todo="${todoEl}">X</button></li>`;
    });
    xBtnWork();
  });
});
