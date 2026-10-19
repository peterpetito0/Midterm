# StudyPrep

A study app for tests, midterms and finals. Pick a course, describe the exam, upload your lecture slides, and get:

- **A day-by-day study plan** up to your exam date. Topics you're less confident in get more sessions, and the last day is set aside for review.
- **Flashcards**, built in for each course plus ones made automatically from your slides (slide title → bullet points) and your notes (`Term: definition` lines).
- **Practice quizzes**: multiple-choice questions for each course, plus "which slide does this belong to?" questions made from your uploads.
- **Progress tracking**: quiz accuracy by topic and the cards you've mastered.

Supported courses: Python Programming, Mobile App Projects, Intro to Database Structures, Financial Institutions.

## Running it

It's a static site with no build step and no backend. Open `index.html`, or serve the folder:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

To host it for free, turn on **GitHub Pages** in the repo settings (Settings → Pages → Deploy from branch → `main` / root).

## How uploads work

Files are read in your browser and never sent anywhere. Supported formats:

| Format | How it's read |
| --- | --- |
| `.pptx` | Each slide's title and bullet text (uses JSZip, loaded from cdnjs) |
| `.pdf` | Each page's text: the first line is the title, the rest are bullets (uses pdf.js) |
| `.txt` / `.md` | Blocks separated by blank lines; the first line of each block is the title |

Old `.ppt` files and scanned PDFs (images with no text) can't be read. Export them to `.pptx` or a text PDF first.

Your setup and progress are saved in your browser's localStorage.

## Project layout

```
index.html       Landing page
study.html       The app (setup wizard and study dashboard)
css/styles.css   Styles (light and dark mode)
js/data.js       Course topics, flashcards and question banks; edit this to add content
js/parsers.js    Slide and file text extraction
js/app.js        App logic: wizard, plan, flashcards, quiz, progress
```
