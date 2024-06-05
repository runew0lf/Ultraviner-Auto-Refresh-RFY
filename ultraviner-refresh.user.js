// ==UserScript==
// @name         Ultraviner Auto-Refresh RFY
// @namespace    http://tampermonkey.net/
// @version      2024-06-05
// @description  Auto-refresh RFY
// @author       Runew0lf
// @match        https://www.amazon.co.uk/vine/vine-items?ultraviner=home*
// @match        https://www.amazon.com/vine/vine-items?ultraviner=home*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const seconds = 5;
    const startHour = 9; //9am
    const endHour = 17; //5pm
    const additionalRandomSeconds = 10; //can't be bigger than the seconds

    setInterval(() => {
        const randomUpToXSeconds = Math.random() * additionalRandomSeconds * 1000;
        const thisHour = new Date().getHours();

//        if(thisHour > startHour && thisHour < endHour) {

            setTimeout(() => {
                document.querySelector(`[data-queue-type="RFY"] [data-icon="arrows-rotate"]`).dispatchEvent(new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                }));
            }, randomUpToXSeconds);
//        }
    }, seconds * 1000);
})();
