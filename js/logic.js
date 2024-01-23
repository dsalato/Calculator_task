import {print} from './utils/print.js'

// функция счета результата
const getResult = (array) => {
    const operators = ['x', '/', '+', '-'];

    const operate = (a, operator, b) => {
        switch (operator) {
            case 'x':
                return a * b;
            case '/':
                if (b === 0) return NaN;
                return a / b;
            case '+':
                return a + b;
            case '-':
                return a - b;
            default:
                return NaN;
        }
    };
    // если первый символ примера это минус, то он объединяется с числом после
    if (array[0] === '-') {
        array[1] = array[0].concat(array[1])
        array = array.splice(1)
    }
    // пока в массиве более 3 элементов, происходит подсчет результата
    while (array.length >= 3) {
        for (const operator of operators) {
            if (array.includes(operator)) {
                const index = array.indexOf(operator) - 1;
                const resultOperator = Number(operate(Number(array[index]), operator, Number(array[index + 2])));
                // проверка деления на 0
                if (isNaN(resultOperator)) {
                    array = [NaN];
                    return array;
                } else
                    array.splice(index, 3, String(resultOperator));
                break;
            }
        }
    }
    // Избавление от погрешности вычисления и возвращение результата
    return Number(array[0]) % 1 !== 0 ? Number(array[0]).toFixed(2) : Number(array[0]);
}

const main = () => {
    let firstResult, result = 0;
    let mathExample = [];
    let string = '';

    return (state) => {
        switch (state) {
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '.':
                // Проверка, если при вводе новой цифры есть ответ, то обнуляю пример и прошлый ответ,
                // и в строку добавляю новую цифру.
                if (result !== 0) [mathExample, result] = [[], 0];
                string += state;
                break;
            case '+':
            case '-':
            case 'x':
            case '/':
                // если в новой части примера имеется число, то при нажатии на оператор в пример заносится это число и оператор
                if (string !== '') {
                    mathExample.push(string, state);
                }
                // если последний символ в примере это оператор, то при нажатии на новый оператор, он меняется
                else if (/^[+\-x/]$/.test(mathExample[mathExample.length - 1]) && mathExample.length >= 2) {
                    mathExample[mathExample.length - 1] = state;
                }
                // сначала проверяется условие, что в начале строки из операторов может добавляться только минус
                // или же добавляется любой оператор, если есть ответ, чтобы продолжить вычисление над результатом
                else if ((mathExample.length === 0 && !/^[+x/]$/.test(state)) || result !== 0) {
                    mathExample.push(state);
                }
                result = 0;
                string = '';
                break;
            case 'АС':
                // обнуление всего примера
                string = '';
                mathExample.length = 0;
                result = 0;
                break;
            case 'С':
                // удаление последнего числа или оператора
                if (string !== '') {
                    string = ''
                } else {
                    mathExample.length = mathExample.length - 1;
                    string = ''
                }
                break;
            case '=':
                // Проверка, ввели ли число после последнего оператора
                if (string !== '') {
                    mathExample.push(string);
                    string = '';
                }
                // проверка, что в массиве минимум 3 элемента(1 + 1)
                if (mathExample.length >= 3) {
                    mathExample[0] = String(getResult(mathExample))
                    firstResult = result = getResult(mathExample);
                }
                // при повторном нажатии на равно, повторно складывается результат примера
                else if (result !== 0) {
                    result += firstResult;
                    mathExample[0] = String(result);
                    if (isNaN(result)) mathExample.length = 0;
                }
                break;
        }

        if (isNaN(result))
            print('Ошибка');
        else if (mathExample.join('').concat(string) === '')
            print(0);
        else
            print(mathExample.join('').concat(string));
    }
}

export default main