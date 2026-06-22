import sqlite3 from "sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databasePath = path.join(__dirname, "..", "park.db");
const sqlite = sqlite3.verbose();

const db = new sqlite.Database(databasePath);

const habitats = [
    {
        name: "Rainforest Canopy",
        slug: "rainforest-canopy",
        short_description:
            "Explore a tropical habitat filled with colourful birds, monkeys and rainforest wildlife.",
        full_description:
            "The Rainforest Canopy recreates a warm and humid tropical environment. Visitors can discover animals living at different levels of the forest while learning about biodiversity and rainforest conservation.",
        image_filename: "rainforest-canopy.jpg",
        image_alt:
            "A tropical rainforest habitat with dense green plants and a wooden visitor walkway"
    },
    {
        name: "Savannah Plains",
        slug: "savannah-plains",
        short_description:
            "Discover open grasslands inspired by the African savannah.",
        full_description:
            "The Savannah Plains provide large open spaces for wildlife and panoramic observation areas for visitors. The habitat explains how animals survive in hot climates and how conservation projects protect endangered species.",
        image_filename: "savannah-plains.jpg",
        image_alt:
            "Giraffes walking across an open grassland habitat"
    },
    {
        name: "Reptile Realm",
        slug: "reptile-realm",
        short_description:
            "Meet reptiles from different ecosystems in a safe and educational environment.",
        full_description:
            "Reptile Realm introduces visitors to snakes, lizards and other reptiles. Interactive displays explain their behaviour, habitats and importance within natural ecosystems.",
        image_filename: "reptile-realm.jpg",
        image_alt:
            "A green reptile resting on a branch inside a natural habitat"
    },
    {
        name: "Wetland Expedition",
        slug: "wetland-expedition",
        short_description:
            "Follow the wetland boardwalk and discover animals that depend on water.",
        full_description:
            "Wetland Expedition includes ponds, natural vegetation and observation points. Visitors can learn about wetland ecosystems, water conservation and the species that depend on these environments.",
        image_filename: "wetland-expedition.jpg",
        image_alt:
            "A wooden boardwalk crossing a green wetland habitat"
    }
];

db.serialize(() => {
    db.run("PRAGMA foreign_keys = ON");

    const insertHabitat = db.prepare(`
        INSERT OR IGNORE INTO habitats (
            name,
            slug,
            short_description,
            full_description,
            image_filename,
            image_alt
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    habitats.forEach((habitat) => {
        insertHabitat.run(
            habitat.name,
            habitat.slug,
            habitat.short_description,
            habitat.full_description,
            habitat.image_filename,
            habitat.image_alt
        );
    });

    insertHabitat.finalize();
});

db.close((error) => {
    if (error) {
        console.error("Error closing database:", error.message);
        return;
    }

    console.log("Habitat data added successfully.");
});