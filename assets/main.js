/*────────────────────────────────────────────────────────────────────────────────────────────────*/

window.addEventListener('load', () => {
// Создаем редактор
    Main.editor = new Editor('editor', Main.onready, Main.onchange, [
        'LKOH    0',
        'SBER   10',
        'NVTK    3',
        'PHOR    0',
        'MGNT    1',
        'MOEX   10',
        'IRAO 1000',
        'GCHE    0',
        'HEAD    0',
        'MDMG    0',
        'HNFG    0',
        'DELI    0',
        'RUBB 3500'
    ].join('\n'));
});

/*────────────────────────────────────────────────────────────────────────────────────────────────*/

class Main {
/*┌─────────────────────┐
  │ Устанавливает фокус │
  └─────────────────────┘*/
    static focus() {
    // Устанавливаем фокус
        Main.editor.focus();
        
    // Выполняем обработчик изменений
        Main.editor.onchange();
    }
    
/*┌──────────────────────┐
  │ Скрывает уведомление │
  └──────────────────────┘*/
    static close() {
    // Скрываем уведомление
        document.getElementById('notification').className = 'hidden';
        document.getElementById('copy').className = '';
    }
    
/*┌───────────────────────────────────────────┐
  │ Копирует текущий URL-адрес в буфер обмена │
  └───────────────────────────────────────────┘*/
    static async copy() {
    // Успех
        try {
        // Копируем текущий URL-адрес в буфер обмена
            await navigator.clipboard.writeText(window.location);
            
        // Показываем уведомление
            document.getElementById('notification').className = '';
            document.getElementById('copy').className = 'hidden';
        }
        
    // Ошибка
        catch (err) {
            console.error(err.name, err.message);
        }
    }
    
/*┌─────────────────────────────────────────────────────────┐
  │ Обновляет текущий URL-адрес (без перезагрузки страницы) │
  └─────────────────────────────────────────────────────────┘*/
    static updateURL(tickers = [], counts = []) {
        window.history.replaceState({}, '', ['?', Main.shorts.hash(
            tickers, // Тикер
            counts   // Количество
        )].join(''));
    }
    
/*┌─────────────────────────┐
  │ Редактор готов к работе │
  └─────────────────────────┘*/
    static onready() {
    // Создаем новую таблицу
        new Table(Main.editor.value)
        
    // Подготавливаем редактор
        .edit(function(colTickers, colCounts) {
        // Кешируем стоимости тикеров
            MOEX.addTickers(this.col(colTickers));
            
        // Создаем список сокращенных тикеров
            Main.shorts = new Shorts(this.col(colTickers));
            
        // Получаем hash-строку со списком сокращенных элементов
            let hash = window.location.search;
            
        // Обновляем редактор
            if (hash != '') {
                Main.editor.value = new Table(Main.shorts.table(hash)).value;
            }
            
        // Обновляем текущий URL-адрес (без перезагрузки страницы)
            else {
                Main.updateURL(this.col(colTickers), this.col(colCounts));
            }
            
        // Показываем страницу
            document.body.className = '';
        },
        
    // Будут переданы номера столбцов от начала до второго (то есть столбцы с 1 по 2)
        ~2)
    }
    
/*┌───────────────────┐
  │ Обновляет таблицу │
  └───────────────────┘*/
    static onchange() {
    // Создаем новую таблицу
        new Table(
        // Устанавливаем пределы таблицы (диапазон принимаемых столбцов)
            ~2, // От начала до второго столбца (то есть первый и второй столбцы)
            
        // Устанавливаем начальный контент
            Main.editor.value,
            
        // Устанавливаем флаг сохранять пустые ряды
            true
        )
        
    // Проверяем текущее количество необработанных тикеров
        .edit(function(colTickers, colCounts) {
        // Обновляем текущий URL-адрес (без перезагрузки страницы)
            Main.updateURL(this.col(colTickers), this.col(colCounts));
            
        // Добавляем список тикеров в очередь на получение стоимости
            MOEX.addTickers(this.col(colTickers));
            
        // Проверяем текущее количество необработанных тикеров
            if (MOEX.loadCount > 0) {
            // Сохраняем текущую позицию курсора
                let last = Main.editor.cursor;
                
            // Создаем обработчик для полной загрузки стоимости тикеров
                MOEX.onload = () => {
                // Получаем новую позицию курсора
                    let now = Main.editor.cursor;
                    
                // Позиция курсора не изменилась
                    if ([now.row, now.column].join() == [last.row, last.column].join()) {
                        Main.editor.onchange();
                    }
                };
                
            // Прерываем дальнейшее внесение изменений в таблицу
                this.break;
            }
        },
        
    // Будут переданы номера столбцов от начала до второго (то есть столбцы с 1 по 2)
        ~2)
        
    // Создаем ребалансировку портфеля
        .edit(function(colTickers, colCounts, colCosts, colPercents, colOffers) {
        // Создаем ребалансировку портфеля
            let {
                costs, // Список с текущей стоимостью
                offers // Список с дополнительным количеством
            } = MOEX.rebalance(this.col(colTickers), this.col(colCounts));
            
        // Добавляем столбец с текущей стоимостью
            this.save(colCosts, costs);
            
        // Добавляем столбец с процентами
            this.percents(colCosts, colPercents);
            
        // Добавляем столбец с дополнительным количеством
            if (offers.filter(offer => offer !== '').length > 0) {
                this.save(colOffers, offers);
            }
            
        // Проверяем изменения редактор
            if (this.value == Main.editor.value) {
                return;
            }
            
        // Обновляем редактор
            Main.editor.value = this.value;
        },
        
    // Будут переданы номера столбцов от начала до пятого (то есть столбцы с 1 по 5)
        ~5);
    }
}

/*────────────────────────────────────────────────────────────────────────────────────────────────*/