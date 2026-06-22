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
        name: "The Last Forest",
        slug: "the-last-forest",
        short_description:
            "Enter an Asian forest sanctuary created for threatened wildlife.",
        full_description:
            "The Last Forest recreates the dense forests and mountain landscapes of Asia. It provides carefully designed environments for threatened species while helping visitors understand habitat loss, illegal wildlife trade and conservation.",
        image_filename: "the-last-forest.jpg",
        image_alt:
            "A dense Asian forest habitat surrounded by trees, rocks and mist"
    },
    {
        name: "The Golden Reserve",
        slug: "the-golden-reserve",
        short_description:
            "Explore open African grasslands and meet some of the world’s most recognisable animals.",
        full_description:
            "The Golden Reserve is inspired by the African savannah. Large open areas, shaded shelters and observation points allow visitors to discover how animals survive and interact within this important ecosystem.",
        image_filename: "the-golden-reserve.jpg",
        image_alt:
            "African savannah grassland with wildlife beneath golden sunlight"
    },
    {
        name: "Predator Territory",
        slug: "predator-territory",
        short_description:
            "Observe powerful predators from secure and immersive viewing areas.",
        full_description:
            "Predator Territory introduces visitors to dangerous animals from different parts of the world. Each species is housed in a separate environment designed around its natural behaviour, welfare and security requirements.",
        image_filename: "predator-territory.jpg",
        image_alt:
            "A large predator walking through a secure naturalistic habitat"
    },
    {
        name: "River of Life",
        slug: "river-of-life",
        short_description:
            "Discover the wildlife that depends on rivers, wetlands and freshwater ecosystems.",
        full_description:
            "River of Life contains ponds, flowing water, wetland vegetation and observation paths. The habitat explains why freshwater ecosystems are important and how pollution and habitat destruction affect aquatic wildlife.",
        image_filename: "river-of-life.jpg",
        image_alt:
            "A wooden walkway passing through a green wetland and river habitat"
    },
    {
        name: "Little Rangers Village",
        slug: "little-rangers-village",
        short_description:
            "A supervised animal experience designed especially for younger visitors.",
        full_description:
            "Little Rangers Village gives children the opportunity to learn about animal care through safe and supervised activities. The area includes calm domestic animals, hand-washing facilities and clear guidance from trained keepers.",
        image_filename: "little-rangers-village.jpg",
        image_alt:
            "Children learning about friendly farm animals with a wildlife keeper"
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