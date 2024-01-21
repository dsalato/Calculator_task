import {print} from './utils/print.js'

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

    if (array[0] === '-') {
        array[1] = array[0].concat(array[1])
        array = array.splice(1)
    } else if (/^[+x/]$/.test(array[0]))
        array = array.splice(1)

    while (array.length >= 2) {
        for (const operator of operators) {
            if (array.includes(operator)) {
                const index = array.indexOf(operator) - 1;
                const resultOperator = Number(operate(Number(array[index]), operator, Number(array[index + 2])));
                if (isNaN(resultOperator)) {
                    array = [NaN];
                    return array;
                } else
                    array.splice(index, 3, String(resultOperator));
                break;
            }
        }
    }
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
                if (result !== 0) [mathExample, result] = [[], 0];
                string += state;
                break;
            case '+':
            case '-':
            case 'x':
            case '/':
                if (string !== '') {
                    mathExample.push(string, state);
                } else if (/^[+\-x/]$/.test(mathExample[mathExample.length - 1]) && mathExample.length >= 2) {
                    mathExample[mathExample.length - 1] = state;
                } else if ((mathExample.length === 0 && !/^[+x/]$/.test(state)) || result !== 0) {
                    mathExample.push(state);
                }
                result = 0;
                string = '';
                break;
            case 'АС':
                string = '';
                mathExample.length = 0;
                result = 0;
                break;
            case 'С':
                if (string !== '') {
                    string = ''
                } else {
                    mathExample.length = mathExample.length - 1;
                    string = ''
                }
                break;
            case '=':
                if (string !== '') {
                    mathExample.push(string);
                    string = '';
                }

                if (/^[+\-x/]$/.test(mathExample[mathExample.length - 1]) || /^[+\-x/]$/.test(mathExample[mathExample.length - 2])) {
                    mathExample[0] = String(getResult(mathExample))
                    firstResult = result = getResult(mathExample);
                } else if (result !== 0) {
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