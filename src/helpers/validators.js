/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
    compose,
    converge,
    __,
    gte,
    max,
    allPass,
    equals,
    not,
    values,
    props,
    prop,
    filter,
    reduce,
    reject,
    length,
    all,
    countBy,
    identity,
} from 'ramda';
import { SHAPES, COLORS } from '../constants';

// Проверка цветов
const isWhite = equals(COLORS.WHITE);
const isBlue = equals(COLORS.BLUE);
const isGreen = equals(COLORS.GREEN);
const isRed = equals(COLORS.RED);
const isOrange = equals(COLORS.ORANGE);

// Получить цвета конкретной фигуры
const getStar = prop(SHAPES.STAR);
const getSquare = prop(SHAPES.SQUARE);
const getTriangle = prop(SHAPES.TRIANGLE);
const getCircle = prop(SHAPES.CIRCLE);

// Получить цвета всех фигур
const getShapeColors = props(values(SHAPES));

// Подсчёт количества фигур заданого цвета
const countShapesByColor = (colorFn) =>
    compose(length, filter(colorFn), getShapeColors);

// Максимальное значение в массиве тлт объекте
const maxValue = compose(reduce(max, 0), values);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
    compose(isWhite, getTriangle),
    compose(isWhite, getCircle),
    compose(isRed, getStar),
    compose(isGreen, getSquare),
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(gte(__, 2), countShapesByColor(isGreen));

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = converge(equals, [
    countShapesByColor(isRed),
    countShapesByColor(isBlue),
]);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
    compose(isBlue, getCircle),
    compose(isRed, getStar),
    compose(isOrange, getSquare),
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(
    gte(__, 3),
    maxValue,
    countBy(identity),
    reject(isWhite),
    getShapeColors,
);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
    compose(equals(2), countShapesByColor(isGreen)),
    compose(equals(1), countShapesByColor(isRed)),
    compose(isGreen, getTriangle),
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = compose(all(isOrange), getShapeColors);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([
    compose(not, isRed, getStar),
    compose(not, isWhite, getStar),
]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = compose(all(isGreen), getShapeColors);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
    converge(equals, [getTriangle, getSquare]),
    compose(not, isWhite, getSquare),
]);
