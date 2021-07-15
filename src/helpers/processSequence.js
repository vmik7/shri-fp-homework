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

import { allPass, compose, gte, length, lte, toString, __, test } from 'ramda';
import Api from '../tools/api';

const api = new Api();

/**
 * Я – пример, удали меня
 */
// const wait = (time) =>
//     new Promise((resolve) => {
//         setTimeout(resolve, time);
//     });

// const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
//     /**
//      * Я – пример, удали меня
//      */
//     writeLog(value);

//     api.get('https://api.tech/numbers/base', {
//         from: 2,
//         to: 10,
//         number: '01011010101',
//     }).then(({ result }) => {
//         writeLog(result);
//     });

//     wait(2500)
//         .then(() => {
//             writeLog('SecondLog');

//             return wait(1500);
//         })
//         .then(() => {
//             writeLog('ThirdLog');

//             return wait(400);
//         })
//         .then(() => {
//             handleSuccess('Done');
//         });
// };

const validate = allPass([
    compose(lte(__, 10), length, toString),
    compose(gte(__, 2), length, toString),
    gte(__, 0),
    test(/[0-9.]*/),
]);

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
    writeLog(value);

    if (!validate(value)) {
        handleError('ValidationError');
    }

    const number = Math.round(+value);
    writeLog(number);

    api.get('https://api.tech/numbers/base', {
        from: 10,
        to: 2,
        number,
    })
        .then(({ result }) => {
            writeLog(result);
            return length(result);
        })
        .then((result) => {
            writeLog(result);
            return result * result;
        })
        .then((result) => {
            writeLog(result);
            return result % 3;
        })
        .then((id) => {
            writeLog(id);
            return api.get(`https://animals.tech/${id}`, {});
        })
        .then(({ result }) => {
            handleSuccess(result);
        })
        .catch(console.error);
};

export default processSequence;
