/*────────────────────────────────────────────────────────────────────────────────────────────────*/

Object.defineProperties(global,{__:{set:v=>process.exit(_=v)},_:{set:console.log}});

/*────────────────────────────────────────────────────────────────────────────────────────────────*/

class Columns {
/*┌─────────────────────────────────────────────────────────┐
  │ Проверяет текущее число в рамках его максимальной длины │
  └─────────────────────────────────────────────────────────┘*/
    static max(now = 0, max = 0) {
        return now > max ? max : now;
    }
    
/*┌──────────────────────────────────┐
  │ Получает текущую позицию столбца │
  └──────────────────────────────────┘*/
    static current(
        lines = [],  // Список строк
        row = 0,     // Текущий ряд
        position = 0 // Позиция курсора в строке
    ) {
    // Проверяем текущий ряд
        row = this.max(row, lines.length - 1);
        
    // Получаем текущую строку
        let line = lines[row] || '';
        
    // Добавляем два пробела в начало строки
        line = ['  ', line].join('');
        
    // Удаляем все пробелы в конце строки
        line = line.replace(/\s+$/, '');
        
    // Получаем список слов от начало строки
        let words = line.split(/\s+/);
        
    // Список слов пуст
        if (words.length == 1) return {
            row:0, position:0, start:0, end:0, current:0, next:0
        };
        
    // Получаем список разделителей
        let seps = [...line.matchAll(/\s+/g)].map(s => s.index + s[0].length);
        
    // Проверяем текущую позицию курсора в строке
        position = this.max(position, line.length - 2);
        
    // Получаем список слов от текущей позиции курсора в строке
        let word = line.substring(position + 1).split(/\s+/);
        
    // Создаем порядковый номер текущего столбца
        let current = words.length - word.length - 1;
        
    // Строка от позиции курсора начинается с разделителя
        if (word[0] == '') {
            current++;
        }
        
    // Создаем позицию курсора в столбце
        position = words[current + 1].length - word[0].length + 1;
        
    // Строка от позиции курсора начинается с разделителя
        if (word[0] == '') {
            position = 0;
        }
        
    // Создаем начальную позицию выделения
        let start = seps[current] - 2;
        
    // Создаем конечную позицию выделения
        let end = seps[current] + words[current + 1].length - 2;
        
    // Создаем порядковый номер следующего столбца
        let next = seps[current + 1] ? current + 1 : 0;
        
    // Возвращаем текущую позицию столбца
        return {
            row: row,           // Текущий ряд
            position: position, // Позиция курсора в столбце
            start: start,       // Начальная позиция выделения
            end: end,           // Конечная позиция выделения
            current: current,   // Порядковый номер текущего столбца
            next: next          // Порядковый номер следующего столбца
        };
    }
    
/*┌──────────────────────────────────┐
  │ Получает текущую позицию курсора │
  └──────────────────────────────────┘*/
    static cursor(
        lines = [],  // Список строк
        row = 0,     // Текущий ряд
        current = 0, // Порядковый номер текущего столбца
        position = 0 // Позиция курсора в столбце
    ) {
    // Проверяем текущий ряд
        row = this.max(row, lines.length - 1);
        
    // Получаем текущую строку
        let line = lines[row] || '';
        
    // Добавляем два пробела в начало строки
        line = ['  ', line].join('');
        
    // Удаляем все пробелы в конце строки
        line = line.replace(/\s+$/, '');
        
    // Получаем список слов от начало строки
        let words = line.split(/\s+/);
        
    // Список слов пуст
        if (words.length == 1) return {row:0, column:0};
        
    // Получаем список разделителей
        let seps = [...line.matchAll(/\s+/g)].map(s => s.index + s[0].length);
        
    // Проверяем порядковый номер текущего столбца
        current = this.max(current, seps.length - 1);
        
    // Проверяем позицию курсора в текущем столбце
        position = this.max(position, words[current + 1].length);
        
    // Получаем позицию курсора в строке
        position = seps[current] + position - 2;
        
    // Возвращаем текущую позицию курсора
        return {
            row: row,        // Текущий ряд
            column: position // Позиция курсора в строке
        };
    }
    
/*┌──────────────────────────────────────────┐
  │ Получает позицию предыдущего столбца (←) │
  └──────────────────────────────────────────┘*/
    static prevCol(
        lines = [], // Список строк
        row = 0,    // Текущий ряд
        current = 0 // Порядковый номер текущего столбца
    ) {
    // Переходим к предыдущему столбцу
        current--;
        
    // Переходим на предыдущий ряд
        if (current < 0) {
            current = Infinity;
            row--;
        }
        
    // Переходим в конец
        if (row < 0) {
            row = lines.length - 1;
        }
        
    // Возвращаем позицию предыдущего столбца (←)
        return Columns.cursor(lines, row, current);
    }
    
/*┌─────────────────────────────────────────┐
  │ Получает позицию следующего столбца (→) │
  └─────────────────────────────────────────┘*/
    static nextCol(
        lines = [], // Список строк
        row = 0,    // Текущий ряд
        next = 0    // Порядковый номер следующего столбца
    ) {
    // Переходим на следующий ряд
        if (next == 0) {
            row++;
        }
        
    // Переходим в начало
        if (row >= lines.length) {
            row = 0;
        }
        
    // Возвращаем позицию следующего столбца (→)
        return Columns.cursor(lines, row, next);
    }
    
/*┌──────────────────────────────────────────────────┐
  │ Получает позицию столбца из предыдущего ряда (↑) │
  └──────────────────────────────────────────────────┘*/
    static prevRow(
        lines = [], // Список строк
        row = 0,    // Текущий ряд
        current = 0 // Порядковый номер текущего столбца
    ) {
    // Переходим на предыдущий ряд
        row--;
        
    // Переходим в конец
        if (row < 0) {
            row = lines.length - 1;
        }
        
    // Возвращаем позицию столбца из предыдущего ряда (↑)
        return Columns.cursor(lines, row, current);
    }
    
/*┌─────────────────────────────────────────────────┐
  │ Получает позицию столбца из следующего ряда (↓) │
  └─────────────────────────────────────────────────┘*/
    static nextRow(
        lines = [], // Список строк
        row = 0,    // Текущий ряд
        current = 0 // Порядковый номер текущего столбца
    ) {
    // Переходим на следующий ряд
        row++;
        
    // Переходим в начало
        if (row >= lines.length) {
            row = 0;
        }
        
    // Возвращаем позицию столбца из следующего ряда (↓)
        return Columns.cursor(lines, row, current);
    }
}

