# jQuery CodePicker
[Homepage](https://www.berlinsms.de/)

# Description
A jquery-plugin to pick a code or some digits in a formular, usful for OTP, TAN..

# Usage

Download js and css for bsms-code-picker
```link
https://static.berlinsms.de/toolsforcoder/code-picker/dist/bsms-code-picker.min.js
https://static.berlinsms.de/toolsforcoder/code-picker/dist/bsms-code-picker.css
```

Include jquery.js and js+css for bsms-code-picker in <head>-part of your page   
```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<link rel="stylesheet" href="bsms-code-picker.css">
<script src="bsms-code-picker.min.js"></script>
```

Find your jquery-container and assign code-picker
```js
$('.plugin-container').bsmsCodePicker();    
```

Make sure, the script is fully loaded, before you assign code-picker, e.g. use jquerys 'ready'
```js
$(document).ready(function () {
    $('.plugin-container').bsmsCodePicker();
});    
```

Add options, if needed:
```js
$(document).ready(()=>{
    $('.plugin-container').bsmsCodePicker( { nrOfBoxes:4 } );
});    
```

Example:
```js
$(document).ready(function () {
    $('.plugin-container').bsmsCodePicker( { translate: {'I':'1','O':'0','l':'1'} } );
});    
```

# Options


| Option           | DESCRIPTION                                                                                                                                               | DEFAULT                    |
|------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------|
| nrOfBoxes        | How many digits should be entered,                                                                                                                        | 6                          |
| allowedChars     | charset for each digit,                                                                                                                                   | 0123456789                 |
| inputName        | name-attribute of a hidden input-tag, which the plugin includes to the form                                                                               | bsms-code                  |
| translate        | Dictionary of key/value pairs, where keys are strings or regexp to be replaced in the user input, and values are strings or functions to be replaced with | '\\\\w':c=>c.toUpperCase() |
| lastDigitEntered | callback-function, which was called, when the last digit was entered, could be intrpreted as user finished input and used for precheck or form-submit     | null                       |
| showCredits      | shows credits                                                                                                                                             | true                       |
                                                                                                                                                                            
