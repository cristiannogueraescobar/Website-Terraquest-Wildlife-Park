import db, {
    getOne,
    runQuery
} from "./database.mjs";

const experiences = [
    {
        habitat: "The Last Forest",
        name: "Forest Guardian Trail",
        type: "Adventure Trail",
        short: "Follow tracks and signs through the protected forest.",
        full: "Visitors follow a guided trail through dense vegetation while learning how endangered forest animals are monitored and protected.",
        image: "forest-guardian-trail.jpg",
        alt: "Visitors following a wildlife trail through a dense forest"
    },
    {
        habitat: "The Last Forest",
        name: "Endangered Species Lookout",
        type: "Animal Exhibit",
        short: "Observe threatened forest species from a quiet viewing area.",
        full: "A calm observation point allows visitors to watch protected wildlife while learning about habitat loss and conservation programmes.",
        image: "forest-lookout.jpg",
        alt: "A protected forest animal viewed from a quiet observation platform"
    },
    {
        habitat: "The Last Forest",
        name: "Conservation Ranger Talk",
        type: "Educational Talk",
        short: "Learn how rangers protect threatened species.",
        full: "TerraQuest rangers explain tracking, rescue work and the challenges involved in protecting endangered forest animals.",
        image: "forest-ranger-talk.jpg",
        alt: "A conservation ranger speaking to visitors in a forest habitat"
    },

    {
        habitat: "The Golden Reserve",
        name: "Savannah Observation Deck",
        type: "Animal Exhibit",
        short: "View large savannah animals from an elevated platform.",
        full: "Visitors can observe grazing animals and learn how species share resources across the African savannah.",
        image: "savannah-observation.jpg",
        alt: "Visitors observing savannah animals from an elevated platform"
    },
    {
        habitat: "The Golden Reserve",
        name: "Rhino Conservation Station",
        type: "Interactive Experience",
        short: "Discover how conservation teams protect rhinoceroses.",
        full: "Interactive displays explain anti-poaching work, habitat protection and the importance of monitoring rhino populations.",
        image: "rhino-conservation.jpg",
        alt: "An interactive conservation display about rhinoceroses"
    },
    {
        habitat: "The Golden Reserve",
        name: "Golden Plains Ranger Talk",
        type: "Educational Talk",
        short: "Learn how savannah animals survive in a changing environment.",
        full: "A ranger explains migration, food chains, water shortages and the relationship between predators and prey.",
        image: "golden-plains-talk.jpg",
        alt: "A wildlife ranger speaking beside a savannah habitat"
    },

    {
        habitat: "Predator Territory",
        name: "Predator Viewing Tunnel",
        type: "Animal Exhibit",
        short: "Observe powerful predators from a secure viewing tunnel.",
        full: "A reinforced viewing tunnel allows visitors to watch predators safely while learning about their behaviour and natural role.",
        image: "predator-tunnel.jpg",
        alt: "Visitors watching a predator through a secure glass tunnel"
    },
    {
        habitat: "Predator Territory",
        name: "Night Hunter Experience",
        type: "Interactive Experience",
        short: "Discover how predators use sound, movement and darkness.",
        full: "Interactive displays demonstrate how predators detect prey, move silently and adapt to low-light environments.",
        image: "night-hunter.jpg",
        alt: "A visitor using an interactive display about nocturnal predators"
    },
    {
        habitat: "Predator Territory",
        name: "Predator Keeper Talk",
        type: "Educational Talk",
        short: "Learn how dangerous animals are cared for safely.",
        full: "A specialist keeper explains enclosure design, feeding routines, animal welfare and public safety.",
        image: "predator-keeper-talk.jpg",
        alt: "A specialist keeper presenting information about predator care"
    },

    {
        habitat: "River of Life",
        name: "Wetland Discovery Boardwalk",
        type: "Adventure Trail",
        short: "Explore freshwater habitats from a raised boardwalk.",
        full: "Visitors follow a boardwalk through wetland vegetation and discover species that depend on clean freshwater.",
        image: "wetland-boardwalk.jpg",
        alt: "A raised wooden boardwalk crossing a wetland habitat"
    },
    {
        habitat: "River of Life",
        name: "Aquatic Rescue Centre",
        type: "Animal Exhibit",
        short: "Learn how injured and threatened aquatic animals are supported.",
        full: "The rescue centre explains rehabilitation, water quality and the challenges faced by freshwater wildlife.",
        image: "aquatic-rescue.jpg",
        alt: "A wildlife keeper caring for an aquatic animal"
    },
    {
        habitat: "River of Life",
        name: "Water Conservation Lab",
        type: "Interactive Experience",
        short: "Test how pollution affects freshwater ecosystems.",
        full: "Visitors use interactive controls to see how waste, chemicals and water use influence plants and animals.",
        image: "water-conservation-lab.jpg",
        alt: "A child using an interactive freshwater conservation display"
    },

    {
        habitat: "Little Rangers Village",
        name: "Supervised Animal Feeding",
        type: "Family Activity",
        short: "Help feed selected animals under keeper supervision.",
        full: "Younger visitors can safely feed approved animals while learning about nutrition and responsible animal care.",
        image: "animal-feeding.jpg",
        alt: "A child feeding a friendly animal with a keeper"
    },
    {
        habitat: "Little Rangers Village",
        name: "Junior Keeper Workshop",
        type: "Interactive Experience",
        short: "Learn how keepers care for animals every day.",
        full: "Children complete simple keeper tasks such as preparing food, identifying equipment and learning hygiene rules.",
        image: "junior-keeper.jpg",
        alt: "Children taking part in a supervised junior keeper workshop"
    },
    {
        habitat: "Little Rangers Village",
        name: "Animal Care Demonstration",
        type: "Educational Talk",
        short: "Watch a keeper demonstrate safe animal care.",
        full: "A keeper demonstrates grooming, health checks and respectful interaction with calm domestic animals.",
        image: "animal-care-demo.jpg",
        alt: "A keeper demonstrating animal care to children"
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