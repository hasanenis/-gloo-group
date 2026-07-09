# Image Analysis Workflow

This workflow analyzes project photos and produces:

- `analysis.json`: structured AI output for later UI integration
- `analysis.md`: readable review file for content selection

The goal is not only captioning. The model also decides whether each image is best for:

- `hero`
- `section-banner`
- `side-support`
- `gallery`
- `detail-only`
- `exclude`

For project-detail pages, the editorial pass also assigns images to these page slots:

- `project-hero`
- `project-intro`
- `visual-mosaic`
- `feature-gallery`
- `construction-gallery`
- `featured-card`

## Recommended Google Cloud Setup

Use Google Cloud ADC with Vertex AI mode.

1. Install the Google Cloud CLI.
2. Log in:

```powershell
gcloud auth login
```

3. Set your project:

```powershell
gcloud config set project YOUR_PROJECT_ID
```

4. Enable local application credentials:

```powershell
gcloud auth application-default login
```

5. Enable the Vertex AI API in the project:

```powershell
gcloud services enable aiplatform.googleapis.com
```

6. Set environment variables in the current PowerShell session:

```powershell
$env:GOOGLE_GENAI_USE_ENTERPRISE="true"
$env:GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"
$env:GOOGLE_CLOUD_LOCATION="us-central1"
```

If you want the simpler API-key path instead of ADC, set:

```powershell
$env:GEMINI_API_KEY="YOUR_GEMINI_KEY"
```

## Pilot Run

Run one project folder first:

```powershell
npm run analyze:images -- --project "staouali"
```

Run every project folder:

```powershell
npm run analyze:images:all
```

## Build The Site Manifest

After image analysis, extract the French Word forms, create optimized local WebP files, and generate the React content manifest:

```powershell
npm run build:project-content
```

The script maps the operational source names automatically:

- `Rahmania.docx` -> Douira
- `Mostaganem.docx` -> Bas Mazagran
- `sidi yahia` photos -> Said Hamdine

The generated browser-safe output is `src/data/projectContent.generated.ts`; images are written to `public/projects/<project-slug>/`.

### Optional Google Maps Data

To populate the verified nearby-places list, enable Geocoding API and Places API in Google Maps Platform and provide a restricted server/build-time key:

```powershell
$env:GOOGLE_MAPS_API_KEY="YOUR_RESTRICTED_MAPS_KEY"
```

The key is used only by `build-project-content.ts` and is never exposed by Vite. Without it, the nearby-places section is omitted.

Output will be written to:

```text
İgloo project data/analysis/staouali/
```

## How To Use The Output

Read `analysis.md` to choose:

- which images are strong enough for the home page hero
- which images support sections such as facade quality, progress, or commercial premises
- which images are only useful in a detail gallery
- which images should be excluded

The improved version also adds:

- a project-aware editorial summary
- a hero shortlist
- section-level image buckets
- low-priority flags
- caption and alt-text output for site use

Use `analysis.json` when you want to automate selection inside the React app later.

## Suggested Next Step

After the pilot looks correct, run the same command for each project folder and then create a small mapper that links:

- project slug in `src/data/projects.ts`
- local analyzed image files
- chosen placements for home page and project detail pages
