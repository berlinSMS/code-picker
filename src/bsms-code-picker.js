/** 
 * A jquery-plugin to pick a code or some digits in a formular, usful for OTP, TAN..
 *  - You need to import jquery
 *
 * @copyright Copyright (c) 2023, Energieweise Ingenieur GmbH, berlinsms
 * @link      https://www.berlinsms.de/
 * 
 * Hiermit wird jeder Person, die eine Kopie dieser Software und der zugehoerigen
 * Dokumentationsdateien (die "Software") erwirbt, kostenlos die Erlaubnis erteilt, 
 * uneingeschraenkt mit der Software zu handeln, einschliesslich und ohne 
 * Einschraenkung der Rechte, Kopien der Software zu verwenden, zu kopieren, zu 
 * modifizieren, zusammenzufuehren, zu veroeffentlichen, zu vertreiben, zu 
 * unterlizenzieren und/oder zu verkaufen, und Personen, denen die Software zur 
 * Verfuegung gestellt wird, dies unter den folgenden Bedingungen zu gestatten:
 * 
 * Dieser Copyright-Hinweis und dieser Genehmigungshinweis muessen in allen Kopien 
 * oder wesentlichen Teilen der Software enthalten sein.
 * 
 * DIE SOFTWARE WIRD OHNE MAENGELGEWAEHR ZUR VERFUEGUNG GESTELLT, OHNE AUSDRUECKLICHE 
 * ODER STILLSCHWEIGENDE GEWAEHRLEISTUNG JEGLICHER ART, EINSCHLIESSLICH, ABER NICHT
 * BESCHRAENKT AUF DIE GEWAEHRLEISTUNG DER MARKTGAENGIGKEIT, DER EIGNUNG FUER EINEN 
 * BESTIMMTEN ZWECK UND DER NICHTVERLETZUNG VON RECHTEN. IN KEINEM FALL HAFTEN DIE 
 * AUTOREN ODER URHEBERRECHTSINHABER FUER JEGLICHE ANSPRUECHE, SCHAEDEN ODER SONSTIGE 
 * HAFTUNG, SEI ES DURCH VERTRAG, UNERLAUBTE HANDLUNGEN ODER ANDERWEITIG, DIE SICH 
 * AUS DER SOFTWARE ODER DER NUTZUNG DER SOFTWARE ODER DEM SONSTIGEN UMGANG MIT 
 * DER SOFTWARE ERGEBEN ODER DAMIT ZUSAMMENHAENGEN.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of 
 * this software and associated documentation files (the "Software"), to deal in 
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the 
 * Software, and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 * 
 * This copyright notice and this permission notice must be included in all copies 
 * or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR
 * IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIMS, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN CONTRACT, TORT OR OTHERWISE, ARISING OUT OF OR RELATED TO THE SOFTWARE 
 * OR THE USE OF OR OTHER DEALINGS WITH THE SOFTWARE.
 * 
 */

 ($=>{
    $.fn.bsmsCodePicker = function (options={}) {
                
        const defaultSettings = {
            nrOfBoxes: 6,
            allowedChars: '0123456789',
            inputName: 'bsms-code',
            /* translate: { 'I':'1', 'O':'0', 'l':'1' }, */        
            translate: { '\\w':c=>c.toUpperCase() },
            lastDigitEntered: null,
            showCredits: true
        };    
                
        const settings = $.extend( defaultSettings, options );
            
        this.each(()=>{    
            
            const $container = $('<div class="bsms-code-picker">')
                .appendTo($(this));
            const $hiddenInput = $(`<input type="hidden" name="${settings.inputName}">`)
                .appendTo($container);
    
            var $digitBoxes = $();
            for (var i = 0; i < settings.nrOfBoxes; i++) {
                $digitBoxes = $digitBoxes.add( `<input type="text" class="bsms-code-digit bsms-code-digit-${i}">` )
                //$container.add($digitBox);  
            }
            $digitBoxes
                .appendTo($container)
                .first().focus();

            if (settings.showCredits) {
                $container.append(`<a class="bsms-code-digit-credits" href="https://www.berlinsms.de">code-picker powered by berlinsms.de</a>`);
            }

            $digitBoxes.on('input', e => {
                const currentBox = $digitBoxes.index(e.target);
                const $nextBox = $digitBoxes.eq(currentBox + 1);
                var enteredValue = $(e.target).val();

                //translate charset
                if ('object' == typeof settings.translate) {    //object-context
                    for (key in settings.translate) { 
                        enteredValue = enteredValue.replaceAll(new RegExp(key,'g'),settings.translate[key]); 
                    };
                }
                else {
                    console.log('typeof settings.translate should be object');
                }

                //sanitize entered vakue
                const digits = enteredValue
                    .split('')
                    .filter(char => settings.allowedChars.includes(char));                
                var sanitizedValue = digits?.shift();
                $(e.target).val(sanitizedValue);
                if (sanitizedValue) { // move focus to next box
                    $nextBox
                        .focus();
                }
                if (digits.length > 0) {  // move digits to next box
                    $nextBox
                        .val(digits.join(''))
                        .trigger('input');
                }

                //create input
                var fullCode = '';
                for (var i = 0; i < settings.nrOfBoxes; i++) {
                    fullCode += $($digitBoxes[i]).val();
                }
                $hiddenInput.val(fullCode);

                //do callback
                if (sanitizedValue && !$nextBox.length && settings.lastDigitEntered) settings.lastDigitEntered(fullCode);
            });

            $digitBoxes.on('keyup', e => {
                if (e.keyCode === 8) {
                    $(e.target).val('');
                    const currentBoxNr = $digitBoxes.index(e.target);
                    if (currentBoxNr > 0) {
                        const $prevBox = $digitBoxes.eq(currentBoxNr - 1)
                            .focus();
                    }
                }
                if (e.keyCode === 37) {
                    const currentBoxNr = $digitBoxes.index(e.target);
                    if (currentBoxNr > 0) {
                        const $prevBox = $digitBoxes.eq(currentBoxNr - 1)
                            .focus();
                    }
                }
                if (e.keyCode === 39) {
                    const currentBoxNr = $digitBoxes.index(e.target);
                    if (currentBoxNr < $digitBoxes.length-1) {
                        const $nextBox = $digitBoxes.eq(currentBoxNr + 1)
                            .focus();
                    }
                }
            });

            $digitBoxes.on('focus', e=>{
                $(e.target).select(); // Inhalt selektieren, wenn Box den Fokus bekommt
                const currentBox = $digitBoxes.index(e.target);
                if (currentBox <= 0) return;
                const $prevBox = $digitBoxes.eq(currentBox - 1);
                if ($prevBox.val() && settings.allowedChars.includes($prevBox.val())) return;
                $prevBox.focus();
            });
        });

        this.lastDigitEntered = callback => { settings.lastDigitEntered = callback; return this; };

        return this;
    };
})(jQuery);
