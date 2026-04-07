export const cases = [
  {
    id: "01",
    title: "Mootery",
    category: "AUCTIONS PLATFORM",
    type: "Design",
    role: "UI/UX Designer",
    duration: "4 months",
    link: "",
    bgColor: "linear-gradient(135deg, #6B46C1 0%, #38A169 100%)",
    description:
      "Mootery is a high-end automotive auction platform that bridges the gap between luxury car collecting and cutting-edge financial technology.",
    stats: [
      { value: "Real-time", label: "BIDDING" },
      { value: "Instant", label: "FEEDBACK" },
      { value: "Secure", label: "WALLET" },
      { value: "Live", label: "INSIGHTS" },
      { value: "0% ", label: "BID LAG" },
      { value: "Multi", label: "MONITORING" },
    ],
    keyTakeaways: [
      {
        title: "Balancing Luxury and Urgency",
        content:
          "The challenge was to maintain a premium, high-end feel while incorporating the high-energy, fast-paced nature of real-time auctions. We achieved this through a sophisticated purple palette paired with strategic green accents that signal success and trust.",
      },
      {
        title: "Data Density without Cognitive Load",
        content:
          "Power users need to monitor multiple auctions and technical specs simultaneously. I designed a modular, high-density layout that uses 'Urgency Indicators' and visual hierarchies to help users make split-second decisions without feeling overwhelmed.",
      },
      {
        title: "Trust through Transparency",
        content:
          "In high-stakes bidding, trust is everything. We integrated live data visualizations, price trend graphs, and social proof elements like regional bidder flags to create a transparent environment where users feel confident in their investment.",
      },
    ],
    problem:
      "Existing auction platforms were either too cluttered for casual users or lacked the real-time data depth required by professional traders. There was a significant gap in the market for a platform that could handle complex financial data while feeling like a luxury experience.",
    approach:
      "I focused on a 'Command Center' methodology for the bidding experience, ensuring all critical controls are within reach, while using clean typography and spacious layouts for the web dashboard to cater to power users.",
    architecture:
      "The platform is built on a real-time data architecture that synchronizes bid states across mobile and web instantly. The UX architecture prioritizes information hierarchy, allowing for fast scanning of hundreds of listings.",
    designSystem:
      "A comprehensive design system was developed using a deep purple for exclusivity and a vibrant green for achievement. Custom icons and urgency-based status badges ensure a consistent visual language across all screen sizes.",
    prototyping:
      "High-fidelity prototypes were used to test the 'Bidding Control Center' gauge and real-time state changes, ensuring the gamified excitement felt responsive and rewarding.",
    testing:
      "User testing focused on the 'Buy Now' flow and multi-auction monitoring, refining the navigation to minimize fatigue and ensure no bidding opportunity is missed.",
    outcome:
      "Mootery successfully gamifies the auction process without losing its premium identity. It empowers both casual collectors and professional traders with the data and speed needed to dominate the luxury car market.",
    slug: "mootery",
    detailedSections: [
      {
        title: "Onboarding & Authentication",
        subTitle: "First Impressions & Seamless Access.",
        content:
          "Designed to minimize cognitive load. High-quality imagery creates immediate trust, while the authentication flow is optimized for speed, featuring a clear country-code selector and a high-contrast CTA to drive user conversion.",
        image: "/images/Projects/motoory/1.png",
      },
      {
        title: "Listing & Discovery (UX Architecture)",
        subTitle: "Information Hierarchy for Faster Decision Making.",
        content:
          "In a data-heavy environment, clarity is key. I designed the vehicle cards to highlight 'Urgency Indicators' (Live timers) and 'Status Badges' (Accident/Clean), allowing users to scan and evaluate hundreds of listings at a glance.",
        image: "/images/Projects/motoory/2.png",
      },
      {
        title: "Live Bidding Experience",
        subTitle: "Turning Auction Tension into Gamified Excitement.",
        content:
          "The heart of the app. I created a real-time 'Bidding Control Center' with a circular progress gauge for a visual representation of price increases. Color-coded states (Win/Outbid) provide instant feedback without requiring the user to read text.",
        image: "/images/Projects/motoory/3.png",
      },
      {
        title: "Dashboard & Digital Wallet",
        subTitle: "Transparent Financial Management.",
        content:
          "A simplified hub for tracking bids, wins, and losses. The wallet features an intuitive 'Subscription Tier' system (Silver/Gold) with smart progress bars to encourage upselling by showing exactly what’s needed for the next tier.",
        image: "/images/Projects/motoory/4.png",
      },
      {
        title: "Web UI - Advanced Search & Filters",
        subTitle: "Scaling the Experience for Power Users.",
        content:
          "The desktop version leverages the wide aspect ratio to provide persistent filters and side-by-side comparison. This layout is optimized for professional traders who need to monitor market trends and car specs simultaneously.",
        image: "/images/Projects/motoory/5.png",
      },
      {
        title: "Technical Specs & 'Buy Now' Feature",
        subTitle: "Deep Dive without the Clutter.",
        content:
          "Complex technical data (VIN, engine type, mileage) is organized using custom icons for easy visual scanning. I also integrated a secondary 'Buy Now' flow to cater to users looking for immediate acquisition outside the auction loop.",
        image: "/images/Projects/motoory/6.png",
      },
      {
        title: "Multi-Auction Monitoring Control",
        subTitle: "Empowering Users with Real-Time Data.",
        content:
          "For power users, I designed a specialized view that allows monitoring multiple active auctions on a single screen. This minimizes navigation fatigue and ensures no bidding opportunity is missed.",
        image: "/images/Projects/motoory/7.png",
      },
      {
        title: "Data Visualization & Social Proof",
        subTitle: "Building Trust through Live Insights.",
        content:
          "Integrated a dynamic price-trend graph to help bidders understand market value. The 'Recent Bidders' list with regional flags adds a layer of social proof and transparency, vital for the platform's credibility.",
        image: "/images/Projects/motoory/8.png",
      },
    ],
    colors: [
      { hex: "#6B46C1", name: "Primary Purple" },
      { hex: "#38A169", name: "Success Green" },
      { hex: "#1A202C", name: "Deep Onyx" },
      { hex: "#718096", name: "Steel Gray" },
    ],
    image: "/images/Projects/motoory/COVER.png",
    images: [
      "/images/Projects/motoory/1.png",
      "/images/Projects/motoory/2.png",
      "/images/Projects/motoory/3.png",
      "/images/Projects/motoory/4.png",
      "/images/Projects/motoory/5.png",
      "/images/Projects/motoory/6.png",
      "/images/Projects/motoory/7.png",
      "/images/Projects/motoory/8.png",
      "/images/Projects/motoory/COVER.png",
    ],
  },
  {
    id: "02",
    title: "BONUS Website",
    category: "WEBSITE",
    type: "Front-end",
    role: "Senior UX Engineer",
    duration: "3 months",
    link: "http://bonus.sa/",
    bgColor: "linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)",
    description:
      "Developing a high-performance interactive website with complex state management and custom UI components.",
    stats: [
      { value: "0.2s", label: "LATENCY" },
      { value: "15k+", label: "ACTIVE USERS" },
      { value: "95%", label: "UPTIME" },
      { value: "125%", label: "ROI" },
    ],
    problem:
      "The previous iteration was plagued by slow render times and a disconnected component library.",
    approach:
      "We implemented a 'Atomic Front-end' methodology, rebuilding the core architecture using React Concurrent Mode.",
    architecture:
      "The application utilizes a modular micro-service architecture for its front-end.",
    designSystem:
      "A specialized engineering-first design system was created, emphasizing data-density.",
    prototyping:
      "Rapid prototyping cycles were used to stress-test the state transitions of the dashboard.",
    testing:
      "Automated regression testing and unit tests reached 90% coverage across 20+ devices.",
    outcome:
      "The website achieved a 40% performance boost and scaled to handle 15k+ users.",
    slug: "bonus-app",
    image: "/images/Projects/thumbnails/3.png",
    images: [
      "/images/Projects/thumbnails/3.png",
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2670&auto=format&fit=crop",
    ],
  },
  {
    id: "03",
    title: "Places",
    category: "BOOKING ECOSYSTEM",
    type: "Design",
    role: "Lead Product Designer",
    duration: "8 months",
    link: "",
    bgColor: "linear-gradient(135deg, #ed5727 0%, #000000 100%)",
    description:
      "Places reimagines residential and hotel booking as a continuous journey — from discovery, to reservation, to physical access. Not a listing platform, but a decision ecosystem.",
    stats: [
      { value: "0", label: "FRICTION" },
      { value: "100%", label: "CONFIDENCE" },
      { value: "1-Tap", label: "ACCESS" },
      { value: "Loop", label: "SYSTEM" },
      { value: "Instant", label: "CONCIERGE" },
      { value: "24/7", label: "SMART CONTROL" },
    ],
    keyTakeaways: [
      {
        title: "Translating Complex Tech into Guest Comfort",
        content:
          "The biggest hurdle wasn't the UI; it was bridging the gap between physical keys and digital access. We realized that as builders, we understand the mechanics of Smart Access, but guests just want safety. Success came from answering unasked questions and translating complex IoT logic into human-centric actions that feel like hospitality, not just technology.",
      },
      {
        title: "Design System as a Hospitality Engine",
        content:
          "The unified Design System was a strategic business asset, not just a component library. Building it early gave the project the agility to expand from simple booking into full 'Smart Stay' services in weeks. I treated the design system as a technical engine that directly drove operational efficiency and ensured a consistent brand voice across every guest touchpoint.",
      },
      {
        title: "Architecture Built for Seamless Growth",
        content:
          "Designing for the future of travel taught us that architecture must be frictionless to survive rapid expansion. We prioritized guest intuition and technical scalability, ensuring that as 'Places' grew from a single listing into a global ecosystem, the user journey remained stable. I focused on a flexible foundation that allowed the product to evolve without technical or visual debt.",
      },
    ],
    problem:
      "Modern booking platforms create more confusion than clarity. Users are forced to scroll through endless options, jump between fragmented information, and make high-stress decisions with low trust. The result is not choice — it is overload.",
    approach:
      "Instead of increasing options, we reduce friction. Instead of pushing exploration, we guide decisions. We replaced traditional filters with a guided exploration layer: one intelligent search input and visual-first cards that speak faster than text.",
    architecture:
      "The product evolves from a booking tool into a stay companion system. We removed the gap between digital and physical entirely through structured digital access cards and instant actions for real-world execution.",
    designSystem:
      "Focuses on confidence through immersive visual storytelling and strong hierarchy. Each element is a compressed answer designed for fast scanning and instant understanding. The system emphasizes transactional clarity, using a split-view synchronized layout to reduce cognitive load during the checkout and stay management phases.",
    prototyping:
      "The most defining experience is the Smart Lock control. Users can lock/unlock in real time with instant status feedback and secure identity-based access flow, designed for one-tap interaction at arrival.",
    testing:
      "At checkout, the trust moment, every element is simplified with clear cost breakdown and human-readable policies to ensure reassurance rather than just persuasion.",
    outcome:
      "Places is a shift in how digital products influence real-world decisions. From fragmented choices to guided clarity. From browsing to deciding. From booking to control.",
    slug: "places",
    detailedSections: [
      {
        title: "Discovery — From Searching to Feeling",
        subTitle: "The first moment is not about search. It’s about direction.",
        content:
          "We replaced traditional filters with a guided exploration layer: one intelligent search input, visual-first cards that speak faster than text, and only meaningful signals like price, rating, and location. No noise. No distraction. Just clarity.",
        image: "/images/Projects/places/1.png",
      },
      {
        title: "Checkout — The Trust Moment",
        subTitle: "This is the most fragile point in the entire journey.",
        content:
          "Everything is simplified to ensure reassurance: clear, transparent cost breakdown, human-readable policies, and zero cognitive overload. At checkout, the goal is not persuasion — it is reassurance.",
        image: "/images/Projects/places/2.png",
      },
      {
        title: "In-Stay Services",
        subTitle: "Elevate your stay with ease.",
        content:
          "Request housekeeping, laundry, or maintenance directly from your room for a seamless experience. The product evolves from a booking tool into a stay companion system.",
        image: "/images/Projects/places/3.png",
      },
      {
        title: "THE SYSTEM THINKING",
        subTitle:
          "What makes Places different is not screens… it is the connection between them.",
        content:
          "Discovery → Decision → Booking → Access → Control. A single continuous loop. Places is not a booking redesign. It is a shift in how digital products influence real-world decisions. From fragmented choices to guided clarity. From browsing to deciding. From booking to control.",
        image: "/images/Projects/places/4.png",
      },
      {
        title: "Smart Stay: Redefining the Guest Journey",
        subTitle: "Simplifying arrival and stay.",
        content:
          "I designed this ecosystem to transform the traditional stay into a frictionless digital experience. By replacing physical keys with Smart Access and integrating an In-App Concierge, I eliminated common traveler 'pain points.'\n\nOur 'outside-the-box' approach ensures that every guest has total control—from unlocking their door to requesting services—with a single tap. It’s not just a booking app; it’s a seamless, tech-forward lifestyle designed for maximum comfort and efficiency.",
        image: "/images/Projects/places/5.png",
      },
      {
        title: "Listings — Decision at a Glance",
        subTitle:
          "Listings are no longer a catalog. They are a decision surface.",
        content:
          "Each card is designed as a compressed answer: what it looks like, what it costs, how good it is, and where it is. Everything else is intentionally hidden until needed. The result: fast scanning, instant understanding, and quicker decisions.",
        image: "/images/Projects/places/6.png",
      },
      {
        title: "Unit Details — From Information to Conviction",
        subTitle: "This is where hesitation is either resolved or created.",
        content:
          "The design focuses on confidence: immersive visual storytelling through imagery, a strong hierarchy that leads the eye naturally, and a persistent booking element that stays present without being intrusive.",
        image: "/images/Projects/places/7.png",
      },
      {
        title: "Frictionless Checkout: One-Step Payment Design",
        subTitle: "A shift in digital-to-physical influence.",
        content:
          "For the web experience, I designed a high-conversion checkout page that prioritizes speed and clarity. By consolidating all payment methods—including Credit Cards, Tamara, Tabby, and Qitaf—into a single, intuitive interface, we’ve eliminated the need for multi-step navigation. The layout features a synchronized split-view: the guest can review their booking summary and apply coupons on the right, while completing their payment and reviewing policies on the left. This One-Step approach reduces cognitive load, minimizes drop-offs, and ensures a transparent, secure, and world-class booking experience for every user..",
        image: "/images/Projects/places/8.png",
      },
      {
        title: "Data Visualization — System Insights",
        subTitle: "Seeing the unseen patterns.",
        content:
          "A high-fidelity data dashboard designed for operational clarity. By translating raw platform metrics into actionable visual signals, we empowered the business to monitor guest flows, booking trends, and system health in real-time. The interface emphasizes density without complexity, allowing for rapid decision-making at a systemic level.",
        image: "/images/Projects/places/data.png",
      },
    ],
    colors: [
      { hex: "#ed5727", name: "Burnt Orange" },
      { hex: "#000000", name: "Pitch Black" },
      { hex: "#333333", name: "Charcoal" },
      { hex: "#C0C0C0", name: "Silver" },
    ],
    image: "/images/Projects/places/1.png",
    images: [
      "/images/Projects/places/1.png",
      "/images/Projects/places/2.png",
      "/images/Projects/places/3.png",
      "/images/Projects/places/4.png",
      "/images/Projects/places/5.png",
      "/images/Projects/places/6.png",
      "/images/Projects/places/7.png",
      "/images/Projects/places/8.png",
      "/images/Projects/places/data.png",
    ],
  },
  {
    id: "04",
    title: "TTS Website",
    category: "WEBSITE",
    type: "Front-end",
    role: "Lead Platform Engineer",
    duration: "5 months",
    link: "https://mytts.sa/",
    bgColor: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)",
    description:
      "Building the core front-end foundation for a complex technical tracking and sequencing website.",
    stats: [
      { value: "1.2s", label: "LOAD TIME" },
      { value: "100%", label: "ACCESSIBILITY" },
      { value: "48ms", label: "INTERACTION" },
      { value: "3x", label: "SPEED" },
    ],
    problem:
      "Translating high-frequency tracking logic into a manageable, responsive interface.",
    approach:
      "We used a 'Functional UI' strategy, strictly typing every interaction.",
    architecture:
      "The architecture is built on a custom internal component library.",
    designSystem:
      "A high-contrast 'Command-Center' aesthetic was adopted to reduce eye fatigue.",
    prototyping:
      "Interactive Gantt-style charts and tracking timelines were prototyped.",
    testing:
      "Intensive QA testing across legacy and modern browser versions ensured global stability.",
    outcome:
      "The TTS website now serves as the primary tracking engine for a global logistics network.",
    slug: "tts-platform",
    image: "/images/Projects/thumbnails/2.png",
    images: [
      "/images/Projects/thumbnails/2.png",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2670&auto=format&fit=crop",
    ],
  },
];
