/*────────────────────────────────────────────────────────────────────────────────────────────────*/

Object.defineProperties(global,{__:{set:v=>process.exit(_=v)},_:{set:console.log}});

/*────────────────────────────────────────────────────────────────────────────────────────────────*/

class Shorts {
// Список символов для сокращения
    static alphabet = new Map([...new Set(
        'abcdefghijklmnopqrstuvwxyz'
    )].map((v, k) => [k, v]));
    
/*┌──────────────────────────────────────┐
  │ Создает список сокращенных элементов │
  └──────────────────────────────────────┘*/
    constructor(...originals) {
    // Создаем список оригинальных элементов
        this.originals = new Map();
        
    // Создаем список сокращенных элементов
        this.shorts = new Map();
        
    // Проходим по списку оригинальных элементов
        [...new Set(originals.flat(Infinity))].forEach((original, short) => {
        // Получаем сокращенный элемент
            short = this.constructor.alphabet.get(short);
            
        // Добавляем оригинальный элемент в список оригинальных элементов
            this.originals.set(
                short,   // Сокращенный элемент
                original // Оригинальный элемент
            );
            
        // Добавляем сокращенный элемент в список сокращенных элементов
            this.shorts.set(
                original, // Оригинальный элемент
                short     // Сокращенный элемент
            );
        });
    }
    
/*┌──────────────────────────────────────┐
  │ Преобразовывает массив в hash-строку │
  └──────────────────────────────────────┘*/
    hash(
        originals = [], // Список оригинальных элементов
        values = [],    // Список значений элемента
        radix = 36      // Система счисления (по умолчанию 36-ричная)
    ) {
    // Создаем hash-строку со списком сокращенных элементов
        let hash = [];
        
    // Проходим по списку оригинальных элементов
        originals.forEach((original, i) => {
        // Получаем сокращенный элемент
            let short = this.shorts.get(original) || original.toLowerCase();
            
        // Получаем значение элемента
            let value = values[i];
            
        // Проверяем систему счисления
            if (typeof radix == 'number') {
            // Удаляем дробную часть
                value = Math.trunc(value);
                
            // Переводим в другую систему счисления
                value = value.toString(radix);
                
            // Переводим в верхний регистр
                value = value.toUpperCase();
            }
            
        // Добавляем сокращенный элемент
            hash.push(short);
            
        // Добавляем значение элемента
            hash.push(value);
        });
        
    // Возвращаем список сокращенных элементов в виде hash-строки
        return hash.join('');
    }
    
/*┌───────────────────────────────────────┐
  │ Преобразовывает hash-строку в таблицу │
  └───────────────────────────────────────┘*/
    table(
        hash = '', // Hash-строка со списком сокращенных элементов
        radix = 36 // Система счисления (по умолчанию 36-ричная)
    ) {
    // Создаем таблицу со списоком оригинальных элементов
        let table = [];
        
    // Получаем список сокращенных элементов
        let shorts = [...hash.matchAll(/[a-z]+/g)].map(s => s[0]);
        
    // Получаем список значений элемента
        let values = [...hash.matchAll(/[A-Z0-9]+/g)].map(s => s[0]);
        
    // Проходим по списку сокращенных элементов
        shorts.forEach((short, i) => {
        // Получаем оригинальный элемент
            let original = this.originals.get(short) || short.toUpperCase();
            
        // Получаем значение элемента
            let value = values[i];
            
        // Проверяем систему счисления
            if (typeof radix == 'number') {
            // Переводим в нижний регистр
                value = value.toLowerCase();
                
            // Переводим из другой систему счисления
                value = parseInt(value, radix);
            }
            
        // Добавляем оригинальный элемент
            table.push([original, value].join(' '));
        });
        
    // Возвращаем список оригинальных элементов в виде таблицы
        return table.join('\n');
    }
}

/*────────────────────────────────────────────────────────────────────────────────────────────────*/

// Создаем список тикеров
    let tickers = [
        'LKOH',
        'SBER',
        'RUBB'
    ];
    
// Создаем список сокращенных тикеров
    let shorts = new Shorts(tickers);
    
// Создаем список с количеством тикеров
    let count = [
        '3',
        '150',
        '900'
    ];
    
// Преобразовываем список тикеров в hash-строку
    console.log(shorts.hash(tickers, count));
    // a3b46cP0
    
// Преобразовывает hash-строку в таблицу
    console.log(shorts.table('a3b46cP0'));
    // LKOH 3
    // SBER 150
    // RUBB 900
    
// Преобразовываем список тикеров в hash-строку
    console.log(shorts.hash(['SBER', 'TICKERNOTFOUND'], [1234, 5678]));
    // bYAtickernotfound4DQ
    
// Преобразовывает hash-строку в таблицу
    console.log(shorts.table('bYAtickernotfound4DQ'));
    // SBER 1234
    // TICKERNOTFOUND 5678
    
/*────────────────────────────────────────────────────────────────────────────────────────────────*/