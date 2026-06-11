# Plumbify Marketing Website

This is the official marketing website and front-end client for Plumbify, the
AI-first operating system designed to automate administrative tasks, bookings,
and payments for plumbing businesses.

The site is built with Next.js 14 (App Router) and Tailwind CSS, featuring a
fully responsive design, ROI calculator, and an interactive AI Sales Agent.

---

## Features

Plumbify integrates state-of-the-art AI tooling to automate back-office workflows
and qualify new business leads in real-time.

*   **Floating AI Sales Agent**: A 24/7 multilingual demo assistant that explains
    plumbing features, runs interactive live dashboards, and answers inquiries.
*   **Interactive Phone Simulator**: Demonstrates how missed calls trigger instant
    SMS auto text-backs to secure plumbing bookings before clients leave.
*   **Dynamic ROI Calculator**: Estimates month-over-month revenue savings based
    on average ticket size, monthly dispatch volume, and call-abandonment rates.
*   **Pricing Checkout Integration**: Simple checkout triggers for Starter ($197)
    and Growth ($397) subscription tiers.

---

## Technical architecture

The project utilizes modern web technologies to achieve high-performance landing
pages and seamless customer lead routing.

*   **Core**: Next.js 14.1 (App Router) using React 18.2.
*   **Styling**: Tailwind CSS with custom utility components (`glass-card`,
    `bento-item`).
*   **Lead Syncing**: Secure server-side routes capture prospect inquiries and
    post them directly to GoHighLevel (GHL) APIs.

---

## AI Sales Agent widget

The floating AI Sales Agent is integrated globally in the root layout. It behaves
similarly to the Naoma AI demo system to guide users through Plumbify's value.

### Key capabilities

1.  **Multilingual Support**: Supports English (US), Traditional Chinese (zh-TW),
    Spanish (ES), and French (FR).
2.  **Text-To-Speech (TTS)**: Spoken voice synthesis via the browser's native
    `speechSynthesis` API, matching the user's selected language.
3.  **Visual Dashboard Sync**: Updates a mock phone screen, scheduler board, or
    billing invoice in real-time as the conversation changes topics.
4.  **Lead Qualification Form**: Gathers contact details (first name, last name,
    email, phone, company) and submits them to the GHL api route.
5.  **Calendar Integration**: Directly synchronizes the qualified leads with GHL
    calendars.

---

## Local development

Follow these steps to run the marketing platform locally on your machine.

### Prerequisites

*   Node.js 18+ (LTS recommended)
*   NPM (comes with Node.js)
*   A configured `.env.local` containing GHL tokens.

### Running the server

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Configure environment variables:
    ```bash
    cp .env.example .env.local
    ```
    Ensure you specify the `GHL_PRIVATE_TOKEN` and `GHL_LOCATION_ID`.
3.  Launch the development server:
    ```bash
    npm run dev
    ```
4.  Open `http://localhost:3000` in your web browser.

---

## External integration (GoHighLevel funnels & sites)

You can embed this AI Sales Agent widget on any external website, including
GoHighLevel funnels, websites, WordPress, or Shopify.

### Code snippet

Add the following script tag to your site's header, body, or GHL's custom
JS/HTML settings:

```html
<script src="https://your-plumbify-domain.vercel.app/widget.js"></script>
```

### How it works

*   The `widget.js` script dynamically creates a secure iframe targeting your
    deployed `/widget-embed` page.
*   It places a floating active bubble in the bottom right corner.
*   When a visitor clicks the bubble, it automatically resizes to desktop or
    mobile layout specs smoothly.

