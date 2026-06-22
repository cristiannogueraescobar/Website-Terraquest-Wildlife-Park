"use strict";

const yearSelect = document.querySelector("#event-year");
const categorySelect = document.querySelector("#event-category");
const eventsGrid = document.querySelector("#events-grid");
const eventsStatus = document.querySelector("#events-status");

function formatDate(dateString) {
    const date = new Date(`${dateString}T00:00:00`);

    return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(date);
}

function createEventCard(event) {
    const article = document.createElement("article");
    article.className = "event-card";

    const statusClass =
        event.status === "Past event"
            ? "event-status-past"
            : "event-status-upcoming";

    article.innerHTML = `
        <p class="event-category">${event.category_name}</p>

        <p class="event-status ${statusClass}">
            ${event.status}
        </p>

        <h2>${event.title}</h2>

        <p class="event-date">
            ${formatDate(event.event_date)} at ${event.start_time}
        </p>

        <p class="event-location">${event.location}</p>

        <p>${event.short_description}</p>

        <a class="card-link" href="/events/${event.slug}">
            View event details
        </a>
    `;

    return article;
}

async function loadEvents() {
    const year = yearSelect.value;
    const category = categorySelect.value;

    eventsStatus.textContent = "Loading events…";
    eventsGrid.innerHTML = "";

    const query = new URLSearchParams({
        year,
        category
    });

    try {
        const response = await fetch(`/api/events?${query.toString()}`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        if (result.events.length === 0) {
            eventsStatus.textContent =
                "No events match the selected filters.";
            return;
        }

        result.events.forEach((event) => {
            eventsGrid.appendChild(createEventCard(event));
        });

        eventsStatus.textContent =
            `${result.events.length} event${result.events.length === 1 ? "" : "s"} found.`;
    } catch (error) {
        console.error("Unable to load events:", error);

        eventsStatus.textContent =
            "Events could not be loaded. Please try again.";
    }
}

yearSelect.addEventListener("change", loadEvents);
categorySelect.addEventListener("change", loadEvents);

loadEvents();