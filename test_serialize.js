// Есть множество (массив, где порядок не важен) целых чисел в диапазоне от 1 до 300.
// Количество чисел - до 1000. Напишите функцию сериализации / десериализации в строку, чтобы итоговая строка была компактной.
// Цель задачи - максимально сжать данные относительно простой сериализации без алгоритма сжатия (хотя бы 50% в среднем).
// Сериализованная строка должна содержать только ASCII символы. Можно использовать любой язык программирования.
// Вместе с решением нужно прислать набор тестов  - исходная строка, сжатая строка, коэффициент сжатия.
// Примеры тестов: простейшие короткие, случайные - 50 чисел, 100 чисел, 500 чисел, 1000 чисел, граничные - все числа 1 знака, все числа из 2х знаков, все числа из 3х знаков, каждого числа по 3 - всего чисел 900.

// Вариант 1 (простой)
const serialize = (arr) => {
    return arr.map((num) => num.toString(32).padStart(2, '0')).join('');
};

const deserialize = (str) => {
    let result = [];
    const chunkSize = 2;
    for (let i = 0; i < str.length; i += chunkSize) {
        result.push(parseInt(str.slice(i, i + chunkSize), 32));
    }
    return result;
};

// Вариант 2 (выше коэффициент сжатия)
const serialize2 = (arr) => {
    let result = '';
    // 9 - минимальный размер памяти для записи числа 300 в двоичной системе.
    let binaryString = arr.map((num) => num.toString(2).padStart(9, '0')).join('');
    // 6 - размер символа в системе ASCII за вычетом одного бита, 1 бит используется для смещения к записываемому диапазону символов.
    while (binaryString.length % 6 !== 0) {
        binaryString += '0';
    }

    const onWritableCharOffset = 32;
    for (let i = 0; i < binaryString.length; i += 6) {
        const charCode = parseInt(binaryString.slice(i, i + 6), 2) + onWritableCharOffset;
        result += String.fromCharCode(charCode);
    }
    return result;
};

const deserialize2 = (str) => {
    const result = [];
    const onWritableCharOffset = 32;
    let binaryString = '';
    for (let char of str) {
        const binaryCharCode = (char.charCodeAt(0) - onWritableCharOffset)
            .toString(2)
            .padStart(6, '0');
        binaryString += binaryCharCode;
    }
    for (let i = 0; i < binaryString.length; i += 9) {
        const chunk = binaryString.slice(i, i + 9);
        if (chunk.length < 9) break;
        result.push(parseInt(chunk, 2));
    }
    return result;
};

const getRandomArr = (arrLength, minNum, maxNum) => {
    const arr = [];
    for (let i = 0; i < arrLength; i++) {
        arr.push(Math.floor(minNum + Math.random() * (maxNum + 1 - minNum)));
    }
    return arr;
};

const getCustomArr = () => {
    const arr = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 1; j <= 300; j++) {
            arr.push(j);
        }
    }
    return arr;
};

const test = (serializeFunc, deserializeFunc, initArr) => {
    const serializeResult = serializeFunc(initArr);
    const deserializeResult = deserializeFunc(serializeResult);
    const compressionRatio = initArr.toString().length / serializeResult.length; // Коэффициент сжатия определяется как отношение объёма исходных несжатых данных к объёму сжатых данных.
    if (initArr.toString() != deserializeResult.toString()) {
        console.log(
            'Тест не пройден, исходный массив не соответствует результатам десериализации'
        );
        return;
    } else {
        console.log('Тест пройден');
    }

    console.log('Исходный массив:', initArr);
    console.log('Сжатая строка:', serializeResult);
    console.log('Коэффициент сжатия:', compressionRatio);
    console.log('Результат десериализации:', deserializeResult);
};

test(serialize2, deserialize2, getRandomArr(50, 1, 9));
test(serialize2, deserialize2, getRandomArr(100, 1, 9));
test(serialize2, deserialize2, getRandomArr(500, 1, 9));
test(serialize2, deserialize2, getRandomArr(1000, 1, 9));

test(serialize2, deserialize2, getRandomArr(50, 10, 99));
test(serialize2, deserialize2, getRandomArr(100, 10, 99));
test(serialize2, deserialize2, getRandomArr(500, 10, 99));
test(serialize2, deserialize2, getRandomArr(1000, 10, 99));

test(serialize2, deserialize2, getRandomArr(50, 100, 300));
test(serialize2, deserialize2, getRandomArr(100, 100, 300));
test(serialize2, deserialize2, getRandomArr(500, 100, 300));
test(serialize2, deserialize2, getRandomArr(1000, 100, 300));

test(serialize2, deserialize2, getCustomArr());
