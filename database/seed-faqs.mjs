import db, { getOne, runQuery } from "./database.mjs";

const faqs = [
    {
        question: "What are the park opening times?",
        answer:
            "TerraQuest is open every day from 9:00am until 6:00pm.",
        order: 1
    },
    {
        question: "Is TerraQuest suitable for young children?",
        answer:
            "Yes. Little Rangers Village is designed for younger visitors and includes supervised educational activities.",
        order: 2
    },
    {
        question: "Can visitors interact with the animals?",
        answer:
            "Direct interaction is only available with selected domestic animals in Little Rangers Village and always under keeper supervision.",
        order: 3
    },
    {
        question: "Are dangerous animals kept safely?",
        answer:
            "Yes. Dangerous species are kept in secure habitats with reinforced viewing areas and no direct public contact.",
        order: 4
    },
    {
        question: "Is the park accessible for wheelchair users?",
        answer:
            "The main paths, viewing areas and visitor facilities are designed to support wheelchair access.",
        order: 5
    },
    {
        question: "Can visitors bring their own food?",
        answer:
            "Visitors may bring food, but it must only be eaten in designated picnic areas.",
        order: 6
    },
    {
        question: "Are assistance dogs permitted?",
        answer:
            "Registered assistance dogs are permitted in suitable visitor areas. Some animal zones may have restrictions for welfare reasons.",
        order: 7
    },
    {
        question: "What should visitors wear?",
        answer:
            "Comfortable footwear and weather-appropriate clothing are recommended because several experiences take place outdoors.",
        order: 8
    },
    {
        question: "What happens during bad weather?",
        answer:
            "Some outdoor activities may be adjusted, but indoor exhibits, talks and sheltered viewing areas remain available.",
        order: 9
    },
    {
        question: "How can I contact TerraQuest?",
        answer:
            "Visitors can use the contact form on the website to send questions or accessibility enquiries.",
        order: 10
    }
];

async function seedFaqs() {
    try {
        for (const faq of faqs) {
            const existingFaq = await getOne(
                "SELECT faq_id FROM faqs WHERE question = ?",
                [faq.question]
            );

            if (!existingFaq) {
                await runQuery(
                    `
                        INSERT INTO faqs (
                            question,
                            answer,
                            display_order
                        )
                        VALUES (?, ?, ?)
                    `,
                    [faq.question, faq.answer, faq.order]
                );
            }
        }

        console.log("FAQ data added successfully.");
    } catch (error) {
        console.error("Unable to add FAQ data:", error.message);
    } finally {
        db.close();
    }
}

seedFaqs();