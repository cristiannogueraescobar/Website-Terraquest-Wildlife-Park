"use strict";

const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

function showError(fieldName, message) {
    const errorElement = document.querySelector(`#${fieldName}-error`);

    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearErrors() {
    document.querySelectorAll(".field-error").forEach((element) => {
        element.textContent = "";
    });

    formStatus.textContent = "";
    formStatus.className = "form-status";
}

function validateForm(formData) {
    let isValid = true;

    const name = formData.get("name").trim();
    const email = formData.get("email").trim();
    const subject = formData.get("subject").trim();
    const message = formData.get("message").trim();
    const consent = formData.get("consent");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name.length < 2 || name.length > 80) {
        showError("name", "Enter a name between 2 and 80 characters.");
        isValid = false;
    }

    if (!emailPattern.test(email)) {
        showError("email", "Enter a valid email address.");
        isValid = false;
    }

    if (!subject) {
        showError("subject", "Select a subject.");
        isValid = false;
    }

    if (message.length < 10 || message.length > 1000) {
        showError(
            "message",
            "Enter a message between 10 and 1000 characters."
        );

        isValid = false;
    }

    if (!consent) {
        showError("consent", "You must confirm your consent.");
        isValid = false;
    }

    return isValid;
}

contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearErrors();

    const formData = new FormData(contactForm);

    if (!validateForm(formData)) {
        formStatus.textContent = "Please correct the highlighted fields.";
        formStatus.classList.add("form-status-error");
        return;
    }

    const formInformation = {
        name: formData.get("name").trim(),
        email: formData.get("email").trim(),
        subject: formData.get("subject"),
        message: formData.get("message").trim(),
        consent: formData.get("consent") === "on"
    };

    try {
        const response = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formInformation)
        });

        const result = await response.json();

        formStatus.textContent = result.message;

        if (!response.ok) {
            formStatus.classList.add("form-status-error");
            return;
        }

        formStatus.classList.add("form-status-success");
        contactForm.reset();
    } catch (error) {
        console.error("Contact form request failed:", error);

        formStatus.textContent =
            "The message could not be sent. Please try again.";

        formStatus.classList.add("form-status-error");
    }
});