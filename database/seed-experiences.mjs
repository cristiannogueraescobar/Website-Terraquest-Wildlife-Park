import db, {
    getOne,
    runQuery
} from "./database.mjs";

const experiences = [
    {
        habitat: "The Last Forest",
        name: "Forest Guardian Trail",
        type: "Adventure Trail",
        short: "Follow a misty rainforest route and discover signs of protected wildlife.",
        full: "Visitors explore a guided forest trail while learning how rangers identify tracks, monitor habitats and protect endangered species.",
        image: "forest-guardian-trail.png",
        alt: "A misty rainforest trail with wooden conservation markers"
    },
    {
        habitat: "The Last Forest",
        name: "Endangered Species Lookout",
        type: "Animal Exhibit",
        short: "Observe endangered red pandas from a quiet forest viewing point.",
        full: "A peaceful observation platform allows visitors to watch red pandas behaving naturally while learning about habitat loss and conservation programmes.",
        image: "endangered-species-lookout.png",
        alt: "Several red pandas visible from a rainforest observation platform"
    },
    {
        habitat: "The Last Forest",
        name: "Conservation Ranger Talk",
        type: "Educational Talk",
        short: "Discover how rangers monitor and protect threatened forest species.",
        full: "Rangers explain wildlife tracking, camera monitoring, habitat surveys and the practical work involved in protecting endangered forest animals.",
        image: "conservation-ranger-talk.png",
        alt: "A rainforest conservation station with monitoring equipment and field materials"
    },

    {
        habitat: "The Golden Reserve",
        name: "Rhino Viewing Experience",
        type: "Animal Exhibit",
        short: "Observe a rhinoceros safely within the open golden reserve.",
        full: "Visitors watch rhinoceroses from a protected observation area while learning about their behaviour, habitat and conservation status.",
        image: "rhino-viewing-experience.png",
        alt: "A rhinoceros near a protected viewing platform in the savannah"
    },
    {
        habitat: "The Golden Reserve",
        name: "Savannah Discovery Walk",
        type: "Adventure Trail",
        short: "Explore the reserve during a peaceful golden-hour discovery walk.",
        full: "The trail introduces visitors to savannah plants, animal tracks, grazing species and the relationships that support this ecosystem.",
        image: "savannah-discovery-walk.png",
        alt: "A sunrise walking trail through golden savannah grassland"
    },
    {
        habitat: "The Golden Reserve",
        name: "Keeper Conservation Talk",
        type: "Educational Talk",
        short: "Learn how conservation teams protect rhinoceroses and their habitat.",
        full: "Keepers explain monitoring, anti-poaching measures, population research and the importance of conserving healthy savannah environments.",
        image: "keeper-conservation-talk.png",
        alt: "A rhino conservation education point with monitoring equipment"
    },

    {
        habitat: "Predator Territory",
        name: "Predator Tracking Trail",
        type: "Adventure Trail",
        short: "Explore a protected evening trail and search for signs of predators.",
        full: "Visitors follow a low-lit boardwalk while learning how experts use tracks, sounds and movement to monitor predators safely.",
        image: "predator-tracking-trail.png",
        alt: "A softly illuminated jungle boardwalk used for predator tracking"
    },
    {
        habitat: "Predator Territory",
        name: "Big Cat Observation Point",
        type: "Animal Exhibit",
        short: "Discover several rare and endangered feline species.",
        full: "A specialist observation experience introduces snow leopards, Amur leopards, clouded leopards and other threatened wild cats.",
        image: "big-cat-observation-point.png",
        alt: "A collection of endangered big cats in their different natural habitats"
    },
    {
        habitat: "Predator Territory",
        name: "Nocturnal Predator Talk",
        type: "Educational Talk",
        short: "See how monitoring technology reveals predator behaviour after dark.",
        full: "Night-vision cameras and recorded observations help visitors understand how owls, wild cats and other nocturnal predators hunt and navigate.",
        image: "nocturnal-predator-talk.png",
        alt: "A nighttime wildlife talk area with screens showing nocturnal predators"
    },

    {
        habitat: "River of Life",
        name: "Wetland Discovery Trail",
        type: "Adventure Trail",
        short: "Discover the wildlife and habitats found throughout the wetland.",
        full: "Visitors explore a wetland route featuring birds, fish, turtles, reptiles and the plants that support freshwater ecosystems.",
        image: "wetland-discovery-trail.png",
        alt: "A wetland discovery collage showing a boardwalk and freshwater wildlife"
    },
    {
        habitat: "River of Life",
        name: "River Species Viewing Deck",
        type: "Animal Exhibit",
        short: "Observe crocodiles and other species sharing the river ecosystem.",
        full: "A protected deck provides views of crocodiles, turtles, fish and wetland birds while explaining how these animals coexist.",
        image: "river-species-viewing-deck.png",
        alt: "Crocodiles, turtles, fish and wetland birds viewed from a wooden deck"
    },
    {
        habitat: "River of Life",
        name: "Freshwater Conservation Talk",
        type: "Educational Talk",
        short: "Investigate freshwater species, water quality and habitat protection.",
        full: "An educational conservation session uses field equipment, samples and species observations to explain the importance of clean freshwater.",
        image: "freshwater-conservation-talk.png",
        alt: "A freshwater conservation station with samples and wetland species"
    },

    {
        habitat: "Little Rangers Village",
        name: "Little Rangers Animal Encounter",
        type: "Family Activity",
        short: "Meet calm, child-friendly animals in a supervised environment.",
        full: "Families can observe selected domestic animals closely while learning about respectful behaviour, feeding and responsible animal care.",
        image: "little-rangers-animal-encounter.png",
        alt: "An alpaca, goat, rabbit and chickens in a family animal encounter area"
    },
    {
        habitat: "Little Rangers Village",
        name: "Junior Keeper Session",
        type: "Interactive Experience",
        short: "Complete practical animal-care tasks in a supervised session.",
        full: "Young visitors prepare food, organise equipment, inspect animal areas and complete a simple keeper care checklist.",
        image: "junior-keeper-session.png",
        alt: "A collage of junior keeper activities and animal-care equipment"
    },
    {
        habitat: "Little Rangers Village",
        name: "Family Nature Workshop",
        type: "Family Activity",
        short: "Explore natural materials through creative family activities.",
        full: "Families examine plants, create wildlife-track impressions, sketch observations and identify natural objects during a guided workshop.",
        image: "family-nature-workshop.png",
        alt: "A family nature workshop with journals, natural materials and discovery activities"
    }
];

async function seedExperiences() {
    try {
        await runQuery("BEGIN TRANSACTION");

        await runQuery("DELETE FROM experiences");

        for (const experience of experiences) {
            const habitat = await getOne(
                "SELECT habitat_id FROM habitats WHERE name = ?",
                [experience.habitat]
            );

            if (!habitat) {
                throw new Error(
                    `Habitat not found: ${experience.habitat}`
                );
            }

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

        await runQuery("COMMIT");

        console.log(
            `${experiences.length} experiences replaced successfully.`
        );
    } catch (error) {
        try {
            await runQuery("ROLLBACK");
        } catch {
            // No active transaction to roll back.
        }

        console.error(
            "Unable to replace experience data:",
            error.message
        );
    } finally {
        db.close();
    }
}

seedExperiences();