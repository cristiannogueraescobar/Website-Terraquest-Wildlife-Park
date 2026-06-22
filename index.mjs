import { getAll } from "./database/database.mjs";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
app.listen(PORT, () => {
    console.log(`TerraQuest server running at http://localhost:${PORT}`);
});