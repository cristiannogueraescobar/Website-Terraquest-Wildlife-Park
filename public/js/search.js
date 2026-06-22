"use strict";

const searchInput = document.querySelector("#site-search-input");
const searchResults = document.querySelector("#search-results");

let searchTimer;

function createResultLink(title, description, url, type) {
    const link = document.createElement("a");
    link.className = "search-result-item";
    link.href = url;

    const typeElement = document.createElement("span");
    typeElement.className = "search-result-type";
    typeElement.textContent = type;

    const titleElement = document.createElement("strong");
    titleElement.textContent = title;

    const descriptionElement = document.createElement("span");
    descriptionElement.textContent = description;

    link.append(typeElement, titleElement, descriptionElement);

    return link;
}

function displayResults(data) {
    searchResults.innerHTML = "";

    const totalResults =
        data.habitats.length +
        data.experiences.length +
        data.events.length;

    if (totalResults === 0) {
        searchResults.textContent = "No matching results found.";
        searchResults.hidden = false;
        return;
    }

    data.habitats.forEach((habitat) => {
        searchResults.appendChild(
            createResultLink(
                habitat.name,
                habitat.short_description,
                `/habitats/${habitat.slug}`,
                "Habitat"
            )
        );
    });

    data.experiences.forEach((experience) => {
        searchResults.appendChild(
            createResultLink(
                experience.name,
                `${experience.short_description} — ${experience.habitat_name}`,
                `/habitats/${experience.habitat_slug}`,
                "Experience"
            )
        );
    });

    data.events.forEach((event) => {
        searchResults.appendChild(
            createResultLink(
                event.title,
                `${event.short_description} — ${event.category_name}`,
                `/events/${event.slug}`,
                "Event"
            )
        );
    });

    searchResults.hidden = false;
}

async function searchWebsite(searchTerm) {
    try {
        const response = await fetch(
            `/api/search?q=${encodeURIComponent(searchTerm)}`
        );

        const result = await response.json();

        if (!response.ok) {
            searchResults.textContent = result.message;
            searchResults.hidden = false;
            return;
        }

        displayResults(result);
    } catch (error) {
        console.error("Search request failed:", error);

        searchResults.textContent = "Search is currently unavailable.";
        searchResults.hidden = false;
    }
}

searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);

    const searchTerm = searchInput.value.trim();

    if (searchTerm.length < 2) {
        searchResults.hidden = true;
        searchResults.innerHTML = "";
        return;
    }

    searchResults.textContent = "Searching…";
    searchResults.hidden = false;

    searchTimer = setTimeout(() => {
        searchWebsite(searchTerm);
    }, 300);
});

document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-search")) {
        searchResults.hidden = true;
    }
});