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
    article.className = "event-card event-image-card";

    let statusClass = "event-status-upcoming";

    if (event.status === "Past event") {
        statusClass = "event-status-past";
    } else if (event.status === "Currently running") {
        statusClass = "event-status-current";
    }

    let scheduleText = "";

    if (event.event_type === "recurring") {
        scheduleText = `
            <p class="event-schedule">
                ${event.recurrence_text} at ${event.start_time}
            </p>

            <p class="event-date-range">
                ${formatDate(event.start_date)}
                to
                ${formatDate(event.end_date)}
            </p>
        `;
    } else {
        const endDateText =
            event.end_date && event.end_date !== event.start_date
                ? ` to ${formatDate(event.end_date)}`
                : "";

        scheduleText = `
            <p class="event-schedule">
                ${formatDate(event.start_date)}${endDateText}
                at ${event.start_time}
            </p>
        `;
    }

    const imageFilename =
        event.image_filename || "terraquest-placeholder.png";

    const imageAlt =
        event.image_alt || `${event.title} at TerraQuest`;

    article.innerHTML = `
        <div class="event-card-image-wrapper">
            <img
                class="event-card-image"
                src="/images/${imageFilename}"
                alt="${imageAlt}"
                loading="lazy"
            >
        </div>

        <div class="event-card-content">
            <div class="event-card-meta">
                <p class="event-category">
                    ${event.category_name}
                </p>

                <p class="event-status ${statusClass}">
                    ${event.status}
                </p>
            </div>

            <h2>${event.title}</h2>

            ${scheduleText}

            <p class="event-location">
                ${event.location}
            </p>

            <p class="event-description">
                ${event.short_description}
            </p>

            <a
                class="card-link"
                href="/events/${event.slug}"
            >
                View event details
            </a>
        </div>
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
        const response = await fetch(
            `/api/events?${query.toString()}`
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Unable to load events."
            );
        }

        if (result.events.length === 0) {
            eventsStatus.textContent =
                "No events match the selected filters.";
            return;
        }

        result.events.forEach((event) => {
            eventsGrid.appendChild(
                createEventCard(event)
            );
        });

        const eventWord =
            result.events.length === 1 ? "event" : "events";

        eventsStatus.textContent =
            `${result.events.length} ${eventWord} found.`;
    } catch (error) {
        console.error(
            "Unable to load events:",
            error
        );

        eventsStatus.textContent =
            "Events could not be loaded. Please try again.";
    }
}

yearSelect.addEventListener("change", loadEvents);
categorySelect.addEventListener("change", loadEvents);

loadEvents();