# Liberty Township Parks App 🌳

A comprehensive digital platform connecting 35,000+ residents to Liberty Township's parks through real-time event information, interactive maps, community engagement tools, and AI-powered recommendations.

![Liberty Township Parks](https://img.shields.io/badge/Status-Ready%20to%20Launch-success)
![React](https://img.shields.io/badge/React-18.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

## 📖 About

The Liberty Township Parks App was born from a real community need: reducing conflicts between park users while increasing engagement with Liberty Township's 7 beautiful parks. What started as a solution to help coordinate cross-country runners and dog walkers at Liberty Park has evolved into a comprehensive platform serving multiple townships.

### The Problem We're Solving

- **No centralized communication** - Residents don't know what's happening at parks or where
- **Navigation difficulties** - First-time visitors struggle to find amenities (~50% unaware of seasonal features)
- **Maintenance gaps** - Issues go unreported for days
- **Activity conflicts** - School teams, dog walkers, and families need better coordination

### The Solution

A mobile-optimized Progressive Web App (PWA) providing:
- Real-time event calendars with exact park locations
- Interactive GPS-enabled maps showing all amenities
- Community-powered issue reporting (Park Watch)
- Democratic voting on park improvements and events
- AI-powered park recommendations

---

## ✨ Key Features

### 📅 Event Calendar
- View daily and seasonal events across all parks
- See exact locations within each park
- Add your own community events
- Avoid scheduling conflicts with other groups

### 🗺️ Interactive Maps
- GPS-enabled navigation
- Custom thematic markers and category filters for specific sports (Baseball, Basketball, Volleyball, Tennis, Lacrosse, Cricket) alongside standard amenities (Parking, Trails, Bathrooms)
- Dynamic zoom-responsive trail scaling to maintain visual proportion
- Smooth boundary recentering to track user layout selection flawlessly
- Real-time location tracking
- Accessibility information

### 🔧 Park Watch
- One-tap issue reporting with photos
- Track resolution status
- Help rangers respond faster
- Report safety concerns or maintenance needs
- Community-powered park maintenance

### 🗳️ Community Voting
- **Monthly event polls** - Vote on next month's programming (outdoor movies, concerts, 5Ks)
- **Annual amenity voting** - Choose future park improvements (pickleball courts, playgrounds, etc.)
- See real-time results
- Township gets actionable data on community preferences

### ✨ AI Park Helper
- Get personalized park recommendations
- Type your goal: "I want to run with my dog and have a picnic"
- Receive match percentages for each park
- Discover underutilized parks
- Reduce congestion at popular locations

---

## 🏞️ Parks Covered

- **Liberty Park** (93 acres) - Trails, playgrounds, sports fields
- **South Liberty Park** (51 acres) - Wetlands, flexible fields
- **Hyatts Park** (4.3 acres) - Family-friendly amenities
- **Wedgewood Park** (9.8 acres) - Walking trails
- **Big Bear Park** (5 acres) - Trail connections
- **Havener Park** (93 acres) - Soccer fields, trails
- **Smith Preserve at Olentangy Falls** (41 acres) - Nature preserve
- **Patriot Park** (8.4 acres) - Dedicated public greenspace and community gathering



---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **Shadcn/ui** - Component library
- **Lucide React** - Icons
- **React Router** - Navigation

### Features
- **Progressive Web App (PWA)** - Works offline, installable
- **Responsive Design** - Mobile-first approach
- **Persistent Storage API** - Cross-session data storage
- **Web Workers** - Background processing

### State Management
- React Context API
- Local state with hooks



---

## 🎯 Roadmap

### ✅ Phase 1: Development (August 2025 – April 2026)

**Project Origin**
- [x] Identified a real coordination problem between runners, dog walkers, and park users at Liberty Park
- [x] Won a local hackathon with the initial concept
- [x] Pitched directly to Liberty Township trustees and received official backing

**Technical Architecture**
- [x] Built a production-grade Progressive Web App (PWA) on Vercel with Supabase backend
- [x] Developed 17,500+ lines of clean, production-quality code
- [x] Integrated Gmail API for seamless event management by township staff
- [x] Implemented offline mode for park areas with limited connectivity
- [x] Built push notification system for township announcements and event reminders

**Core Features Shipped**
- [x] Interactive maps covering all Liberty Township parks including Liberty Park and Havener Park
- [x] Accurate trail map overlays built from official Franklin County GIS data — correcting inaccuracies in Google Maps
- [x] Events calendar with real-time updates managed directly by township staff
- [x] Park Watch — community reporting feature for park conditions and incidents
- [x] Park Recommender — uses vector embeddings and cosine similarity to match users with the best park based on their preferences and activity type
- [x] Announcements system for township-wide communications
- [x] Push notifications for events and park updates
- [x] Privacy policy page and full legal documentation

**Official Recognition**
- [x] Officially adopted by Liberty Township government
- [x] Featured on Liberty Township's official Facebook page
- [x] Supported by Township Administrator Cathy Buehrer and Parks Supervisor Michael Landon
- [x] Serving 35,000+ Liberty Township residents

### 🔄 Phase 2: Beta Launch (April – May 2026)

**Beta Testing**
- [ ] Initial beta rollout at Liberty Park with target cohort of 50-100 users
- [ ] Structured feedback collection through in-app reporting and direct user surveys
- [ ] Iterative bug fixes and UI improvements based on real user behavior

**Features in Development**
- [ ] Photo upload capability for Park Watch — allowing park rangers and authorized staff to document and share park conditions directly in the app
- [ ] Event location maps — precise pin drops showing users exactly where events are happening within each park
- [ ] Fire department emergency locator integration — embedding official emergency marker coordinates provided by Liberty Township Fire Department throughout all park locations

**Metrics Target**
- [ ] 50-100 active beta users
- [ ] 10+ events posted by township staff
- [ ] Fire department integration live before soft launch

### 🚀 Phase 3: Soft Launch (May – June 2026)

**Township Promotion**
- [ ] Coordinated marketing push with Township Administrator Cathy Buehrer
- [ ] Township-guaranteed visibility to 5,000+ Liberty Township residents through official channels including newsletter, website, and social media
- [ ] Parks Supervisor Michael Landon actively managing events calendar

**Growth Initiatives**
- [ ] School partnerships with local high schools for user acquisition
- [ ] Press outreach to Columbus Dispatch and local media for feature coverage
- [ ] Word of mouth campaign through cross country and athletics programs — the original inspiration for the app

**Metrics Target**
- [ ] 500+ monthly active users
- [ ] 50+ events posted
- [ ] Press coverage secured

### 📈 Phase 4: Full Launch (Summer – Fall 2026)

**Scale**
- [ ] Full marketing campaign leveraging township support and press coverage
- [ ] Target: 2,000+ monthly active users
- [ ] Sustained engagement through regular events, park updates, and seasonal content

**Regional Expansion**
- [ ] Expansion conversations initiated with Delaware Township and City of Powell
- [ ] White-label architecture allowing full rebranding and customization for each new municipality
- [ ] Shared infrastructure model to reduce onboarding cost for neighboring communities

**Long Term Vision**
- [ ] Scale to serve all of northern Franklin County and Delaware County
- [ ] Establish a replicable model for civic tech parks apps across Ohio
- [ ] Open source core architecture for other communities to build on

---

## 🤝 Contributing

This project is currently maintained by Rishab Sriram and Thejan Nelahonne as part of a partnership with Liberty Township. 

### Repository Status
This is a closed-source project developed specifically for Liberty Township. **We do not accept pull requests or external code contributions.** The codebase is maintained exclusively by the core team.

### Reporting Issues
- Use the Park Watch feature within the app for park-related issues
- Use GitHub Issues strictly for reporting application bugs

---

## 📄 License

This project is proprietary software developed for Liberty Township, Ohio. All rights reserved.

For licensing inquiries, contact: rishabsr25@gmail.com or nelthejan@gmail.com

---

## 🙏 Acknowledgments

- **Liberty Township Parks Department** - For 10 years of dedication to park communication
- **Township Administrator Cathy Buehrer** - For championing this project
- **Liberty Township Trustees** - For their support and vision
- **30+ Community Survey Participants** - For validating the need
- **Liberty High School Cross Country Team** - Where this idea began

---

## 📞 Contact

**CTO:** Rishab Sriram  
**Email:** rishabsr25@gmail.com  
**School:** Olentangy Liberty High School, Class of 2027

**CFO:** Thejan Nelahonne
**Email:** nelthejan@gmail.com  
**School:** Olentangy Liberty High School, Class of 2027


**Township Contact:**  
Cathy Buehrer  
Liberty Township Parks Department  
[[Township website/contact info]](https://www.libertytwp.org/)

---

## 🎓 Project Background

This project was developed as part of a civic innovation initiative, winning the Powell Youth Council Policy Hackathon in 2025. It addresses a documented 10-year challenge in park communication and coordination.

The app aligns directly with the **Liberty 2040 Comprehensive Plan** goals for:
- Improved resident communication
- Enhanced park infrastructure
- Community engagement
- Sustainable growth

---

## 🔐 Privacy & Security

- Minimal data collection (name, email, location for park finder only)
- No payment processing
- Integration with existing township authentication systems
- Standard disclaimers and terms of service
- ADA compliant (screen readers, color contrast)

---

## 💰 Sustainability

**Development:** Free (student-led project)  
**Annual Costs:** $900-1,500 (hosting, cloud services)  
**Maintenance:** Free for 1.5 years (through graduation)

**Optional Revenue Streams:**
- Local business sponsorships
- Event listings
- Donations
- White-label licensing to other townships

---

## 📈 Impact

**By the Numbers:**
- 35,000+ potential users in Liberty Township
- 7 parks across 400+ acres
- 33% population growth expected by 2040

**Community Benefits:**
- Reduced park user conflicts
- Increased park utilization
- Data-driven decision making for improvements
- Enhanced community engagement
- Better resource allocation

## 📚 Learn More

- [Liberty 2040 Comprehensive Plan](https://regionalplanning.co.delaware.oh.us/wp-content/uploads/sites/17/2025/02/Liberty-2040-Adopted-2_10_25.pdf)

---

**Built with ❤️ for Liberty Township by Rishab Sriram and Thejan Nelahonne**

*Making parks more accessible, one feature at a time.*
