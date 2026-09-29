# ResumeForge — AI Resume Builder & Template Marketplace

A modern, production-grade AI-powered resume builder and template marketplace built with **React**, **TypeScript**, **Tailwind CSS**, and **Vite**.

Designed with inspiration from Canva, Adobe Express, and Resume.io, ResumeForge empowers students, developers, designers, and professionals to craft ATS-optimized resumes with 12 distinct templates, real-time live preview, Canva-like styling controls, online motion animations, and vector PDF exports.

---

## ✨ Key Features

### 1. Unified 12-Template Engine (Zero Data Loss)
Switch between 12 distinct visual layouts without re-entering your information:
1. **Modern Blue**: Clean header, royal blue accents, balanced typography, modern skill tags.
2. **Minimal Black**: Swiss typographic purity, monochrome contrast (#09090b), minimalist dividers.
3. **Developer Dark**: High-tech developer theme, dark slate terminal header, cyan accents, monospace cues.
4. **Professional Navy**: Corporate executive style, deep navy headers, timeless serif accents.
5. **Executive**: Warm gold/brass accents, prominent executive profile block, timeline milestone dots.
6. **Creative Purple**: Indigo & violet gradient header, rounded avatar, pill tags, visual project showcases.
7. **ATS Simple**: Single-column 100% machine-scannable format, standard headings, maximum extractability.
8. **Fresh Graduate**: Highlights Education & Academic Coursework at top, followed by Projects and Internships.
9. **Two Column Modern**: Asymmetrical 32/68 split layout with left panel for contact, skills, and languages.
10. **Elegant Gray**: Subtle slate/charcoal tones, airy letter spacing, refined editorial luxury aesthetic.
11. **AI Engineer**: Tailored for AI/ML & Data Science, highlighting ML matrix, model architectures, and training metrics.
12. **Academic CV**: Scholarly formal layout with serif typography (Merriweather), publications, and research.

### 2. Canva-Like Drag & Drop Customization System
- **Colors**: 8 preset palettes (Professional Blue, Corporate Navy, Minimal Black, Emerald Green, Creative Purple, Warm Amber, Ruby Crimson, Slate Gray) + custom color pickers.
- **Typography**: Inter, Plus Jakarta Sans, Roboto, Poppins, Montserrat, Lato, Merriweather, JetBrains Mono; font size scaling, line height controls.
- **Layout & Spacing**: Margins, section spacing, photo shapes (rounded, circle, square), section reordering, and visibility toggles.
- **Motion / Animation**: Online animated resume feature! Select text/section/photo animations (Fade In, Slide Up, Slide Left, Slide Right, Scale In, Float), duration slider, and live replay. *(Animations are automatically stripped during PDF export to maintain 100% static ATS compliance).*

### 3. Smart AI Co-Pilot Assistant
- **Summary Generator**: Crafts professional summaries synthesized from your active skills and projects.
- **Bullet Point Elevators**: Transforms passive statements into quantifiable metric-driven accomplishments.
- **Action Verbs & ATS Optimizer**: Injects authoritative leadership verbs and industry-standard keywords.
- **Safe Before/After Diffs**: Review AI changes with **Apply** and **Reject** buttons — never overwrites content silently.

### 4. Real-Time ATS Compatibility Engine
- Circular score indicator (e.g. 87 / 100, Grade A).
- Pillar breakdown: Contact & Links, Keywords & Skills, Experience Impact, Formatting & Layout, Readability & Grammar.
- Automated checklist of passed verifications and improvement opportunities.
- One-click **Auto-Fix** buttons to resolve recommendations immediately.

### 5. Job Description Matcher ("Match My Resume to Job")
- Paste target job requirements or select presets (Full-Stack, AI/ML).
- Real-time Match Percentage calculation (e.g. 78% Match).
- Matched keywords chips and missing keywords chips with 1-click **Add to Resume** actions.

### 6. Export & Sharing System
- **Download PDF**: Client-side high-resolution A4 vector generation with confetti celebration.
- **Print Resume**: Clean browser print integration with `@page { size: A4 portrait; margin: 0; }` for direct native PDF saving with selectable text.
- **Download PNG**: 2x high-resolution raster image export.
- **Download DOCX**: Structured editable document.
- **Public Web Resume**: Dedicated shareable webpage (`resumeforge.app/r/harshith-gowda`) with subtle entrance animations, contact badges, and direct PDF download.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 9+

### Installation & Run

```bash
# Clone or navigate to the repository
cd resume_builde

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Development server runs on: `http://localhost:5173/`

---

## 🛠️ Technology Stack
- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Build Tool**: Vite 6
- **Icons**: Lucide React + Custom SVG Brand Icons
- **Document Generation**: jsPDF + html2canvas
- **Celebration Effects**: canvas-confetti
- **State & Persistence**: Centralized React Context with debounced `localStorage` autosave
