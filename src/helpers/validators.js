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
    equals,
    curry,
    prop,
    compose,
    allPass,
    reduce,
    lte,
    inc,
    values,
    tap,
    props,
} from 'ramda';
import { SHAPES, COLORS } from '../constants';

const checkColor = (color) => equals(color);
const isWhite = checkColor(COLORS.WHITE);
const isBlue = checkColor(COLORS.BLUE);
const isGreen = checkColor(COLORS.GREEN);
const isRed = checkColor(COLORS.RED);
const isOrange = checkColor(COLORS.ORANGE);

const getShape = (shapeName) => prop(shapeName);
const getStar = getShape(SHAPES.STAR);
const getSquare = getShape(SHAPES.SQUARE);
const getTriangle = getShape(SHAPES.TRIANGLE);
const getCircle = getShape(SHAPES.CIRCLE);

const pickShapes = props(values(SHAPES));

const countShapesByColor = (color) =>
    compose(
        reduce((acc, value) => (checkColor(color)(value) ? inc(acc) : acc), 0),
        pickShapes,
    );

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
    compose(isWhite, getTriangle),
    compose(isWhite, getCircle),
    compose(isRed, getStar),
    compose(isGreen, getSquare),
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(
    lte(2),
    countShapesByColor(COLORS.GREEN),
);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = () => false;

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = () => false;

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = () => false;

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = () => false;

// 7. Все фигуры оранжевые.
export const validateFieldN7 = () => false;

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = () => false;

// 9. Все фигуры зеленые.
export const validateFieldN9 = () => false;

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = () => false;
