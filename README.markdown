#jQuery Tooltip Plugin
This tooltip will be react on window resize and window scroll.

###[Demo jQuery Tooltip Plugin](http://belyash.github.io/jquery-tooltip-plugin.github.com/)

####Dependencies:
* jQuery

####Files:</h3>
* jquery.tooltip.js
* jquery.tooltip.Css

###How to use?
$('.selector').tooltip();

###Customize
<pre>
$('.tooltip').tooltip({
    event : "click",        // Default tooltip will be showed by "click", but you can use "hover"
    sParent: 'body',        // Parent for div of tooltips
    sClass: 'i-tooltip',    // CSS-class of tooltip
    sActiveClass: 'active', // When tooltip is shown this class will be added to node who call tooltip
    sCssMod: "",            // This classname will be added to tooltip wrap
    vertical: false         // If "true" then tooltip will be shown on the top or bottom of ".tooltip"
});
</pre>
