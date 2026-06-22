"use strict";

document.documentElement.classList.add("js-enabled");

const menuToggle = document.querySelector("#menu-toggle");
const navigationLinks = document.querySelector("#navigation-links");

if (menuToggle && navigationLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen =
            menuToggle.getAttribute("aria-expanded") === "true";

        menuToggle.setAttribute(
            "aria-expanded",
            String(!isOpen)
        );

        navigationLinks.classList.toggle("navigation-links-open");
    });

    navigationLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            menuToggle.setAttribute("aria-expanded", "false");
            navigationLinks.classList.remove("navigation-links-open");
        });
    });
}