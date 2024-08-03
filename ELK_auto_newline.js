// ==UserScript==
// @name         ELK_auto_newline
// @namespace    http://tampermonkey.net/
// @version      2024-08-03
// @description  try to take over the world!
// @author       You
// @match        https://elk.itiscaleb.com/app/discover
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @run-at document-end
// ==/UserScript==

(function() {
    'use strict';


    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const elements = node.getElementsByClassName("dscDiscoverGrid__cellPopoverValue eui-textBreakWord");
                        if (elements.length) {
                            Array.from(elements).forEach(element => {
                                element.classList.add("euiDataGridRowCell__definedHeight");
                            });
                        }
                    }
                });
            }
        });
    });

    const config = {
        childList: true,
        subtree: true
    };

    observer.observe(document.body, config);
})();