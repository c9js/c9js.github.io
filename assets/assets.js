/*────────────────────────────────────────────────────────────────────────────────────────────────*/

class Assets {
/*┌─────────────┐
  │ Конструктор │
  └─────────────┘*/
    constructor(...scripts) {
        scripts.forEach((file) => {
            let version = '0.0.0';
            if (window.location.hostname == 'localhost') {
                version = new Date().getTime();
            }
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = [file, version].join('?');
            document.getElementsByTagName('body')[0].appendChild(script);
        });
    }
}

/*────────────────────────────────────────────────────────────────────────────────────────────────*/