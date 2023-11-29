import { pluralize } from "./pluralize.mjs";

//Получаем элементы из DOM
const inputAll = document.querySelectorAll('input')
const reset = document.getElementById('reset');
const setting = document.getElementById('setting');
const settingMenu = document.getElementById('setting-menu');
const startNumberUser = document.getElementById('start_number');
const endNumberUser = document.getElementById('end_number');
const acceptButton = document.getElementById('accept_button');
const userNumber = document.getElementById('user_number');
const guessButton = document.getElementById('guess_button');
const hintText = document.getElementById('hint_text');
const helpText = document.getElementById('help_text');
const countTry = document.getElementById('count_try');
const countText = document.querySelector('.count_text');

//Начальные состояния
let secretNumber;
let startNumber = 1;
let endNumber = 100;
let count = 0;
let isEven;
let isWin;

//Начальный вызов игры
startGame();

//Ограничиваем ввод number только цифрами для всех input
inputAll.forEach(input => {
  input.oninput = () => {
    input.value = input.value.replace(/[A-Za-zА-Яа-яЁё\,\.<>/\|+={}~`[\]:;"'?!@#$%^&*()_\-]/g, '');
  }
})

//Создаем слушатель события на клик
guessButton.addEventListener('click', (event) => {
  event.preventDefault();
  //Проверяем что все поля заполнены и пользователь не победил
  if (userNumber.value !== '' && !isWin) {
    checkNumber(Number(userNumber.value))
  }
})

//Создаем слушатель события на клик для старта игры
reset.addEventListener('click', () => startGame());

//Создаем слушатель события на клик для открытия меню настроек
setting.addEventListener('click', () => settingMenu.classList.toggle('visible'));

//Создаем слушатель события по нажатию на кнопку ОК
acceptButton.addEventListener('click', () => {
  startNumber = Number(startNumberUser.value);
  endNumber = Number(endNumberUser.value);

  //Проверяем что введеные числа из диапазона корректны
  if (startNumber < 1) {
    startNumberUser.style.border = '2px solid var(--red)';
    return;
  } 
  if (endNumber > 1000) {
    endNumberUser.style.border = '2px solid var(--red)';
    return;
  } 
  if (startNumber > endNumber) {
    startNumberUser.style.border = '2px solid var(--red)';
    endNumberUser.style.border = '2px solid var(--red)';
    return;
  }

  //Сбрасываем стиль ошибки
  startNumberUser.style.border = '2px solid var(--black)';
  endNumberUser.style.border = '2px solid var(--black)';
  
  settingMenu.classList.toggle('visible');
  
  startGame();
})

/**
 * Старт новой игры
 */
function startGame() {
  isWin = false;

  secretNumber = getRandomNumber(startNumber, endNumber);
  //Проверяем на четность загаданное число
  isEven = secretNumber % 2 === 0 ? true : false;

  //Сбрасываем поля до начальных состояний
  count = 0;
  countTry.innerHTML = '';
  countText.innerHTML = '';
  hintText.innerHTML = '';
  helpText.innerHTML = '';
  userNumber.value = '';
}

/**
 * Генерация случайного числа в заданном диапазоне
 * @param {Number} min Минимальное число
 * @param {Number} max Максимальное число
 * @returns Случайное число
 */
function getRandomNumber(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

/**
 * Функция для проверки введенного числа
 * @param {Number} number Число для проверки
 */
function checkNumber(number) {
  //Проверяем что число входит в диапазон
  if (number < startNumber || number > endNumber) {
    hintText.innerHTML  = `Введи число от ${startNumber} до ${endNumber}`;
    helpText.innerHTML = '';
    return
  } else {
    hintText.innerHTML = '';
    count++;
    countTry.innerHTML = count;
    countText.innerHTML = pluralize(count, ['попытка', 'попытки', 'попыток']);
  }

  //Проверяем совпало ли проверяемое число с загаданным
  if (number === secretNumber) {
    isWin = true;
    hintText.innerHTML = `Ты выиграл, с ${count} попытки`;
    helpText.innerHTML = '';
    return;
  }
  
  //Выводим подсказки после каждого хода
  if (number > secretNumber) {
    hintText.innerHTML = 'Нет.. загаданное число меньше твоего';
  } else if (number < secretNumber) {
    hintText.innerHTML = 'Нет.. загаданное число больше твоего';
  }
  
  //Выводим после 3 неудачных попыток подсказку о четночти/нечетности числа
  if (count % 3 === 0) {
    isEven ? helpText.innerHTML = 'Оно чётное' : helpText.innerHTML = 'Оно нечётное';
  }
}