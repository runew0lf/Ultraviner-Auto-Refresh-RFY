// ==UserScript==
// @name         Ultraviner Auto-Refresh RFY & AI
// @namespace    http://tampermonkey.net/
// @version      2024-06-06
// @description  Auto-refresh RFY & AI
// @author       Runew0lf
// @match        https://www.amazon.co.uk/vine/vine-items?ultraviner=home*
// @match        https://www.amazon.com/vine/vine-items?ultraviner=home*
// @grant        none
// ==/UserScript==
(function () {
    'use strict';
    const seconds = 30; // our base refresh time
    const startHour = 3; //example:  9 for 9am (24 hour clock)
    const endHour = 17; //example: 17 for 5pm (24 hour clock)
    const additionalRandomSeconds = 10; //can't be bigger than the seconds

    function refreshQueue(queueType) {
        const randomUpToXSeconds = Math.random() * additionalRandomSeconds * 1000;
        const thisHour = new Date().getHours();
        if (thisHour >= startHour && thisHour < endHour) {
            setTimeout(() => {
                document.querySelector(`[data-queue-type="${queueType}"] [data-icon="arrows-rotate"]`)?.dispatchEvent(new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                }));
            }, randomUpToXSeconds);
        }
    }

    setInterval(() => {
        refreshQueue('RFY');
        refreshQueue('AFA');
    }, seconds * 1000);
})();
