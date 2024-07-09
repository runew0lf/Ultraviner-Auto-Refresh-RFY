// ==UserScript==
// @name         Ultraviner Auto-Refresh RFY, AFA & AI
// @namespace    http://tampermonkey.net/
// @version      2024-07-09
// @description  Auto-refresh RFY, AFA & AI
// @author       Runew0lf
// @match        https://www.amazon.co.uk/vine/vine-items?ultraviner=home*
// @match        https://www.amazon.com/vine/vine-items?ultraviner=home*
// @updateURL    https://github.com/runew0lf/Ultraviner-Auto-Refresh-RFY/raw/main/ultraviner-refresh.user.js
// @downloadURL  https://github.com/runew0lf/Ultraviner-Auto-Refresh-RFY/raw/main/ultraviner-refresh.user.js
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    // Default values for settings
    const defaultSettings = {
        minSeconds: 30,
        maxSeconds: 50,
        startHour: 3, // 3am
        endHour: 17, // 5pm
        useHourRestriction: true,
        refreshRFY: true,
        refreshAFA: true,
        refreshAI: true
    };

    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem('ultravinerSettings')) || defaultSettings;
        return settings;
    }

    function saveSettings(settings) {
        localStorage.setItem('ultravinerSettings', JSON.stringify(settings));
    }

    let settings = loadSettings();
    let { minSeconds, maxSeconds, startHour, endHour, useHourRestriction, refreshRFY, refreshAFA, refreshAI } = settings;

    let intervals = {};

    function getRandomInterval() {
        return Math.random() * (maxSeconds - minSeconds) + minSeconds;
    }

    function refreshQueue(queueType) {
        const thisHour = new Date().getHours();
        if (!useHourRestriction || (thisHour >= startHour && thisHour <= endHour)) {
            document.querySelector(`[data-queue-type="${queueType}"] [data-icon="arrows-rotate"]`).dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            }));
        }
    }

    function startRefreshing(queueType) {
        stopRefreshing(queueType); // Stop any existing interval
        const interval = getRandomInterval() * 1000;
        intervals[queueType] = setInterval(() => {
            refreshQueue(queueType);
        }, interval);
    }

    function stopRefreshing(queueType) {
        clearInterval(intervals[queueType]);
    }

    function applySettings() {
        if (refreshRFY) startRefreshing('RFY');
        else stopRefreshing('RFY');

        if (refreshAFA) startRefreshing('AFA');
        else stopRefreshing('AFA');

        if (refreshAI) startRefreshing('AI');
        else stopRefreshing('AI');
    }

    function createModal() {
        const modalHtml = `
            <div id="settingsModal" style="display:none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; padding: 20px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5); z-index: 1001;">
                <h2>Settings</h2>
                <label for="minSeconds">Min Seconds:</label>
                <input type="number" id="minSeconds" value="${minSeconds}" min="1"><br><br>
                <label for="maxSeconds">Max Seconds:</label>
                <input type="number" id="maxSeconds" value="${maxSeconds}" min="1"><br><br>
                <label for="startHour">Start Hour:</label>
                <input type="number" id="startHour" value="${startHour}" min="0" max="23"><br><br>
                <label for="endHour">End Hour:</label>
                <input type="number" id="endHour" value="${endHour}" min="0" max="23"><br><br>
                <label for="useHourRestriction">Use Hour Restriction:</label>
                <input type="checkbox" id="useHourRestriction" ${useHourRestriction ? 'checked' : ''}><br><br>
                <label for="refreshRFY">Refresh RFY:</label>
                <input type="checkbox" id="refreshRFY" ${refreshRFY ? 'checked' : ''}><br><br>
                <label for="refreshAFA">Refresh AFA:</label>
                <input type="checkbox" id="refreshAFA" ${refreshAFA ? 'checked' : ''}><br><br>
                <label for="refreshAI">Refresh AI:</label>
                <input type="checkbox" id="refreshAI" ${refreshAI ? 'checked' : ''}><br><br>
                <button id="saveSettings">Save</button>
                <button id="closeModal">Close</button>
            </div>
            <div id="modalBackdrop" style="display:none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;"></div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        document.getElementById('saveSettings').addEventListener('click', () => {
            const newMinSeconds = parseFloat(document.getElementById('minSeconds').value);
            const newMaxSeconds = parseFloat(document.getElementById('maxSeconds').value);
            const newStartHour = parseInt(document.getElementById('startHour').value, 10);
            const newEndHour = parseInt(document.getElementById('endHour').value, 10);
            const newUseHourRestriction = document.getElementById('useHourRestriction').checked;
            const newRefreshRFY = document.getElementById('refreshRFY').checked;
            const newRefreshAFA = document.getElementById('refreshAFA').checked;
            const newRefreshAI = document.getElementById('refreshAI').checked;

            if (isNaN(newMinSeconds) || isNaN(newMaxSeconds) || newMinSeconds < 1 || newMaxSeconds < newMinSeconds) {
                alert("Invalid input for seconds. Please enter valid numbers where minimum is less than maximum.");
            } else if (isNaN(newStartHour) || isNaN(newEndHour) || newStartHour < 0 || newStartHour > 23 || newEndHour < 0 || newEndHour > 23 || newStartHour > newEndHour) {
                alert("Invalid input for hours. Please enter valid numbers between 0 and 23, and ensure start hour is less than or equal to end hour.");
            } else {
                minSeconds = newMinSeconds;
                maxSeconds = newMaxSeconds;
                startHour = newStartHour;
                endHour = newEndHour;
                useHourRestriction = newUseHourRestriction;
                refreshRFY = newRefreshRFY;
                refreshAFA = newRefreshAFA;
                refreshAI = newRefreshAI;

                settings = { minSeconds, maxSeconds, startHour, endHour, useHourRestriction, refreshRFY, refreshAFA, refreshAI };
                saveSettings(settings);
                applySettings();

                alert(`Settings updated:\nminSeconds = ${minSeconds}\nmaxSeconds = ${maxSeconds}\nstartHour = ${startHour}\nendHour = ${endHour}\nuseHourRestriction = ${useHourRestriction}\nrefreshRFY = ${refreshRFY}\nrefreshAFA = ${refreshAFA}\nrefreshAI = ${refreshAI}`);
                closeModal();
            }
        });

        document.getElementById('closeModal').addEventListener('click', closeModal);

        function closeModal() {
            document.getElementById('settingsModal').style.display = 'none';
            document.getElementById('modalBackdrop').style.display = 'none';
        }

        function openModal() {
            document.getElementById('settingsModal').style.display = 'block';
            document.getElementById('modalBackdrop').style.display = 'block';
        }

        return openModal;
    }

    function createSettingsButton(openModal) {
        let executed = false;
        const settingsButton = document.createElement('button');
        settingsButton.textContent = '🔄';
        settingsButton.style.backgroundColor = 'transparent';
        settingsButton.style.border = 'none';
        settingsButton.style.color = 'white';
        settingsButton.style.cursor = 'pointer';
        settingsButton.style.fontSize = '1.5rem';
        settingsButton.addEventListener('click', openModal);


        const targetNode = document;

        const config = { attributes: false, childList: true, subtree: true };

        const callback = (mutationList, observer) => {

            for (const mutation of mutationList) {
                if (mutation.type === "childList" && mutation.target.className.indexOf("queue-items") >= 0 && document.querySelector("[class*='add-queue']") && !executed) {
                    const divider = document.querySelector("[class*='divider'][class*='vertical']");
                    const clonedDivider = divider.cloneNode(true);

                    document.querySelector("[class*='add-queue']").insertAdjacentElement("afterend", settingsButton);
                    document.querySelector("[class*='add-queue']").insertAdjacentElement("afterend", clonedDivider);

                    executed = true;
                    setTimeout(() => {
                        executed = false;
                    }, 1000);
                }
            }
        };

        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);

    }

    const openModal = createModal();
    createSettingsButton(openModal);
    applySettings(); // Start refreshing based on initial settings
})();
