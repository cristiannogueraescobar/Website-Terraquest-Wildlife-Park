import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getAll, getOne, runQuery } from "./database/database.mjs";

const app = express();
const PORT = 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.render("index", {
        pageTitle: "Home"
    });
});

app.get("/habitats", async (req, res) => {
    try {
        const habitats = await getAll(`
            SELECT
                habitat_id,
                name,
                slug,
                short_description,
                image_filename,
                image_alt
            FROM habitats
            ORDER BY habitat_id
        `);

        res.render("habitats", {
            pageTitle: "Habitats",
            habitats
        });
    } catch (error) {
        console.error("Unable to retrieve habitats:", error.message);
        res.status(500).send("Unable to load habitats.");
    }
});

app.get("/habitats/:slug", async (req, res) => {
    try {
        const habitat = await getOne(
            `
                SELECT *
                FROM habitats
                WHERE slug = ?
            `,
            [req.params.slug]
        );

        if (!habitat) {
            return res.status(404).send("Habitat not found.");
        }

        const experiences = await getAll(
            `
                SELECT
                    experience_id,
                    name,
                    experience_type,
                    short_description
                FROM experiences
                WHERE habitat_id = ?
                ORDER BY experience_id
            `,
            [habitat.habitat_id]
        );

        res.render("habitat-details", {
            pageTitle: habitat.name,
            habitat,
            experiences
        });
    } catch (error) {
        console.error("Unable to retrieve habitat:", error.message);
        res.status(500).send("Unable to load habitat.");
    }
});

app.get("/experiences", async (req, res) => {
    try {
        const experiences = await getAll(`
            SELECT
                experiences.experience_id,
                experiences.name,
                experiences.experience_type,
                experiences.short_description,
                habitats.name AS habitat_name,
                habitats.slug AS habitat_slug
            FROM experiences
            INNER JOIN habitats
                ON experiences.habitat_id = habitats.habitat_id
            ORDER BY habitats.habitat_id, experiences.experience_id
        `);

        res.render("experiences", {
            pageTitle: "Experiences",
            experiences
        });
    } catch (error) {
        console.error("Unable to retrieve experiences:", error.message);
        res.status(500).send("Unable to load experiences.");
    }
});

app.get("/faq", async (req, res) => {
    try {
        const faqs = await getAll(`
            SELECT
                faq_id,
                question,
                answer
            FROM faqs
            ORDER BY display_order
        `);

        res.render("faq", {
            pageTitle: "FAQ",
            faqs
        });
    } catch (error) {
        console.error("Unable to retrieve FAQs:", error.message);
        res.status(500).send("Unable to load frequently asked questions.");
    }
});

app.get("/contact", (req, res) => {
    res.render("contact", {
        pageTitle: "Contact"
    });
});

app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, subject, message, consent } = req.body;

        const trimmedName = name?.trim();
        const trimmedEmail = email?.trim();
        const trimmedSubject = subject?.trim();
        const trimmedMessage = message?.trim();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !trimmedName ||
            trimmedName.length < 2 ||
            trimmedName.length > 80
        ) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid name."
            });
        }

        if (!emailPattern.test(trimmedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        if (!trimmedSubject || trimmedSubject.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Please select a valid subject."
            });
        }

        if (
            !trimmedMessage ||
            trimmedMessage.length < 10 ||
            trimmedMessage.length > 1000
        ) {
            return res.status(400).json({
                success: false,
                message: "Your message must contain between 10 and 1000 characters."
            });
        }

        if (consent !== true) {
            return res.status(400).json({
                success: false,
                message: "Please confirm that your information may be processed."
            });
        }

        await runQuery(
            `
                INSERT INTO contact_messages (
                    name,
                    email,
                    subject,
                    message
                )
                VALUES (?, ?, ?, ?)
            `,
            [
                trimmedName,
                trimmedEmail,
                trimmedSubject,
                trimmedMessage
            ]
        );

        res.status(201).json({
            success: true,
            message: "Thank you. Your message has been received."
        });
    } catch (error) {
        console.error("Unable to save contact message:", error.message);

        res.status(500).json({
            success: false,
            message: "Your message could not be sent. Please try again."
        });
    }
});
app.get("/activity", (req, res) => {
    res.render("activity", {
        pageTitle: "Wildlife Rescue Mission"
    });
});

app.get("/events", async (req, res) => {
    try {
        const categories = await getAll(`
            SELECT
                category_id,
                name,
                slug
            FROM event_categories
            ORDER BY name
        `);

        res.render("events", {
            pageTitle: "Events",
            categories,
            currentYear: new Date().getFullYear()
        });
    } catch (error) {
        console.error("Unable to load events page:", error.message);
        res.status(500).send("Unable to load events.");
    }
});

app.get("/api/events", async (req, res) => {
    try {
        const selectedYear = Number.parseInt(req.query.year, 10);
        const selectedCategory = req.query.category?.trim() || "";

        if (!Number.isInteger(selectedYear)) {
            return res.status(400).json({
                success: false,
                message: "A valid year is required."
            });
        }

        let sql = `
            SELECT
                events.event_id,
                events.title,
                events.slug,
                events.short_description,
                events.event_date,
                events.start_time,
                events.location,
                events.image_filename,
                events.image_alt,
                event_categories.name AS category_name,
                event_categories.slug AS category_slug
            FROM events
            INNER JOIN event_categories
                ON events.category_id = event_categories.category_id
            WHERE strftime('%Y', events.event_date) = ?
        `;

        const parameters = [String(selectedYear)];

        if (selectedCategory) {
            sql += `
                AND event_categories.slug = ?
            `;

            parameters.push(selectedCategory);
        }

        sql += `
            ORDER BY events.event_date, events.start_time
        `;

        const events = await getAll(sql, parameters);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const formattedEvents = events.map((event) => {
            const eventDate = new Date(`${event.event_date}T00:00:00`);

            return {
                ...event,
                status: eventDate < today ? "Past event" : "Upcoming event"
            };
        });

        res.json({
            success: true,
            events: formattedEvents
        });
    } catch (error) {
        console.error("Unable to retrieve events:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve events."
        });
    }
});

app.listen(PORT, () => {
    console.log(`TerraQuest server running at http://localhost:${PORT}`);
});