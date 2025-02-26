/*▄───────────────────────────────▄
  █                               █
  █  Выводит сообщение в консоль  █
  █                               █
  ▀───────────────────────────────▀*/
    Object.defineProperties(window,{__:{set:alert},_:{set(v) {
        let e = document.getElementById('console');
        e.innerHTML = [JSON.stringify(v), '<hr>', e.innerHTML].join('');
    }}});
    
/*▄──────────────────────▄
  █                      █
  █  Переопределяем "$"  █
  █                      █
  ▀──────────────────────▀*/
    Object.defineProperty(window, '$', {value: Object.create(null)});
    
/*────────────────────────────────────────────────────────────────────────────────────────────────*/

class Assets {
/*┌─────────────┐
  │ Конструктор │
  └─────────────┘*/
    constructor(...scripts) {
    // Создаем список загрузки
        let onloads = [];
        
    // Проходим по списку скриптов
        scripts.forEach((file) => {
        // Добавляем в список загрузки
            if (typeof file == 'function') {
                onloads.push(file);
            }
            
        // Загружем js-скрипт
            if (typeof file == 'string') {
                let version = '0.0.0';
                if (window.location.hostname == 'localhost') {
                    version = new Date().getTime();
                }
                let script = document.createElement('script');
                script.async = false;
                script.defer = true;
                script.src = [file, version].join('?');
                document.getElementsByTagName('head')[0].appendChild(script);
            }
        });
        
    // Добавляем список загрузки в onload
        window.addEventListener('load', e => onloads.forEach(f => f()));
    }
}

/*────────────────────────────────────────────────────────────────────────────────────────────────*/