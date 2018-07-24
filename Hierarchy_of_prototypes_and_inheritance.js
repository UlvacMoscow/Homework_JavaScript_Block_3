'use strict'

// 1

class Calendar {
  constructor(now = new Date()) {
    this.now = now;
  }

  setDate(now) {
    this.now = now;
  }

  get today() {
    return this.now.toLocaleString('ru-Ru');
  }
}

class PaymentTerminal {
  constructor(title, calendar) {
    this.title = title;
    this.calendar = calendar;
  }

  get status() {
    return this.isActive ? 'работает' : 'недоступен';
  }

  get isActive() {
    return this.checkActive();
  }

  checkActive() {
    return false;
  }
}

class RegistrationError extends Error {
  constructor(field = null) {
    super(`Ошибка в поле ${field}`);
    this.field = field;
  }
}

class NotValidEmailRegistrationError extends RegistrationError {
  constructor(field, email) {
    super(field);
    this.email = email;
  }
}

class NotUniqueRegistrationError extends RegistrationError {
  constructor(field, value) {
    super(field);
    this.value = value;
  }
}

class NotSameRegistrationError extends RegistrationError {}

function isValidEmail(email) {
  return /^\w+(\.\w+)*@\w+(\.\w+)+$/i.test(email);
}

function isUniqueLogin(login) {
  return !['admin', 'boss'].includes(login);
}

function checkPassword(original, copy) {
  return original === copy;
}

function registerNewUser(data) {
  if (!isValidEmail(data.email)) {
    throw new NotValidEmailRegistrationError('Адрес электронной почты', data.email);
  }
  if (!isUniqueLogin(data.login)) {
    throw new NotUniqueRegistrationError('Логин', data.login);
  }
  if (!checkPassword(data.password, data.passwordCopy)) {
    throw new NotSameRegistrationError('Пароль');
  }
}

console.log('----------------------------Задание 1-----------------------------------')

class SpaceDate extends Date  {
  copy()  {
    return new SpaceDate(this)
  }

  getNextDate(day = 1) {
    let moment = new SpaceDate(this)
    return new SpaceDate(moment.setDate(moment.getDate() + day))
  }
  getPrevDate() {
    return this.getNextDate(-1)
  }

  getDayBeginning() {
    return new SpaceDate(this.setHours(0, 0, 0, 0))
  }

  getDayEnd() {
    return new SpaceDate(this.setHours(23,59,59,999))
  }
}

let dateOriginal = new SpaceDate(2017, 1, 22);
let dateCopy = dateOriginal.copy();
dateCopy.setYear(2022);
console.log(`Оригинальная дата: ${dateOriginal.toLocaleDateString('ru-Ru')}`);
console.log(`Измененная копия: ${dateCopy.toLocaleDateString('ru-Ru')}`);

let orderDate = new SpaceDate(2017, 2, 10);
let deliveryDate = orderDate.getNextDate();
console.log(`Дата заказа: ${orderDate.toLocaleDateString('ru-Ru')}`);
console.log(`Дата доставки: ${deliveryDate.toLocaleDateString('ru-Ru')}`);

let supplyDate = new SpaceDate(2017, 3, 3);
let requestDate = supplyDate.getPrevDate();
console.log(`Дата поставки: ${supplyDate.toLocaleDateString('ru-Ru')}`);
console.log(`Дата заявки поставщику: ${requestDate.toLocaleDateString('ru-Ru')}`);

let someDate = new SpaceDate(2017, 2, 10, 12, 44);
let from = someDate.getDayBeginning();
let to = someDate.getDayEnd();
console.log(`В любое время с ${from.toLocaleString('ru-Ru')} по ${to.toLocaleString('ru-Ru')}`);

console.log('----------------------------Задание 2-----------------------------------')


class AllDayPaymentTerminal extends PaymentTerminal {
  checkActive() {
    return true
  }
}

class AllDayExceptHolidaysPaymentTerminal extends PaymentTerminal {
  constructor(title, calendar, holidays)  {
    super(title, calendar)
    this.holidays = holidays
  }
  checkActive() {
    let Day = this.calendar.now.getDate();
    let Month = this.calendar.now.getMonth();
    for (let item of this.holidays) {
      if ((Day === item['date']) && (Month === item['month'])) {
        return false;
      }
    }

    return true;
  }
}

class WorkspacePaymentTerminal extends PaymentTerminal {
  checkActive() {
    let day = this.calendar.now.getDay()
    let hour = this.calendar.now.getHours()
    if ((day === 0) || (day === 6)) {
      return false
    }else{
      if ((hour < 8) || (hour >= 18))  {
        return false
      }
    }
    return true
  }
}


const holidays = [
  { date: 11, month: 3 - 1 },
  { date: 23, month: 2 - 1 }
];

const calendar = new Calendar();
const terminals = [
  new WorkspacePaymentTerminal('Терминал в офисе Убербанка', calendar),
  new AllDayPaymentTerminal('Терминал в аэропорту', calendar),
  new AllDayExceptHolidaysPaymentTerminal('Терминал в торговом центре',
    calendar, holidays)
];

function showTerminals(date) {
  if (date !== undefined) {
    calendar.setDate(date);
  }
  console.log(calendar.today);
  terminals
    .filter(terminal => terminal instanceof PaymentTerminal)
    .forEach(terminal => console.log(`${terminal.title} ${terminal.status}`));
}

showTerminals(new Date(2017, 2 - 1, 23));
showTerminals(new Date(2017, 3 - 1, 11));
showTerminals(new Date(2017, 3 - 1, 14, 18, 1));
showTerminals(new Date(2017, 3 - 1, 14, 8, 3));

console.log('----------------------------Задание 3-----------------------------------')

function handleRegistration(field) {
  try{
    registerNewUser(field)
  }
  catch(err)  {
    if (err instanceof NotValidEmailRegistrationError) {
      console.log(`«${err.email}» не является адресом электронной почты`);
    } else if (err instanceof NotUniqueRegistrationError) {
      console.log(`Пользователь с логином «${err.value}» уже зарегистрирован`);
    } else if (err instanceof NotSameRegistrationError) {
      console.log('Введенные пароли не совпадают');
    }
  }
}


const notValidEmailUser = { email: 'test' };
handleRegistration(notValidEmailUser);

const notUniqueLoginUser = { email: 'test@test.co', login: 'boss' };
handleRegistration(notUniqueLoginUser);

const differentPwUser = { email: 'test@test.co', login: 'ivan',
  password: '123', passwordCopy: '456' };
handleRegistration(differentPwUser);

const normalUser = { email: 'test@test.co', login: 'ivan', password: '123', passwordCopy: '123' };
handleRegistration(normalUser);
