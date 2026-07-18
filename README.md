# Student Portfolio & Academic Management Website

**COS 106 — Introduction to Web Technologies — Term Project**

**Author:** Paul Gabriel
**Email:** p.gabriel5572@miva.edu.ng
**Department:** Software Engineering, School of Computing
**Matriculation No.:** 2025/A/SENG/0434
**Institution:** MIVA Open University

## About

A fully responsive, multi-page personal academic portfolio and student
management website built with plain HTML5, CSS3, and vanilla JavaScript
(no frameworks). Live site: _add your hosted URL here_.

## Pages

| Page | File | Highlights |
|---|---|---|
| Homepage | `index.html` | Name, photo, welcome message, nav, bio |
| About Me | `about.html` | Education timeline, aspirations, skills table, hobbies, audio |
| Projects | `projects.html` | 3 sample projects with images, descriptions, links, video |
| Academic Planner | `planner.html` | Add / complete / delete tasks (JavaScript + localStorage) |
| Contact | `contact.html` | Validated contact form (name, email, phone, message) |

## Tech Requirements Demonstrated

- **HTML:** semantic elements, forms, a table, images, hyperlinks, lists, audio & video
- **CSS:** external stylesheet, Flexbox + Grid, responsive/mobile-first design,
  transitions & animations, consistent colour system via CSS variables
- **JavaScript:** event handling, DOM manipulation, form validation (regex),
  dynamic content updates, arrays/functions, an interactive task manager
  persisted to `localStorage`

## Project Structure

```
├── index.html
├── about.html
├── projects.html
├── planner.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   ├── main.js        # shared nav behaviour
│   ├── planner.js      # academic planner logic
│   └── contact.js       # contact form validation
└── assets/
    ├── images/         # profile + project placeholder graphics (SVG)
    ├── audio/          # placeholder audio clip
    └── video/           # placeholder demo video
```

## Running Locally

No build step required — it's static HTML/CSS/JS.

```bash
# from the project root
python -m http.server 8000
# then open http://localhost:8000
```

Or simply open `index.html` directly in a browser.

## Notes

- Profile and project images are generated placeholder graphics (SVG) since
  no real photos/screenshots were supplied.
- The audio and video clips in the About/Projects pages are placeholder
  media included to satisfy the HTML5 multimedia requirement.
- The contact form validates client-side only (no backend); a successful
  submission shows a confirmation message but does not send data anywhere.
- Project links on the Projects page are simulated as permitted by the
  assignment brief.
