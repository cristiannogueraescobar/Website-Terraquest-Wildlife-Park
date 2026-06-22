import db, { getOne, runQuery } from "./database.mjs";

const events = [
    {
        category: "Educational Talk",
        title: "Rhino Conservation Talk",
        slug: "rhino-conservation-talk-2026",
        short: "Learn how conservation teams protect rhinoceroses.",
        full: "A TerraQuest ranger explains habitat protection, monitoring and anti-poaching work.",
        type: "recurring",
        startDate: "2026-01-01",
        endDate: "2026-12-31",
        time: "13:00",
        recurrence: "Every Thursday",
        day: "Thursday",
        location: "The Golden Reserve",
        image: "rhino-conservation-talk.jpg",
        alt: "A ranger presenting information about rhinoceros conservation"
    },
    {
        category: "Family Activity",
        title: "Junior Keeper Workshop",
        slug: "junior-keeper-workshop-2026",
        short: "A supervised animal-care activity for younger visitors.",
        full: "Children learn how keepers prepare food, check animal areas and follow hygiene rules.",
        type: "recurring",
        startDate: "2026-01-01",
        endDate: "2026-12-31",
        time: "11:00",
        recurrence: "Every Saturday",
        day: "Saturday",
        location: "Little Rangers Village",
        image: "junior-keeper-workshop.jpg",
        alt: "Children taking part in a supervised animal-care workshop"
    },
    {
        category: "Conservation Workshop",
        title: "River Rescue Activity",
        slug: "river-rescue-activity-2026",
        short: "Explore how pollution affects freshwater wildlife.",
        full: "Visitors test water quality and learn how rivers and wetlands can be protected.",
        type: "recurring",
        startDate: "2026-01-01",
        endDate: "2026-12-31",
        time: "12:00",
        recurrence: "Every Sunday",
        day: "Sunday",
        location: "River of Life",
        image: "river-rescue-activity.jpg",
        alt: "Visitors testing water quality during a river conservation activity"
    },
    {
        category: "Night Experience",
        title: "Predator Night Watch",
        slug: "predator-night-watch-2026",
        short: "Observe predator behaviour during a guided evening experience.",
        full: "Specialist keepers explain nocturnal behaviour, feeding routines and animal welfare.",
        type: "recurring",
        startDate: "2026-04-01",
        endDate: "2026-10-31",
        time: "19:00",
        recurrence: "Every Friday evening",
        day: "Friday",
        location: "Predator Territory",
        image: "predator-night-watch.jpg",
        alt: "Visitors observing a predator during an evening experience"
    },
    {
        category: "Educational Talk",
        title: "Voices of the Last Forest",
        slug: "voices-of-the-last-forest-2026",
        short: "Discover how sound is used to monitor rare forest animals.",
        full: "Rangers demonstrate audio recorders, camera traps and wildlife tracking methods.",
        type: "recurring",
        startDate: "2026-02-01",
        endDate: "2026-11-30",
        time: "14:00",
        recurrence: "Every Tuesday",
        day: "Tuesday",
        location: "The Last Forest",
        image: "voices-last-forest.jpg",
        alt: "A ranger demonstrating wildlife monitoring equipment"
    },
    {
        category: "Seasonal Celebration",
        title: "Golden Reserve Conservation Weekend",
        slug: "golden-reserve-conservation-weekend-2026",
        short: "A weekend celebrating African wildlife conservation.",
        full: "The programme includes ranger talks, family activities and conservation displays.",
        type: "special",
        startDate: "2026-08-15",
        endDate: "2026-08-16",
        time: "10:00",
        recurrence: null,
        day: null,
        location: "The Golden Reserve",
        image: "golden-reserve-weekend.jpg",
        alt: "Visitors attending an African wildlife conservation event"
    },
    {
        category: "Seasonal Celebration",
        title: "Wetland Wildlife Festival",
        slug: "wetland-wildlife-festival-2025",
        short: "A past festival celebrating freshwater habitats.",
        full: "The festival included keeper talks, wildlife observation and conservation demonstrations.",
        type: "special",
        startDate: "2025-06-21",
        endDate: "2025-06-22",
        time: "10:00",
        recurrence: null,
        day: null,
        location: "River of Life",
        image: "wetland-wildlife-festival.jpg",
        alt: "Families attending a wetland wildlife festival"
    },
    {
        category: "Family Activity",
        title: "Little Rangers Animal Care",
        slug: "little-rangers-animal-care-2025",
        short: "A weekly supervised animal-care activity.",
        full: "Children learned about grooming, feeding and respectful animal interaction.",
        type: "recurring",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        time: "11:30",
        recurrence: "Every Saturday",
        day: "Saturday",
        location: "Little Rangers Village",
        image: "animal-care-2025.jpg",
        alt: "Children learning about animal care with a keeper"
    },
    {
        category: "Night Experience",
        title: "Predators After Dark",
        slug: "predators-after-dark-2024",
        short: "A past guided evening predator experience.",
        full: "Visitors explored secure viewing areas and learned about nocturnal predators.",
        type: "recurring",
        startDate: "2024-05-01",
        endDate: "2024-10-31",
        time: "19:30",
        recurrence: "Every Friday evening",
        day: "Friday",
        location: "Predator Territory",
        image: "predators-after-dark.jpg",
        alt: "Visitors observing a predator during an evening event"
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
                            event_type,
                            start_date,
                            end_date,
                            start_time,
                            recurrence_text,
                            day_of_week,
                            location,
                            image_filename,
                            image_alt
                        )
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `,
                    [
                        category.category_id,
                        event.title,
                        event.slug,
                        event.short,
                        event.full,
                        event.type,
                        event.startDate,
                        event.endDate,
                        event.time,
                        event.recurrence,
                        event.day,
                        event.location,
                        event.image,
                        event.alt
                    ]
                );
            }
        }

        console.log("Recurring and special event data added successfully.");
    } catch (error) {
        console.error("Unable to add event data:", error.message);
    } finally {
        db.close();
    }
}

seedEvents();