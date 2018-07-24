'use strict'

// 1

function rand(min, max) {
  return Math.ceil((max - min + 1) * Math.random()) + min - 1;
};

function generateId() {
  return Array(4).fill(1).map(value => rand(1000, 9999)).join('-');
};

const pointsInfo = [
  { title: 'Темная сторона Луны', coords: [500, 200, 97] },
  { title: 'Седьмое кольцо Юпитера', coords: [934, -491, 712] },
  { title: 'Саратов', coords: [30, 91, 77] }
];


function OrdersTeleportationPoint(title, x, y, z) {
  this.title = title;
  this.x = x;
  this.y = y;
  this.z = z;
  this.getDistance = function (x, y, z) {
    return Math.sqrt(Math.pow((this.x - x), 2) + Math.pow((this.y - y), 2) + Math.pow((this.z - z), 2))
  }
};


const point = new OrdersTeleportationPoint('Темная сторона Луны', 500, 200, 97);
let distance = point.getDistance(100, -100, 33);
console.log(`Расстояние до пункта «${point.title}» составит ${distance.toFixed(0)} единиц`);

console.log('---------------------------------------------------');

// 2

function OrdersTeleportationPointLocator (points) {
   try {
  if (!Array.isArray(points)) {
    throw `Данные некорректны`;
  }
  this.check = points.filter(function(point) {
			return point instanceof OrdersTeleportationPoint;
		});
  }catch (err) {
  console.log(`Извините, в данных ошибка: ` + err);
  }

  this.getClosest = function(x, y, z) {
    let distance = [];
    this.check.forEach(function(point) {
    distance.push(parseFloat(point.getDistance(x, y, z).toFixed()));
    })

    function getMinOfArray(distances) {
		return Math.min(...distances);
    }

	  let minIndex = distance.indexOf(getMinOfArray(distance));
    return this.check[minIndex];
  }
};

const points = pointsInfo.map(point => new OrdersTeleportationPoint(point.title,...point.coords));
const locator = new OrdersTeleportationPointLocator(points);

const closestPoint = locator.getClosest(333, 294, 77);
console.log(`Ближайший пункт телепортации заказов «${closestPoint.title}»`);

//console.log(points);

console.log('---------------------------------------------------');

// 3

function LoyaltyCard(name, sum) {
  this.client = name;
	this.balance = sum;

	let configId = {};
  configId.value = generateId();
  Object.defineProperty(this, 'id', configId);

	let configBalance = {};
  Object.defineProperty(this, 'balance', configBalance);

  function calcDiscount(sum) {
    let result;
    switch(true) {
      case (sum < 3000):
        result = 0;
        break;
      case (sum < 5000):
        result = 3;
        break;
      case (sum < 10000):
        result = 5;
        break;
      default:
        result = 7;
    }
    return result;
  }

	Object.defineProperty(this, "discount", {
    get: function() {
      return calcDiscount(this.balance);
    }
  });

	this.getFinalSum = function(sum) {
    if(this.discount !== 0) {
      return sum - (sum * this.discount / 100);
    }
    return sum;
  };

  this.append = function(sum) {
    return this.balance += sum;
  };

  this.show = function() {
    console.log(`Карта ${this.id}: \nВладелец: ${this.client} \nБаланс: ${this.balance} \nТекущая скидка: ${this.discount}% \nЗаказы: \n#1 на сумму ${sum}Q \n#2 на сумму ${this.balance - sum}Q`
  )};
};


const card = new LoyaltyCard('Иванов Иван', 3000);

let newOrderSum = 7000;
let finalSum = card.getFinalSum(newOrderSum);
console.log(`Итоговая сумма для заказа на ${newOrderSum} Q по карте
  составит ${finalSum} Q. Скидка ${card.discount} %.`);

card.append(newOrderSum);
console.log(`Баланс карты после покупки ${card.balance} Q.`);
card.show();