/*────────────────────────────────────────────────────────────────────────────────────────────────*/

(() => {
// If
    if (0) return;
    
// Создаем текущую позицию столбца
    let s = {row:0, current:0, next:1};
    
// Создаем список строк
    let lines = [
        'AA BB CC',
        'DD EE FF',
        'GG HH II'
    ];
    
// Получаем позицию столбца
    _=Columns.prevRow(lines, s.row, s.current); // Получаем позицию столбца из предыдущего ряда (↑)
    _=Columns.nextCol(lines, s.row, s.next);    // Получаем позицию следующего столбца (→)
    _=Columns.nextRow(lines, s.row, s.current); // Получаем позицию столбца из следующего ряда (↓)
    _=Columns.prevCol(lines, s.row, s.current); // Получаем позицию предыдущего столбца (←)
    __=''
})();

/*────────────────────────────────────────────────────────────────────────────────────────────────*/

(() => {
// If
    if (1) return;
//  0  CC {row:1, current:0, position:0}
//  1  CC {row:1, current:0, position:1}
//  2  CC {row:1, current:0, position:2}
//  3  DD {row:1, current:1, position:0}
//  4  DD {row:1, current:1, position:1}
//  5  DD {row:1, current:1, position:2}
//  6 EEE {row:1, current:2, position:0}
//  7 EEE {row:1, current:2, position:0}
//  8 EEE {row:1, current:2, position:1}
//  9 EEE {row:1, current:2, position:2}
// 10 EEE {row:1, current:2, position:3}
// 11 EEE {row:1, current:2, position:3}
// Создаем текущую позицию столбца
    let current = [
        {row:1, current:0, position:0},
        {row:1, current:0, position:1},
        {row:1, current:0, position:2},
        {row:1, current:1, position:0},
        {row:1, current:1, position:1},
        {row:1, current:1, position:2},
        {row:1, current:2, position:0},
        {row:1, current:2, position:0},
        {row:1, current:2, position:0},
        {row:1, current:2, position:1},
        {row:1, current:2, position:2},
        {row:1, current:2, position:3},
        {row:1, current:2, position:3}
    ];
    
// Создаем список строк
    let lines = [
        'AA BB     ',
        'CC DD   EEE'
    ];
    
// Получаем текущую позицию курсора
    current.forEach((current, i) => {
        _
        console.log(i, Columns.cursor(lines, current.row, current.current, current.position));
    });
    __=''
})();

/*────────────────────────────────────────────────────────────────────────────────────────────────*/

(() => {
// Создаем список строк
    let lines = [
        'AA BB     ',
        'CC DD  EEE'
    ];
    
// Создаем текущую позицию курсора
    let cursor = {row:4, column:10};
    
// Проверяем текущий ряд
    cursor.row = Columns.max(cursor.row, lines.length - 1);
    
// 123
    _='0123456789'
    _=lines[cursor.row]
    
// Проходим по списку строк
    Array(lines[cursor.row].length + 2).fill().map((v,i) => i).forEach((position) => {
        cursor.column = position;
        let s = Columns.current(lines, cursor.row, cursor.column);
        let word = lines[cursor.row].substring(s.start, s.end);
        console.log(cursor.column, word, s);
    });
})();

/*────────────────────────────────────────────────────────────────────────────────────────────────*/