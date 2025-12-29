// ==UserScript==
// @name         GitHub to DeepWiki Button
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Adds a button with DeepWiki icon on GitHub repo pages to DeepWiki page.
// @author       Vincent55
// @match        https://github.com/*/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    function addDeepWikiButton() {

        const pathParts = window.location.pathname.split('/').filter(part => part.length > 0);
        if (pathParts.length < 2) return;

        const owner = pathParts[0];
        const repo = pathParts[1];

        const visibilityElement = document.querySelector('span.Label.Label--secondary.v-align-middle');
        if (!visibilityElement) return;

        const button = document.createElement('button');
        button.className = 'btn btn-sm ml-2';
        button.style.display = 'inline-flex';
        button.style.alignItems = 'center';

        const icon = document.createElement('img');
        icon.width = 16;
        icon.height = 16;
        icon.alt = 'DeepWiki Icon';
        icon.style.marginRight = '5px';

        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://deepwiki.com/favicon.ico',
            responseType: 'blob',
            onload: function(response) {
                if (response.response) {
                    const blobUrl = URL.createObjectURL(response.response);
                    icon.src = blobUrl;
                }
            },
            onerror: function() {
                console.error('Failed to fetch DeepWiki icon');
            }
        });

        button.appendChild(icon);
        button.appendChild(document.createTextNode('DeepWiki'));
        button.addEventListener('click', function() {
            window.location.href = `https://deepwiki.com/${owner}/${repo}`;
        });

        visibilityElement.parentNode.insertBefore(button, visibilityElement.nextSibling);
    }

    window.addEventListener('load', addDeepWikiButton);
})();