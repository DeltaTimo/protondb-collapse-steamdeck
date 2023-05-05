// ==UserScript==
// @name         Allow collapsing Steam Deck on protondb.
// @namespace    https://protondb.com
// @version      0.1
// @description  Adds a collapse toggle button to the Steam Deck section of protondb.
// @author       Timo Zuccarello
// @match        https://www.protondb.com/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=protondb.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const deviceContainer = "GameReports__Container-sc-ntxesq-0";
    const deviceSummaryContainer = "GameReports__SummaryContainer-sc-ntxesq-1";

    function querySafe(path, from) {
        if (!from) {
            from = document;
        }
        const selected = from.querySelector(path);
        if (selected) {
            return { "do": (x) => x(selected) };
        } else {
            return { "do": (x) => undefined };
        }
    }

    function querySafeAll(path, from) {
        if (!from) {
            from = document;
        }
        const selected = from.querySelectorAll(path);
        return { "do": (x) => selected.forEach(x) };
    }

    function hideDevice(root) {
        console.log("root ");
        console.log(root);
        console.log("children " + root.children.length);
        for (var i = 2; i < root.children.length; ++i) {
            root.children[i].style.display = "none";
        }
    }

    function showDevice(root) {
        for (var i = 2; i < root.children.length; ++i) {
            root.children[i].style.display = "";
        }
    }

    function toggleDevice(root) {
        const children = root.children;
        if (children.length > 2 && children[2].style.display == "none") {
            showDevice(root);
            return true;
        } else {
            hideDevice(root);
            return false;
        }
    }

    function makeProtonDbBetter() {
        querySafe("." + deviceSummaryContainer + " > :nth-child(2)").do((x) => {
            console.log("found nth child");
            console.log(x);
            if (!x.querySelector("span.betterprotondb-toggle-collapse")) {
                const el = document.createElement("span");
                const collapseText = "Collapse ↑";
                const expandText   = "Expand ↓";
                el.style.cursor = "pointer";
                el.style.marginLeft = "8px";
                el.style.marginRight = "8px";
                el.style.textDecoration = "underline";
                el.innerText = collapseText;
                el.classList.add("betterprotondb-toggle-collapse");
                el.addEventListener("click", (_) => {
                    if (querySafe("." + deviceContainer).do(toggleDevice)) {
                        el.innerText = collapseText;
                    } else {
                        el.innerText = expandText;
                    }
                });
                querySafe("." + deviceContainer).do(showDevice);
                x.appendChild(el);
                console.log("appending child");
                console.log(el);
            }
        });
    }
    (new MutationObserver((a,b) => makeProtonDbBetter())).observe(document.body, { subtree: true, childList: true });
})();
