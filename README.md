# Resonar - Audio Podcast Gear Management & Analytics Studio

This is a premium, plain HTML/CSS/JS E-commerce template for an audio podcast gear store, featuring a studio-dark/retro-futuristic aesthetic.

## Features

- **Multi-page Architecture**: Home, Shop, Product Detail, Compare, Guides, Warranty, Cart, Services, About, Contact, Login, Register, Dashboard, 404.
- **360° Product Viewer**: Found on `product-detail.html`. It uses vanilla JS to scrub through a configured list of image frames.
- **Audio Spec Comparison**: A complex table with horizontal scrolling, sticky columns, and a "Best Value" highlighter on `compare.html`.
- **Noise-Cancellation Guide**: Detailed guide and an interactive helper tool on `guides.html`.
- **Instant Warranty Registration**: Client-side validated form with immediate feedback and mock storage on `warranty.html`.
- **Dashboard & Auth**: A client-side demonstration of authentication (`auth.js`) and a logged-in dashboard (`dashboard.js`) showing mock orders, warranties, and an analytics chart built with HTML5 Canvas.

## Setup & Usage

1. Open `index.html` in your browser. (Using a local server like `Live Server` in VS Code is recommended to avoid any `file://` CORS issues with modules or local storage).
2. The authentication is a **client-side demo** using `localStorage`. No actual backend is connected.
3. The cart and checkout processes are placeholders.
4. All product data, reviews, and specs are mock data.

## Note on 360° Viewer Images
The 360 viewer uses a JS array of image URLs to simulate rotation. In a production environment, you would supply a sequence of 36 to 72 high-quality rendered images of the product from different angles. It listens to drag events, touch events, and arrow keys. Auto-rotate respects the `prefers-reduced-motion` media query.

## Note on Auth & Dashboard
To test the dashboard:
1. Go to `register.html` and create an account.
2. You will be redirected to `login.html`. Log in with the same email.
3. You will be redirected to `dashboard.html`.
4. Warranty registrations made while logged in will show up in the dashboard.
