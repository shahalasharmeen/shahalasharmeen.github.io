# Sahla Sharmeen E.K - Resume & Bio-Data Portfolio Website

A multi-page portfolio, curriculum vitae, and personal bio-data website for **Sahla Sharmeen E.K** (Computer Science Engineering student at PA College of Engineering, CGPA 8.9).

Designed following modern Swiss Minimalism and technical aesthetics guided by the installed [UI/UX Pro Max Skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill).

---

## 🌟 Key Features & Pages

1. **Home (`index.html`)**:
   - Hero introduction with custom vector avatar and academic credentials.
   - Core metrics showcase (8.9 CGPA, 7+ Hardware & Software projects, 4 Certifications).
   - Dedicated portal navigation to Resume and Bio-data.
   - Quick highlight cards and direct contact action bar.

2. **Resume (`resume.html`)**:
   - Full professional Curriculum Vitae matching `Resume.pdf`.
   - Sections: Education, Technical & Soft Skills, Key & Additional Projects, Certifications, Workshops, and Languages.
   - **Interactive features**:
     - *Print / PDF Mode*: Custom `@media print` styling (`css/print.css`) for ATS-compliant physical or PDF export.
     - *Copy Plain ATS Text*: One-click copy for online job applications.
     - *Original PDF*: Direct download of the authentic `Resume.pdf`.

3. **Bio-Data (`biodata.html`)**:
   - Comprehensive personal biographical profile.
   - Structured demographic details (`<dl>`, `<dt>`, `<dd>`).
   - Academic qualifications table (`<table>`).
   - Visual multilingual proficiency indicators (Malayalam, English, Hindi, Tamil).
   - Creative pursuits & passions: Photography, Painting, and Baking.
   - Formal Declaration and Signature block.

4. **Projects Showcase (`projects.html`)**:
   - Interactive filtering by domain: **IoT & Hardware**, **Web & Software**, **Cloud & CRM**.
   - Real-time search filter powered by jQuery.
   - Highlights: *Footstep Power Generation Using Arduino*, *Volunteer Program Tracker Using Salesforce*, *ComedKares RC Car*, *Muscle Flex EMG Sensor*, *ESP32 Drone*, *Automated Irrigation*, and *Cooking Recipe Portal*.

5. **Contact (`contact.html`)**:
   - Direct communication channels (Email, Phone, Kasaragod location, LinkedIn, GitHub).
   - Interactive message form with real-time client-side jQuery validation and feedback alert.

6. **Interactive Global Features**:
   - Dark / Light mode toggle with `localStorage` memory and system preferences.
   - Fully responsive layout across mobile (375px), tablet (768px), and desktop (1024px+).
   - Toast notification system for all copy and state actions.
   - No heavy frontend frameworks required — pure HTML5, CSS3, JavaScript, and jQuery 3.7.1.

---

## 🚀 Hosting on GitHub Pages (`github.io`)

This website is ready to be hosted immediately on GitHub Pages. Follow these simple steps:

### Option A: Hosting on `shahalasharmeen.github.io` (User Page)
1. Create a repository on GitHub named:
   ```
   shahalasharmeen.github.io
   ```
2. In this local folder, run the automated script `deploy.bat` (or use the terminal):
   ```bash
   git add .
   git commit -m "Initial release of Resume & Bio-Data website"
   git remote add origin https://github.com/shahalasharmeen/shahalasharmeen.github.io.git
   git push -u origin main
   ```
3. Your website will be live at:
   ```
   https://shahalasharmeen.github.io/
   ```

### Option B: Hosting in a Project Repository (e.g., `resume-biodata`)
1. Create a repository named `resume-biodata` (or any name you prefer).
2. Push the files:
   ```bash
   git add .
   git commit -m "Deploy Resume & Bio-data portfolio"
   git remote add origin https://github.com/shahalasharmeen/resume-biodata.git
   git push -u origin main
   ```
3. In GitHub, go to **Settings** &rarr; **Pages** &rarr; under **Branch**, choose `main` / `root` and click **Save**.
4. Your website will be live at:
   ```
   https://shahalasharmeen.github.io/resume-biodata/
   ```

---

## 🛠️ Installed Skills & Design Systems
The project incorporates elite design skills locally in `.agents/skills/` and globally in `~/.gemini/config/skills/`:

1. **[Hallmark](https://github.com/nutlope/hallmark)**:
   - 16 Floor craft rules enforced: tokenized `:root` styles, `overflow-x: clip`, `:focus-visible`, reduced-motion support, no invented metrics, no emoji icons.
2. **[Emil Kowalski Design Engineering](https://github.com/emilkowalski/skills)**:
   - Physics-based spring and cubic-bezier easings (`--ease-out`, `--ease-spring`), tactile button `:active` scaling, sub-220ms snappy transitions, and 60fps cursor follower.
3. **[Taste-Skill (Frontend Taste 2.5)](https://github.com/leonxlnx/taste-skill)**:
   - Figma and x.ai level aesthetics: equal content edges, authentic photography and 3D female engineer model, real hardware project captures with hover zoom, and crisp typography.
4. **[Impeccable](https://github.com/pbakaus/impeccable)**:
   - Deep experience mode, zero-lag in-memory PJAX page routing, print `@media` optimization for ATS resumes, and resilient accessibility.
5. **[UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)**:
   - Design tokens, palettes, and typography guidance.

