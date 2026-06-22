"use strict";

const habitatSelect = document.querySelector("#experience-habitat");
const typeSelect = document.querySelector("#experience-type");
const experiencesGrid = document.querySelector("#experiences-grid");
const experiencesStatus = document.querySelector("#experiences-status");

function createExperienceCard(experience) {
    const article = document.createElement("article");
    article.className = "experience-card";

    article.innerHTML = `
        <p class="experience-type">
            ${experience.experience_type}
        </p>

        <h2>${experience.name}</h2>

        <p class="experience-habitat">
            ${experience.habitat_name}
        </p>

        <p>${experience.short_description}</p>

        <a
            class="card-link"
            href="/habitats/${experience.habitat_slug}"
        >
            Explore this habitat
        </a>
    `;

    return article;
}

async function loadExperiences() {
    const habitat = habitatSelect.value;
    const type = typeSelect.value;

    experiencesStatus.textContent = "Loading experiences…";
    experiencesGrid.innerHTML = "";

    const query = new URLSearchParams({
        habitat,
        type
    });

    try {
        const response = await fetch(
            `/api/experiences?${query.toString()}`
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        if (result.experiences.length === 0) {
            experiencesStatus.textContent =
                "No experiences match the selected filters.";
            return;
        }

        result.experiences.forEach((experience) => {
            experiencesGrid.appendChild(
                createExperienceCard(experience)
            );
        });

        experiencesStatus.textContent =
            `${result.experiences.length} experience${result.experiences.length === 1 ? "" : "s"
            } found.`;
    } catch (error) {
        console.error("Unable to load experiences:", error);

        experiencesStatus.textContent =
            "Experiences could not be loaded. Please try again.";
    }
}

habitatSelect.addEventListener("change", loadExperiences);
typeSelect.addEventListener("change", loadExperiences);

loadExperiences();