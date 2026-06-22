import db, { getOne, runQuery } from "./database.mjs";

const events = [
    {
        category: "Conservation Workshop",
        title: "Forest Guardian Workshop",
        slug: "forest-guardian-workshop-2024",
        short:
            "Learn how conservation teams protect threatened forest species.",
        full:
            "Visitors take part in practical conservation activities, including habitat monitoring, identifying wildlife signs and understanding the threats faced by endangered forest animals.",
        date: "2024-04-20",
        time: "11:00",
        location: "The Last Forest",
        image: "forest-guardian-workshop.jpg",
        alt: "A conservation ranger teaching visitors about forest wildlife"
    },
    {
        category: "Family Activity",
        title: "Junior Keeper Day",
        slug: "junior-keeper-day-2024",
        short:
            "A supervised animal-care experience for younger visitors.",
        full:
            "Children learn how keepers prepare food, clean animal areas and monitor animal health through safe and supervised activities.",
        date: "2024-08-17",
        time: "10:30",
        location: "Little Rangers Village",
        image: "junior-keeper-day.jpg",
        alt: "Children taking part in a supervised keeper activity"
    },
    {
        category: "Night Experience",
        title: "Predators After Dark",
        slug: "predators-after-dark-2024",
        short:
            "Discover how nocturnal predators behave after sunset.",
        full:
            "Visitors explore secure viewing areas with specialist guides and learn how predators use sound, movement and low light to hunt and communicate.",
        date: "2024-10-26",
        time: "19:30",
        location: "Predator Territory",
        image: "predators-after-dark.jpg",
        alt: "Visitors observing a predator during an evening experience"
    },

    {
        category: "Educational Talk",
        title: "Saving the Black Rhino",
        slug: "saving-the-black-rhino-2025",
        short:
            "A ranger talk about rhino conservation and habitat protection.",
        full:
            "Conservation specialists explain how monitoring, protected reserves and anti-poaching programmes help protect black rhinoceros populations.",
        date: "2025-03-15",
        time: "13:00",
        location: "The Golden Reserve",
        image: "saving-black-rhino.jpg",
        alt: "A ranger presenting information about black rhinoceros conservation"
    },
    {
        category: "Seasonal Celebration",
        title: "Wetland Wildlife Festival",
        slug: "wetland-wildlife-festival-2025",
        short:
            "A family event celebrating freshwater habitats and wildlife.",
        full:
            "The festival includes keeper talks, wildlife observation activities and interactive demonstrations about clean water and wetland conservation.",
        date: "2025-06-21",
        time: "10:00",
        location: "River of Life",
        image: "wetland-wildlife-festival.jpg",
        alt: "Families attending a wetland wildlife conservation event"
    },
    {
        category: "Family Activity",
        title: "Little Rangers Autumn Trail",
        slug: "little-rangers-autumn-trail-2025",
        short:
            "Follow an autumn trail and complete wildlife challenges.",
        full:
            "Young visitors follow clues, identify animal tracks and complete simple conservation tasks around Little Rangers Village.",
        date: "2025-10-18",
        time: "11:00",
        location: "Little Rangers Village",
        image: "autumn-ranger-trail.jpg",
        alt: "Children following an autumn wildlife activity trail"
    },

    {
        category: "Educational Talk",
        title: "Voices of the Last Forest",
        slug: "voices-of-the-last-forest-2026",
        short:
            "Discover how sound is used to monitor forest wildlife.",
        full:
            "Rangers explain how camera traps, audio recorders and field observations help conservation teams study rare species without disturbing them.",
        date: "2026-02-14",
        time: "14:00",
        location: "The Last Forest",
        image: "voices-last-forest.jpg",
        alt: "A ranger demonstrating forest wildlife monitoring equipment"
    },
    {
        category: "Conservation Workshop",
        title: "River Rescue Workshop",
        slug: "river-rescue-workshop-2026",
        short:
            "Take part in activities focused on freshwater conservation.",
        full:
            "Visitors test water quality, identify pollution risks and learn how small actions can help protect rivers and wetlands.",
        date: "2026-05-09",
        time: "11:30",
        location: "River of Life",
        image: "river-rescue-workshop.jpg",
        alt: "Visitors testing water quality during a conservation workshop"
    },
    {
        category: "Family Activity",
        title: "Wildlife Guardian Family Day",
        slug: "wildlife-guardian-family-day-2026",
        short:
            "Complete conservation missions across the park.",
        full:
            "Families visit different habitats, complete wildlife challenges and learn how responsible choices can protect animals and ecosystems.",
        date: "2026-07-25",
        time: "10:00",
        location: "Across TerraQuest",
        image: "wildlife-guardian-day.jpg",
        alt: "A family completing a wildlife conservation challenge"
    },
    {
        category: "Night Experience",
        title: "Predator Territory Night Watch",
        slug: "predator-territory-night-watch-2026",
        short:
            "Observe predator behaviour during a guided evening experience.",
        full:
            "Specialist keepers guide visitors through secure observation areas and explain nocturnal behaviour, feeding patterns and predator welfare.",
        date: "2026-09-19",
        time: "19:00",
        location: "Predator Territory",
        image: "predator-night-watch.jpg",
        alt: "A predator moving through its habitat during an evening event"
    },
    {
        category: "Seasonal Celebration",
        title: "Golden Reserve Conservation Weekend",
        slug: "golden-reserve-conservation-weekend-2026",
        short:
            "A weekend celebrating African wildlife conservation.",
        full:
            "The programme includes ranger talks, interactive displays and family activities focused on protecting savannah habitats and threatened species.",
        date: "2026-11-14",
        time: "10:30",
        location: "The Golden Reserve",
        image: "golden-reserve-weekend.jpg",
        alt: "Visitors attending an African wildlife conservation event"
    }
];

async function seedEvents() {
    try {
        for (const event of events) {
            const category = await getOne(
                `
                    SELECT category_id
                    FROM event_categories
                    WHERE name = ?
                `,
                [event.category]
            );

            if (!category) {
                console.warn(`Category not found: ${event.category}`);
                continue;
            }

            const existingEvent = await getOne(
                "SELECT event_id FROM events WHERE slug = ?",
                [event.slug]
            );

            if (!existingEvent) {
                await runQuery(
                    `
                        INSERT INTO events (
                            category_id,
                            title,
                            slug,
                            short_description,
                            full_description,
                            event_date,
                            start_time,
                            location,
                            image_filename,
                            image_alt
                        )
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `,
                    [
                        category.category_id,
                        event.title,
                        event.slug,
                        event.short,
                        event.full,
                        event.date,
                        event.time,
                        event.location,
                        event.image,
                        event.alt
                    ]
                );
            }
        }

        console.log("Event data added successfully.");
    } catch (error) {
        console.error("Unable to add event data:", error.message);
    } finally {
        db.close();
    }
}

seedEvents();