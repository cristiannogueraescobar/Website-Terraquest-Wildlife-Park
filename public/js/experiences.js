"use strict";

const habitatSelect = document.querySelector("#experience-habitat");
const typeSelect = document.querySelector("#experience-type");
const experiencesGrid = document.querySelector("#experiences-grid");
const experiencesStatus = document.querySelector("#experiences-status");

function createExperienceCard(experience) {
    const article = document.createElement("article");
    article.className = "experience-card experience-image-card";

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "experience-card-image-wrapper";

    const image = document.createElement("img");
    image.className = "experience-card-image";
    image.src = `/images/${experience.image_filename}`;
    image.alt = experience.image_alt;
    image.loading = "lazy";

    imageWrapper.appendChild(image);

    const content = document.createElement("div");
    content.className = "experience-card-content";

    const type = document.createElement("p");
    type.className = "experience-type";
    type.textContent = experience.experience_type;

    const heading = document.createElement("h2");
    heading.textContent = experience.name;

    const habitat = document.createElement("p");
    habitat.className = "experience-habitat";
    habitat.textContent = experience.habitat_name;

    const description = document.createElement("p");
    description.textContent = experience.short_description;

    const link = document.createElement("a");
    link.className = "card-link";
    link.href = `/habitats/${experience.habitat_slug}`;
    link.textContent = "Explore this habitat";

    content.append(
        type,
        heading,
        habitat,
        description,
        link
    );

    article.append(
        imageWrapper,
        content
    );

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