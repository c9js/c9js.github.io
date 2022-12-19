/*────────────────────────────────────────────────────────────────────────────────────────────────*/
/*
// Выполнить комунду
    editor.execCommand('myCommand')
    
// Клонировать текущую строку
    editor.duplicateSelection()

// Удалить текущую строку
    editor.removeLines()
    
// Удалить один символ слево (эмитация Backspace)
    editor.remove('left')
    
// Удалить один символ справо (эмитация Delete)
    editor.remove('right')
    
// Получить количество строк
    editor.session.getLength()
    
// Получить позицию курсора
    editor.selection.getCursor()
    
// Получить позицию выделенного текста
    editor.getSelectionRange()
    
// Получить выделенный текст
    editor.session.getTextRange(editor.getSelectionRange())
    
// Проверить выделен-ли сейчас какой-то текст
    editor.selection.isEmpty()
    
// Проверить выделено-ли сейчас более одной строки
    editor.selection.isMultiLine()
    
// Выделить текст от 5 по 10 символ 3 строки
    editor.moveCursorTo(2, 5)
    editor.selection.setSelectionAnchor(2, 10)
    
// Получить позицию где заканчивается выделение
    editor.selection.getSelectionAnchor()
    
// Отменить выделение
    editor.selection.clearSelection()
    
// Проверить в каком порядке выделено слово, слево напрво или справо на лево
    editor.selection.isBackwards()
    
// Получить вторую строку
    editor.session.getLine(1)
    
// Получить список всех строк
// Вариант #1
    editor.session.getLines(0, editor.session.getLength())
// Вариант #2
    editor.session.getDocument().getAllLines()
// Вариант #3
    editor.session.doc.getAllLines()
    
    
// Переместить курсор вверх влево (первая строка и первый символ)
// Вариант #1
    editor.setValue(editor.getValue(), -1)
// Вариант #2
    editor.navigateLineStart()
    
    
// Переместить курсор вверх вправо (первая строка и последний символ)
    editor.gotoLine(0)
    editor.selection.selectLineEnd()
    editor.selection.clearSelection()
    
    
// Переместить курсор вниз вправо (последняя строка и последний символ)
// Вариант #1
    editor.setValue(editor.getValue(), 1)
// Вариант #2
    editor.navigateLineEnd()
    
    
// Переместить курсор вниз влево (последняя строка и первый символ)
    editor.gotoLine(editor.session.getLength(), 0)
    
// Переместить курсор в начало текущей строки
    editor.selection.selectLineStart()
    editor.selection.clearSelection()
    
// Переместить курсор в конец текущей строки
    editor.selection.selectLineEnd()
    editor.selection.clearSelection()
    
/*────────────────────────────────────────────────────────────────────────────────────────────────*/

