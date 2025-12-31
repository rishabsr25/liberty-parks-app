# Liberty Township Parks App 🌳

A comprehensive digital platform connecting 35,000+ residents to Liberty Township's parks through real-time event information, interactive maps, community engagement tools, and AI-powered recommendations.

![Liberty Township Parks](https://img.shields.io/badge/Status-In%20Development-yellow)
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
- Get push notifications for upcoming activities
- Avoid scheduling conflicts with other groups

### 🗺️ Interactive Maps
- GPS-enabled navigation
- Find bathrooms, water fountains, trails, parking, benches
- Trail difficulty ratings and distances
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

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/liberty-township-parks-app.git

# Navigate to project directory
cd liberty-township-parks-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:
```env
VITE_API_URL=your_api_url
VITE_MAPS_API_KEY=your_maps_api_key
```

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

## 📁 Project Structure
```
src/
├── components/
│   ├── ui/              # Reusable UI components (Button, Card, etc.)
│   ├── cards/           # Specific card components (ParkCard, EventCard)
│   ├── sections/        # Page sections (HeroSection, FeaturesSection)
│   ├── Header.jsx
│   └── Footer.jsx
├── data/
│   ├── parks.js         # Park data and information
│   ├── features.js      # App features configuration
│   ├── events.js        # Event data
│   └── stats.js         # Statistics and metrics
├── pages/
│   ├── Index.jsx        # Landing page
│   ├── Map.jsx          # Interactive maps
│   ├── Calendar.jsx     # Event calendar
│   ├── Voting.jsx       # Community voting
│   ├── AIHelper.jsx     # AI recommendations
│   └── Report.jsx       # Issue reporting
├── lib/
│   └── utils.js         # Utility functions
└── App.jsx              # Main app component
```

---

## 🎯 Roadmap

### Phase 1: Pilot (Months 1-5) 
- [x] Core feature development
- [x] Working prototype
- [ ] Liberty Park beta testing (50-100 users)
- [ ] Collect initial metrics

### Phase 2: Soft Launch (Months 6-7)
- [ ] Expand to all Liberty Township parks
- [ ] Township-wide promotion
- [ ] Target: 500+ users, 50+ events posted

### Phase 3: Full Launch (Month 8+)
- [ ] Marketing campaign
- [ ] School partnerships
- [ ] Target: 2,000+ active users

### Phase 4: Regional Expansion
- [ ] Multi-township collaboration
- [ ] White-label architecture
- [ ] Scale to neighboring communities

---

## 🤝 Contributing

This project is currently maintained by Rishab Sriram and Thejan Nelahonne as part of a partnership with Liberty Township. 

### Reporting Issues
- Use the Park Watch feature for park-related issues
- Use GitHub Issues for app bugs or feature requests

### Development Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary software developed for Liberty Township, Ohio. All rights reserved.

For licensing inquiries, contact: rishabsr25@gmail.com

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

**CFO** THejan Nelahonne
**Email:** nelthejan@gmail.com  
**School:** Olentangy Liberty High School, Class of 2027


**Township Contact:**  
Liberty Township Parks Department  
[Township website/contact info]

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
**Maintenance:** Free for 2.5 years (through graduation)

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