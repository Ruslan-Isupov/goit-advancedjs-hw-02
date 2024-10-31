import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const mainInput = document.querySelector('#datetime-picker');
const buttonStart = document.querySelector('[data-start]');
const daysInput = document.querySelector('[data-days]');
const hoursInput = document.querySelector('[data-hours]');
const minutesInput = document.querySelector('[data-minutes]');
const secondsInput = document.querySelector('[data-seconds]');

let userSelectedDate = 0;
let timerId = 0;

setAttributeDefault();

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0].getTime() <= options.defaultDate.getTime()) {
      iziToast.warning({
        title: 'Alert',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      setAttributeDefault();
    } else {
      userSelectedDate = selectedDates[0].getTime();
      buttonStart.removeAttribute('disabled');
    }
  },
};

flatpickr(mainInput, options);

buttonStart.addEventListener('click', () => {
  timerId = setInterval(turnStart, 1000);
  mainInput.setAttribute('disabled', 'true');
});

function setAttributeDefault() {
  buttonStart.setAttribute('disabled', '');
}

function turnStart() {
  setAttributeDefault();

  const datedifference = userSelectedDate - Date.now();

  const calendarDate = convertMs(datedifference);
  addLeadingZero(calendarDate);

  if (datedifference < 1000) {
    clearInterval(timerId);
    mainInput.removeAttribute('disabled');
  }
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero({ days, hours, minutes, seconds }) {
  daysInput.textContent = String(days).padStart(2, '0');
  hoursInput.textContent = String(hours).padStart(2, '0');
  minutesInput.textContent = String(minutes).padStart(2, '0');
  secondsInput.textContent = String(seconds).padStart(2, '0');
}
