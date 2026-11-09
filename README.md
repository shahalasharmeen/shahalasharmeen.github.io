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

## 🛠️ Installed UI/UX Pro Max Skill
The skill has been installed locally in `.agents/skills/ui-ux-pro-max` and globally in `~/.gemini/skills/ui-ux-pro-max-skill`.
To search design tokens, palettes, and typography anytime:
```bash
python .agents/skills/ui-ux-pro-max/scripts/search.py "portfolio resume" --domain product
python .agents/skills/ui-ux-pro-max/scripts/search.py "tech developer" --domain typography
```
