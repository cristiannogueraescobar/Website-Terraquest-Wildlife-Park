import db, {
    getOne,
    runQuery
} from "./database.mjs";

const experiences = [
    {
        habitat: "Rainforest Canopy",
        name: "Canopy Discovery Trail",
        type: "Adventure Trail",
        short: "Explore the different levels of the rainforest canopy.",
        full: "Follow an elevated trail through tropical vegetation while discovering how animals live at different levels of the rainforest.",
        image: "canopy-trail.jpg",
        alt: "Visitors walking along an elevated rainforest trail"
    },
    {
        habitat: "Rainforest Canopy",
        name: "Tropical Bird Encounter",
        type: "Animal Exhibit",
        short: "Observe colourful tropical birds in a natural environment.",
        full: "Discover tropical bird species and learn about their behaviour, diet and role within rainforest ecosystems.",
        image: "tropical-birds.jpg",
        alt: "A colourful tropical bird sitting on a rainforest branch"
    },
    {
        habitat: "Rainforest Canopy",
        name: "Rainforest Sound Station",
        type: "Interactive Experience",
        short: "Listen to and identify sounds from the rainforest.",
        full: "Use an interactive sound station to identify birds, insects and other animals that communicate across the rainforest.",
        image: "rainforest-sounds.jpg",
        alt: "A child using an interactive rainforest sound station"
    },

    {
        habitat: "Savannah Plains",
        name: "Giraffe Observation Deck",
        type: "Animal Exhibit",
        short: "View giraffes from an elevated observation platform.",
        full: "Observe giraffes across the open grasslands while learning about their feeding habits and conservation.",
        image: "giraffe-deck.jpg",
        alt: "Giraffes viewed from an elevated observation deck"
    },
    {
        habitat: "Savannah Plains",
        name: "Junior Safari Trail",
        type: "Adventure Trail",
        short: "Follow animal tracks through the savannah.",
        full: "Young explorers can follow tracks and clues to discover which animals live across the Savannah Plains.",
        image: "safari-trail.jpg",
        alt: "Children following animal tracks on a safari trail"
    },
    {
        habitat: "Savannah Plains",
        name: "Savannah Ranger Talk",
        type: "Educational Talk",
        short: "Learn how wildlife survives in open grasslands.",
        full: "Park rangers explain animal adaptations, food chains and conservation work across savannah environments.",
        image: "ranger-talk.jpg",
        alt: "A wildlife ranger speaking to visitors near the savannah"
    },

    {
        habitat: "Reptile Realm",
        name: "Snake Discovery Exhibit",
        type: "Animal Exhibit",
        short: "Discover snakes from different natural environments.",
        full: "Learn how snakes move, hunt and survive while observing them safely in carefully designed habitats.",
        image: "snake-exhibit.jpg",
        alt: "A snake resting inside a natural reptile habitat"
    },
    {
        habitat: "Reptile Realm",
        name: "Reptile Keeper Talk",
        type: "Educational Talk",
        short: "Meet a reptile keeper and learn about animal care.",
        full: "A specialist keeper explains how reptiles are cared for and why they are important to natural ecosystems.",
        image: "reptile-talk.jpg",
        alt: "A reptile keeper explaining animal care to visitors"
    },
    {
        habitat: "Reptile Realm",
        name: "Cold-Blooded Challenge",
        type: "Interactive Experience",
        short: "Test your knowledge of reptiles and their adaptations.",
        full: "Complete interactive questions about reptile behaviour, body temperature and survival adaptations.",
        image: "reptile-challenge.jpg",
        alt: "A visitor completing an interactive reptile challenge"
    },

    {
        habitat: "Wetland Expedition",
        name: "Wetland Boardwalk",
        type: "Adventure Trail",
        short: "Walk across the wetland and observe wildlife safely.",
        full: "Follow a wooden boardwalk through ponds and vegetation while discovering the importance of wetland ecosystems.",
        image: "wetland-boardwalk.jpg",
        alt: "A wooden visitor boardwalk crossing a wetland"
    },
    {
        habitat: "Wetland Expedition",
        name: "Otter Observation Point",
        type: "Animal Exhibit",
        short: "Watch otters swimming, playing and exploring.",
        full: "Observe otters from a quiet viewing area and learn about their behaviour, diet and habitat requirements.",
        image: "otter-observation.jpg",
        alt: "An otter swimming near a wetland observation point"
    },
    {
        habitat: "Wetland Expedition",
        name: "Pond Explorer Station",
        type: "Interactive Experience",
        short: "Discover the small animals that live in freshwater ponds.",
        full: "Use interactive displays to identify insects, amphibians and other species that depend on healthy ponds.",
        image: "pond-explorer.jpg",
        alt: "Children exploring freshwater wildlife at an activity station"
    }
];

async function seedExperiences() {
    try {
        for (const experience of experiences) {
            const habitat = await getOne(
                "SELECT habitat_id FROM habitats WHERE name = ?",
                [experience.habitat]
            );

            if (!habitat) {
                console.warn(`Habitat not found: ${experience.habitat}`);
                continue;
            }

            const existingExperience = await getOne(
                `
                    SELECT experience_id
                    FROM experiences
                    WHERE habitat_id = ? AND name = ?
                `,
                [habitat.habitat_id, experience.name]
            );

            if (!existingExperience) {
                await runQuery(
                    `
                        INSERT INTO experiences (
                            habitat_id,
                            name,
                            experience_type,
                            short_description,
                            full_description,
                            image_filename,
                            image_alt
                        )
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    `,
                    [
                        habitat.habitat_id,
                        experience.name,
                        experience.type,
                        experience.short,
                        experience.full,
                        experience.image,
                        experience.alt
                    ]
                );
            }
        }

        console.log("Experience data added successfully.");
    } catch (error) {
        console.error("Unable to add experience data:", error.message);
    } finally {
        db.close();
    }
}

seedExperiences();