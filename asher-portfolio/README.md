# Asher portfolio (React + Tailwind CSS)

## Run it
```
npm install
npm run dev
```
Open the address it prints (usually http://localhost:5173).

## Add the hero portrait
Save a dark, editorial portrait (landscape, face a bit right of center) as `public/hero.jpg`.
Without it the hero shows a dark gradient and the lettering still works.
The WebGL ripple turns on automatically once the photo exists (wide screens, mouse only).

## Edit the content
`src/data/content.ts` holds everything: your name and statement (PERSONA), the six PROJECTS
and the tech stack (SERVICES). The covers are drawn in `src/art/svgs.tsx`; set a path in ASSETS
to use a real screenshot or photo instead.

## Build for the web
```
npm run build
```
