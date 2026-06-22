import sqlite3 from "sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databasePath = path.join(__dirname, "..", "park.db");
const sqlite = sqlite3.verbose();

const db = new sqlite.Database(databasePath, (error) => {
    if (error) {
        console.error("Database connection failed:", error.message);
        return;
    }

    console.log("Connected to the TerraQuest database.");
});

db.serialize(() => {
    db.run("PRAGMA foreign_keys = ON");

    db.run(`
        CREATE TABLE IF NOT EXISTS habitats (
            habitat_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            slug TEXT NOT NULL UNIQUE,
            short_description TEXT NOT NULL,
            full_description TEXT NOT NULL,
            image_filename TEXT NOT NULL,
            image_alt TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS experiences (
            experience_id INTEGER PRIMARY KEY AUTOINCREMENT,
            habitat_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            experience_type TEXT NOT NULL,
            short_description TEXT NOT NULL,
            full_description TEXT NOT NULL,
            image_filename TEXT NOT NULL,
            image_alt TEXT NOT NULL,
            FOREIGN KEY (habitat_id)
                REFERENCES habitats(habitat_id)
                ON DELETE CASCADE
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS event_categories (
            category_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            slug TEXT NOT NULL UNIQUE
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS events (
            event_id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            slug TEXT NOT NULL UNIQUE,
            short_description TEXT NOT NULL,
            full_description TEXT NOT NULL,
            event_date TEXT NOT NULL,
            start_time TEXT NOT NULL,
            location TEXT NOT NULL,
            image_filename TEXT NOT NULL,
            image_alt TEXT NOT NULL,
            FOREIGN KEY (category_id)
                REFERENCES event_categories(category_id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS faqs (
            faq_id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            display_order INTEGER NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS contact_messages (
            message_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

db.close((error) => {
    if (error) {
        console.error("Error closing database:", error.message);
        return;
    }

    console.log("Database tables created successfully.");
});