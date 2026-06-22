import db, { getOne, runQuery } from "./database.mjs";

const categories = [
    {
        name: "Conservation Workshop",
        slug: "conservation-workshop"
    },
    {
        name: "Family Activity",
        slug: "family-activity"
    },
    {
        name: "Educational Talk",
        slug: "educational-talk"
    },
    {
        name: "Seasonal Celebration",
        slug: "seasonal-celebration"
    },
    {
        name: "Night Experience",
        slug: "night-experience"
    }
];

async function seedEventCategories() {
    try {
        for (const category of categories) {
            const existingCategory = await getOne(
                "SELECT category_id FROM event_categories WHERE slug = ?",
                [category.slug]
            );

            if (!existingCategory) {
                await runQuery(
                    `
                        INSERT INTO event_categories (
                            name,
                            slug
                        )
                        VALUES (?, ?)
                    `,
                    [category.name, category.slug]
                );
            }
        }

        console.log("Event categories added successfully.");
    } catch (error) {
        console.error(
            "Unable to add event categories:",
            error.message
        );
    } finally {
        db.close();
    }
}

seedEventCategories();