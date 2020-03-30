/* loadCSS. [c]2017 Filament Group, Inc. MIT License
- This file is meant as a standalone workflow for
- testing support for link[rel=preload]
- enabling async CSS loading in browsers that do not support rel=preload
- applying rel preload css once loaded, whether supported or not.
*/
!function(t){"use strict";t.loadCSS||(t.loadCSS=function(){});var e=loadCSS.relpreload={};if(e.support=function(){var t;try{t=document.createElement("link").relList.supports("preload")}catch(e){t=!1}return function(){return t}}(),e.bindMediaToggle=function(t){var e=t.media||"all";function n(){t.addEventListener?t.removeEventListener("load",n):t.attachEvent&&t.detachEvent("onload",n),t.setAttribute("onload",null),t.media=e}t.addEventListener?t.addEventListener("load",n):t.attachEvent&&t.attachEvent("onload",n),setTimeout(function(){t.rel="stylesheet",t.media="only x"}),setTimeout(n,3e3)},e.poly=function(){if(!e.support())for(const t of document.getElementsByTagName("link"))"preload"!==t.rel||"style"!==t.getAttribute("as")||t.getAttribute("data-loadcss")||(t.setAttribute("data-loadcss",!0),e.bindMediaToggle(t))},!e.support()){e.poly();var n=t.setInterval(e.poly,500);t.addEventListener("load",function(){e.poly(),t.clearInterval(n)})}t.loadCSS=loadCSS}(window);
