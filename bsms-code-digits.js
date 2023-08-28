(function ($) {
    $.fn.bsmsCodeDigits = function (options={}) {
        
        const defaultStyles = `
.bsms-twofa-digit{
    width:40px;
    height: 40px;
    text-align: center;
    font-size: 18px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin: 0 5px;
    transition: border-color 0.3s;
}

.bsms-twofa-digit:focus {
    border: 0;
    box-shadow: inset 0 0 0 .125rem #1040c1,0 0 0 .375rem rgba(16,114,235,.16);
}`;    
                
        const defaultSettings = {
            userStyles: defaultStyles,
            nrOfBoxes: 6,
            allowedChars: '0123456789',
            inputName: 'bsms-twofa-code',
            className: 'bsms-twofa-digit',
			/*translate: { 'I':'1', 'O':'0', 'l':'1' }, */        
            translate: { '\\w':c=>c.toUpperCase() },
            lastDigitEntered: null
        };    
                
        const settings = $.extend( defaultSettings, options );

        $(`<style type="text/css">${settings.userStyles}</style>`)
            .prependTo('head');    
            
        return this.each(function () {    
            
            const $container = $(this);
            const $hiddenInput = $(`<input type="hidden" name="${settings.inputName}">`)
                .appendTo($container);
    
            // Erstellen der Textboxen
            for (var i = 0; i < settings.nrOfBoxes; i++) {
                $container.append(`<input type="text" class="${settings.className} ${settings.className}-${i}">`);
            }

            const $digitBoxes = $container.find('.bsms-twofa-digit');

            $digitBoxes.on('input', function () {
                var enteredValue = $(this).val();
                if ('object'==typeof settings.translate) {    //object-context
                    for (key in settings.translate) { 
						console.log(enteredValue +'---'+ key +'---'+ settings.translate[key]);
						enteredValue = enteredValue.replaceAll(new RegExp(key,'g'),settings.translate[key]); 
						console.log('.....'+enteredValue);
					};
                }
                else {
					console.log('typeof settings.translate should be object');
				}
				
                const digits = enteredValue
                    .split('')
                    .filter(char => settings.allowedChars.includes(char));
                
                var sanitizedValue = digits?.shift();
                $(this).val(sanitizedValue);
                if (sanitizedValue) {                
                    // move focus and digits to next box
                    const currentBox = $digitBoxes.index(this);
                    const $nextBox   = $digitBoxes.eq(currentBox + 1)
                        .focus()
                        .val(digits.join(''))
                        .trigger('input');
                    if (!$nextBox.length && settings.lastDigitEntered) settings.lastDigitEntered();
                }
                
                var fullCode = '';
                for (var i = 0; i < settings.nrOfBoxes; i++) {
                    fullCode += $($digitBoxes[i]).val();
                }
                $hiddenInput.val(fullCode);
            });

            $digitBoxes.on('keyup', function (e) {
                if (e.keyCode === 8 && this.value === '') {
                    const currentBox = $digitBoxes.index(this);
                    if (currentBox > 0) {
                        const $prevBox = $digitBoxes.eq(currentBox - 1)
                            .focus();
                    }
                }
            });

            $digitBoxes.on('focus', function () {
                $(this).select(); // Inhalt selektieren, wenn Box den Fokus bekommt
                const currentBox = $digitBoxes.index(this);
                if (currentBox == 0) return;
                const $prevBox = $digitBoxes.eq(currentBox - 1);
                if ($prevBox.val() && settings.allowedChars.includes($prevBox.val())) return;
                $prevBox.focus();
                
            });
        });
    };
})(jQuery);