class Editor {
/*┌─────────────────────┐
  │ Устанавливает фокус │
  └─────────────────────┘*/
    focus() {
        this.editor.focus();
    }
    
/*┌───────────────────────────────┐
  │ Получает содержимое редактора │
  └───────────────────────────────┘*/
    get value() {
        return this.editor.getValue();
    }
    
/*┌──────────────────────────┐
  │ Получает позицию курсора │
  └──────────────────────────┘*/
    get cursor() {
        return this.editor.selection.getCursor();
    }
    
/*┌───────────────────────┐
  │ Получает список строк │
  └───────────────────────┘*/
    get lines() {
        return this.editor.session.doc.getAllLines();
    }
    
/*┌────────────────────────┐
  │ Откладывает выполнение │
  └────────────────────────┘*/
    then(callback) {
        return () => Promise.resolve().then(callback);
    }
    
/*┌────────────────────────────┐
  │ Обновляет размер редактора │
  └────────────────────────────┘*/
    resize() {
    // Получаем ширину редактора
        let width = this.editor.session.getScreenWidth();
        
    // Предыдущая ширина не изменилась
        if (width == this.lastWidth) return;
        
    // Сохраняем текущую ширину
        this.lastWidth = width;
        
    // Список свойств
        // let charWidth = 9.9; // Размер одного символа (в пикселях)
        let charWidth = 13.2; // Размер одного символа (в пикселях)
        let minWidth = 6;    // Мин. символов (если редактор не пуст)
        let minEmpty = 17;   // Мин. символов (если редактор пуст)
        let padding = 8;     // Отступ справа (в пикселях)
        
    // Задаем минимальную ширину (если редактор пуст)
        if (width == 0) {
            width = minEmpty;
        }
        
    // Задаем минимальную ширину (если редактор не пуст)
        if (width < minWidth) {
            width = minWidth;
        }
        
    // Добавляем отступ
        width = [charWidth * width + padding, 'px'].join('');
        
    // Проверяем размер редактора
        if (this.style.width != width) {
        // Выводим на экран
            this.style.width = width;
            
        // Обновляем размер редактора
            this.editor.resize();
        }
    }
    
/*┌────────────────────────┐
  │ Создает новый редактор │
  └────────────────────────┘*/
    constructor(id, onready, onchange, welcome = '') {
    // Сохраняем ссылку на стиль
        this.style = document.getElementById(id).style;
        
    // Создаем новый редактор
        this.editor = ace.edit(id);
        
    // Режим подсветки кода (текстовый документ)
        this.editor.setOption('mode', 'ace/mode/text');
        
    // Тема редактора
        // this.editor.setOption('theme', 'ace/theme/github_dark');
        // this.editor.setOption('theme', 'ace/theme/ambiance');
        // this.editor.setOption('theme', 'ace/theme/cobalt');
        this.editor.setOption('theme', 'ace/theme/chaos');
        
    // Увеличивает размер окна редактора по мере добавления новых строк (вкл.)
        this.editor.setOption('autoScrollEditorIntoView', true);
        
    // Минимальное количество строк
        this.editor.setOption('minLines', 1);
        
    // Максимальное количество строк до появление скроллинга
        this.editor.setOption('maxLines', 30);
        
    // Отображение нумерации строк (выкл.)
        this.editor.setOption('showGutter', false);
        // this.editor.renderer.setOption('showGutter', false);
        
    // Выделить все одинаковые слова в тексте (выкл.)
        this.editor.setOption('highlightSelectedWord', false);
        
    // Показывать мобильное меню (выкл.)
        this.editor.setOption('enableMobileMenu', false);
        
    // Перетаскивание выделенного текста курсором мышки (выкл.)
        this.editor.setOption('dragEnabled', false);
        
    // Авто отступ (выкл.)
        this.editor.setOption('enableAutoIndent', false);
        
    // Отображать направляющих отступов (выкл.)
        this.editor.setOption('displayIndentGuides', false);
        
    // Отображать поле печати (выкл.)
        this.editor.setOption('showPrintMargin', false);
        
    // Стиль выделения текста (line = выделять сразу всю строку)
        this.editor.setOption('selectionStyle', 'line');
        
    // Режим новой строки (unix = "\n")
        this.editor.setOption('newLineMode', 'unix');
        
    // Перенос строки (выкл.)
    // Нет горизонтальной полосы прокрутки
    // Если строка не помещается на экран,
    // идет перенос на следующую строку,
    // при этом нумирация строк не меняйется
        this.editor.setOption('wrap', false);
        
    // Строка для использования в качестве заполнителя,
    // когда в редакторе нет контента
        this.editor.setOption('placeholder', 'Таблица не задана...');
        
    // Создаем обработчик изменений (обновляем размер редактора)
        this.editor.on('change', this.then(e => this.resize()));
        
    // Создаем приветствие
        if (welcome != '') {
        // Обновляем содержимое редактора
            this.editor.setValue(welcome, 1);
            
        // Устанавливаем фокус
            this.editor.focus();
            
        // Включаем режим перемещения по столбцам
            this.selectionMode = true;
            
        // Обновляем текущую позицию столбца
            this.updatePosition();
        }
        
    // Редактор готов к работе
        if (typeof onready == 'function') {
        // Выполняем колбэк
            this.editor.renderer.on('themeLoaded', this.then(() => onready()));
        }
        
    // Сохраняем обработчик изменений
        this.onchange = () => {
        // Проверяем колбэк
            if (typeof onchange == 'function') {
            // Обновляем текущую позицию столбца
                this.updatePosition();
                
            // Выполняем колбэк
                onchange();
            }
        }
        
    // Создаем пользовательские сочетания клавиш
        [
            'Backspace', // Удалить один символ слево
            'Delete',    // Удалить один символ справо
            'Enter',     // Добавить новый ряд
            'Space',     // Добавить один пробел
            'Tab',       // Выделить текущий столбец
            'Left',      // Переместить курсор влево
            'Right',     // Переместить курсор вправо
            'Up',        // Переместить курсор вверх
            'Down'       // Переместить курсор вниз
        ].forEach((cmd) => this.editor.commands.addCommand({
        // Имя команды
            name: ['on', cmd].join(''),
            
        // Сочетание клавиш
            bindKey: {win:cmd, mac:cmd},
            
        // Обработчик (колбэк)
            exec: (...args) => this['on' + cmd](...args)
        }));
    }
    
/*┌────────────────────────────────┐
  │ Обновляет содержимое редактора │
  └────────────────────────────────┘*/
    set value(value) {
    // Обновляем содержимое редактора
        this.editor.setValue(value, 1);
        
    // Устанавливаем фокус
        this.editor.focus();
        
    // Получаем позицию курсора
        let cursor = Columns.cursor(
            this.lines,           // Список строк
            this.current.row,     // Текущий ряд
            this.current.current, // Порядковый номер текущего столбца
            this.current.position // Позиция курсора в столбце
        );
        
    // Перемещаем курсор
        this.editor.moveCursorTo(
            cursor.row,   // Текущий ряд
            cursor.column // Позиция курсора в строке
        );
        
    // Обновляем текущую позицию столбца
        this.updatePosition();
    }
    
/*┌───────────────────────────────────┐
  │ Обновляет текущую позицию столбца │
  └───────────────────────────────────┘*/
    updatePosition() {
    // Получаем текущую позицию курсора
        let cursor = this.cursor;
        
    // Сохраняем текущую позицию столбца
        this.current = Columns.current(
            this.lines,   // Список строк
            cursor.row,   // Текущий ряд
            cursor.column // Позиция курсора в строке
        );
        
    // Режим перемещения по столбцам включен
        if (this.selectionMode) {
        // Выделяем текущий столбец
            this.selectionColumn(
                this.current.row,   // Текущий ряд
                this.current.start, // Начальная позиция выделения
                this.current.end    // Конечная позиция выделения
            );
        }
    }
    
/*┌────────────────────────────┐
  │ Выделяет указанный столбец │
  └────────────────────────────┘*/
    selectionColumn(
        row = 0,   // Текущий ряд
        start = 0, // Начальная позиция выделения
        end = 0    // Конечная позиция выделения
    ) {
    // Задаем начальную позицию выделения (левая часть столбца)
        this.editor.selection.setSelectionAnchor(
            row,  // Текущий ряд
            start // Позиция курсора в строке
        );
        
    // Задаем конечную позицию выделения (правая часть столбца)
        this.editor.moveCursorTo(
            row, // Текущий ряд
            end  // Позиция курсора в строке
        );
    }
    
/*┌──────────────────────────────────────┐
  │ Удаляет один символ слево или справо │
  └──────────────────────────────────────┘*/
    remove(editor, args, course = 'left') {
    // Режим перемещения по столбцам включен
        if (this.selectionMode && !editor.selection.isEmpty()) {
        // Получаем выделенный столбец
            let column = editor.session.getTextRange(editor.getSelectionRange());
            
        // Проверяем выделенный столбец
            if (column !=  MOEX.defaultTicker) return;
            
        // Выключаем режим перемещения по столбцам
            this.selectionMode = false;
            
        // Удалить текущую строку
            editor.removeLines();
            
        // Получаем позицию курсора
            let cursor = Columns.cursor(
                this.lines,                // Список строк
                this.currentEnter.row,     // Текущий ряд
                this.currentEnter.current, // Порядковый номер текущего столбца
                this.currentEnter.position // Позиция курсора в столбце
            );
            
        // Перемещаем курсор
            editor.moveCursorTo(
                cursor.row,   // Текущий ряд
                cursor.column // Позиция курсора в строке
            );
            
        // Выполняем обработчик изменений
            this.onchange();
        }
        
    // Режим перемещения по столбцам выключен
        else {
        // Удаляем один символ слево или справо
            editor.remove(course);
        }
    }
    
/*┌───────────────────────────┐
  │ Удаляем один символ слево │
  │ Клавиша: "Backspace"      │
  └───────────────────────────┘*/
    onBackspace(editor, args) {
        this.remove(editor, args, 'left');
    }
    
/*┌────────────────────────────┐
  │ Удаляем один символ справо │
  │ Клавиша: "Delete"          │
  └────────────────────────────┘*/
    onDelete(editor, args) {
        this.remove(editor, args, 'right');
    }
    
/*┌─────────────────────┐
  │ Добавляет новый ряд │
  │ Клавиша: "Enter"    │
  └─────────────────────┘*/
    onEnter(editor, args) {
    // Режим перемещения по столбцам выключен
        if (!this.selectionMode) {
        // Включаем режим перемещения по столбцам
            this.selectionMode = true;
            
        // Получаем текущую позицию курсора
            let cursor = this.cursor;
            
        // Сохраняем текущую позицию столбца
            this.currentEnter = Columns.current(
                this.lines,   // Список строк
                cursor.row,   // Текущий ряд
                cursor.column // Позиция курсора в строке
            );
            
        // Перемещаем курсор в конец строки
            editor.selection.selectLineEnd();
            editor.selection.clearSelection();
            
        // Добавляем ряд с тикером по умолчанию
            editor.insert(['\n', MOEX.defaultTicker, 0].join(' '));
            
        // Перемещаем курсор в начало строки
            editor.selection.selectLineStart();
            editor.selection.clearSelection();
        }
        
    // Выполняем обработчик изменений
        this.onchange();
    }
    
/*┌───────────────────────┐
  │ Добавляет один пробел │
  │ Клавиша: "Space"      │
  └───────────────────────┘*/
    onSpace(editor, args) {
    // Режим перемещения по столбцам выключен
        if (!this.selectionMode || editor.selection.isEmpty()) {
        // Добавляем один пробел
            editor.insert(' ');
        }
    }
    
/*┌──────────────────────────┐
  │ Выделяет текущий столбец │
  │ Клавиша: "Tab"           │
  └──────────────────────────┘*/
    onTab(editor, args) {
    // Режим перемещения по столбцам выключен
        if (editor.selection.isEmpty()) {
        // Включаем режим перемещения по столбцам
            this.selectionMode = true;
            
        // Выделяем текущий столбец
            this.selectionColumn(
                this.current.row,   // Текущий ряд
                this.current.start, // Начальная позиция выделения
                this.current.end    // Конечная позиция выделения
            );
        }
        
    // Режим перемещения по столбцам включен
        else {
        // Выключаем режим перемещения по столбцам
            this.selectionMode = false;
            
        // Выделяем текущий столбец
            this.selectionColumn(
                this.current.row, // Текущий ряд
                this.current.end, // Начальная позиция выделения
                this.current.end  // Конечная позиция выделения
            );
        }
    }
    
/*┌─────────────────────────────┐
  │ Перемещает курсор влево (←) │
  │ Клавиша: "Left"             │
  └─────────────────────────────┘*/
    onLeft(editor, args) {
    // Режим перемещения по столбцам включен
        if (this.selectionMode && !editor.selection.isEmpty()) {
        // Получаем позицию предыдущего столбца (←)
            let cursor = Columns.prevCol(
                this.lines,          // Список строк
                this.current.row,    // Текущий ряд
                this.current.current // Порядковый номер текущего столбца
            );
            
        // Перемещаем курсор к предыдущему столбцу (←)
            editor.moveCursorTo(
                cursor.row,   // Текущий ряд
                cursor.column // Позиция курсора в строке
            );
            
        // Выполняем обработчик изменений
            this.onchange();
        }
        
    // Режим перемещения по столбцам выключен
        else {
        // Перемещаем курсор на один символ влево
            editor.navigateLeft(args.times);
        }
    }
    
/*┌──────────────────────────────┐
  │ Перемещает курсор вправо (→) │
  │ Клавиша: "Right"             │
  └──────────────────────────────┘*/
    onRight(editor, args) {
    // Режим перемещения по столбцам включен
        if (this.selectionMode && !editor.selection.isEmpty()) {
        // Получаем позицию следующего столбца (→)
            let cursor = Columns.nextCol(
                this.lines,       // Список строк
                this.current.row, // Текущий ряд
                this.current.next // Порядковый номер следующего столбца
            );
            
        // Перемещаем курсор к следующему столбцу (→)
            editor.moveCursorTo(
                cursor.row,   // Текущий ряд
                cursor.column // Позиция курсора в строке
            );
            
        // Выполняем обработчик изменений
            this.onchange();
        }
        
    // Режим перемещения по столбцам выключен
        else {
        // Перемещаем курсор на один символ вправо
            editor.navigateRight(args.times);
        }
    }
    
/*┌─────────────────────────────┐
  │ Перемещает курсор вверх (↑) │
  │ Клавиша: "Up"               │
  └─────────────────────────────┘*/
    onUp(editor, args) {
    // Режим перемещения по столбцам включен
        if (this.selectionMode) {
        // Получаем позицию столбца из предыдущего ряда (↑)
            let cursor = Columns.prevRow(
                this.lines,          // Список строк
                this.current.row,    // Текущий ряд
                this.current.current // Порядковый номер текущего столбца
            );
            
        // Перемещаем курсор к столбцу из предыдущего ряда (↑)
            editor.moveCursorTo(
                cursor.row,   // Текущий ряд
                cursor.column // Позиция курсора в строке
            );
        }
        
    // Режим перемещения по столбцам выключен
        else {
        // Перемещаем курсор на одну строку вверх
            editor.navigateUp(args.times);
        }
        
    // Выполняем обработчик изменений
        this.onchange();
    }
    
/*┌────────────────────────────┐
  │ Перемещает курсор вниз (↓) │
  │ Клавиша: "Down"            │
  └────────────────────────────┘*/
    onDown(editor, args) {
    // Режим перемещения по столбцам включен
        if (this.selectionMode) {
        // Получаем позицию столбца из следующего ряда (↓)
            let cursor = Columns.nextRow(
                this.lines,          // Список строк
                this.current.row,    // Текущий ряд
                this.current.current // Порядковый номер текущего столбца
            );
            
        // Перемещаем курсор к столбцу из следующего ряда (↓)
            editor.moveCursorTo(
                cursor.row,   // Текущий ряд
                cursor.column // Позиция курсора в строке
            );
        }
        
    // Режим перемещения по столбцам выключен
        else {
        // Перемещаем курсор на одну строку вниз
            editor.navigateDown(args.times);
        }
        
    // Выполняем обработчик изменений
        this.onchange();
    }
}

/*────────────────────────────────────────────────────────────────────────────────────────────────*/