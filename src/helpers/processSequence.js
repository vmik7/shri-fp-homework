/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */

/**
 * Допишите файл src/helpers/processSequence.js. Необходимо написать последовательную цепочку для вычисления разных значений, которая состоит из синхронных и асинхронных действий. Напишите реализацию в FP стиле.
 * Берем строку N. Пишем изначальную строку в writeLog.
 * Строка валидируется по следующим правилам:
 *      кол-во символов в числе должно быть меньше 10.
 *      кол-во символов в числе должно быть больше 2.
 *      число должно быть положительным
 *      символы в строке только [0-9] и точка т.е. число в 10-ной системе счисления (возможно с плавающей запятой)
 * В случае ошибки валидации вызвать handleError с 'ValidationError' строкой в качестве аргумента
 * Привести строку к числу, округлить к ближайшему целому с точностью до единицы, записать в writeLog.
 * C помощью API /numbers/base перевести из 10-й системы счисления в двоичную, результат записать в writeLog
 * Взять кол-во символов в полученном от API числе записать в writeLog
 * Возвести в квадрат с помощью Javascript записать в writeLog
 * Взять остаток от деления на 3, записать в writeLog
 * C помощью API /animals.tech/id/name получить случайное животное используя полученный остаток в качестве id
 * Завершить цепочку вызовом handleSuccess в который в качестве аргумента положить результат полученный на предыдущем шаге
 */

import {
    allPass,
    compose,
    gte,
    length,
    multiply,
    lte,
    toString,
    __,
    test,
    andThen,
    pipe,
    tap,
    modulo,
    curry,
    prop,
    assoc,
    replace,
    ifElse,
    always,
} from 'ramda';
import Api from '../tools/api';

const api = new Api();

// Возведение в квадрат
const square = (value) => multiply(value, value);

// Валидация
const validate = allPass([
    compose(lte(__, 10), length, toString),
    compose(gte(__, 2), length, toString),
    gte(__, 0),
    test(/[0-9.]*/),
]);

// Функция для построения цепочки промисов
const then = curry((fn, promise) => promise.then(fn));

// API запрос на перевод в двоичную систему счисления
const toBinary = pipe(
    assoc('number', __, { from: 10, to: 2 }),
    api.get('https://api.tech/numbers/base'),
    then(prop('result')),
);

// API запрос животного по ID
const getAnimal = pipe(
    replace('{id}', __, `https://animals.tech/{id}`),
    api.get(__, {}),
    then(prop('result')),
);

// Обработка валидных данных
const process = ({ writeLog, handleSuccess }) =>
    pipe(
        Number,
        Math.round,
        tap(writeLog),
        toBinary,
        then(tap(writeLog)),
        then(length),
        then(tap(writeLog)),
        then(square),
        then(tap(writeLog)),
        then(modulo(__, 3)),
        then(tap(writeLog)),
        then(getAnimal),
        then(handleSuccess),
    );

const processSequence = ({ value, writeLog, handleSuccess, handleError }) =>
    pipe(
        tap(writeLog),
        ifElse(
            validate,
            process({ writeLog, handleSuccess }),
            compose(handleError, always('ValidationError')),
        ),
    )(value);

export default processSequence;
