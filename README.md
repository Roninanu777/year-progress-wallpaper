# Live Calendar Wallpaper Generator

Generate iPhone wallpapers that visualize time progress in two modes:

- `Year` mode renders a dot-grid view of the current year.
- `Month` mode renders a styled monthly calendar view.

The app includes a live device preview, downloadable wallpaper generation, and shareable API URLs that can be used from iOS Shortcuts for automatic wallpaper updates.

## What This Project Does

This is a [Next.js](https://nextjs.org/) App Router application that lets users:

- choose an iPhone wallpaper size from preset device resolutions
- switch between year-progress and month-progress wallpaper modes
- customize colors, fonts, spacing, and optional custom text
- preview the wallpaper inside an iPhone frame before generating it
- download the generated PNG directly from the browser
- copy a fully parameterized API URL for iOS Shortcut automation

Month mode currently supports these styles:

- `Glass Card`
- `Classic Grid`
- `Bold Blocks`
- `Minimal Outline`
- `Capsule Modern`

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Jest + Testing Library
- `next/og` `ImageResponse` for image generation APIs

## Repository

- GitHub repository: `git@github.com:Roninanu777/year-progress-wallpaper.git`
- Default production branch: `master`

## Prerequisites

Use a current Node.js LTS release. Node 20+ is the safe baseline for this stack.

You will also need:

- `npm`
- `git`
- a GitHub account if you want Git-based Vercel deployments
- a Vercel account if you want hosted deployments

## Quick Start

### 1. Clone the repository

```bash
git clone git@github.com:Roninanu777/year-progress-wallpaper.git
cd year-progress-wallpaper
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The dev server is configured to run on:

```text
http://localhost:5051
```

### 4. Open the app

Open `http://localhost:5051` in your browser.

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Starts Next.js in development mode on port `5051`. |
| `npm run build` | Creates a production build. |
| `npm run start` | Starts the production server after a successful build. |
| `npm run lint` | Runs ESLint across the project. |
| `npm test` | Runs the Jest test suite. |
| `npm run test:watch` | Runs tests in watch mode. |
| `npm run test:coverage` | Runs tests with coverage output. |

## Local Development Workflow

Typical workflow:

1. Start the app with `npm run dev`.
2. Make UI or API changes.
3. Verify the preview and generated wallpaper output.
4. Run `npm run lint`.
5. Run `npm test -- --runInBand`.
6. Run `npm run build` before pushing if the change can affect deployment.

## Running a Production Build Locally

Build the app:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

Next.js will serve the production app on the default production port unless you override it, typically:

```text
http://localhost:3000
```

## Project Structure

```text
app/
  api/
    wallpaper/
      route.tsx            # Year wallpaper image API
      month/route.tsx      # Month wallpaper image API
  globals.css
  layout.tsx               # App shell and global fonts
  page.tsx                 # Main UI page and state wiring

components/
  ColorPicker.tsx
  Controls.tsx             # All user controls, presets, and actions
  DeviceFrame.tsx          # iPhone frame wrapper
  Preview.tsx              # Preview container
  ShortcutInstructions.tsx # iOS Shortcut setup guide shown in the UI
  WallpaperCanvas.tsx      # Canvas renderer for live preview

lib/
  constants.ts             # Device presets, theme presets, default settings, month styles
  utils.ts                 # Date helpers, color param helpers, API URL generator

__tests__/
  ...                      # Component, API, utility, and page tests

public/
  devices/iphone-frame.svg # Device frame asset
```

## How the App Works

### Frontend flow

1. `/Users/ronirajkamalpradhan/Documents/live-calendar/app/page.tsx` stores the current wallpaper settings in React state.
2. `/Users/ronirajkamalpradhan/Documents/live-calendar/components/Controls.tsx` lets the user change device, colors, typography, and mode-specific settings.
3. `/Users/ronirajkamalpradhan/Documents/live-calendar/components/WallpaperCanvas.tsx` renders the live wallpaper preview inside a canvas.
4. `/Users/ronirajkamalpradhan/Documents/live-calendar/components/Preview.tsx` wraps the canvas in an iPhone device frame.
5. `/Users/ronirajkamalpradhan/Documents/live-calendar/lib/utils.ts` builds a full API URL that mirrors the current UI settings.

### Backend image generation

The app exposes two image routes:

- `/api/wallpaper` for year-progress wallpapers
- `/api/wallpaper/month` for month-progress wallpapers

These routes:

- accept settings through query parameters
- render a PNG using `ImageResponse`
- are suitable for direct browser downloads or iOS Shortcuts

### Time zone behavior

Both wallpaper routes compute the current day in IST (`UTC+5:30`). That means the live preview and generated image stay aligned to the same day/time logic.

## API URL Parameters

The generated URL includes the current wallpaper settings. Common parameters are:

| Parameter | Meaning |
| --- | --- |
| `width` | Output image width in pixels |
| `height` | Output image height in pixels |
| `bg` | Background color without `#` |
| `filled` | Color for completed days |
| `empty` | Color for future or empty states |
| `radius` | Dot radius used by year mode |
| `spacing` | Dot spacing used by year mode |
| `textColor` | Main text color |
| `accentColor` | Accent color for highlights and progress text |
| `showCustomText` | `true` or `false` |
| `customText` | Optional quote or label rendered on the wallpaper |
| `font` | Selected font family |
| `monthStyle` | Month layout style key such as `glass`, `classic`, or `capsule` |

Example shape:

```text
/api/wallpaper/month?width=1284&height=2778&bg=000000&filled=FFFFFF&empty=333333&textColor=FFFFFF&accentColor=FFA500&showCustomText=false&customText=&font=Lora&monthStyle=glass
```

## iOS Shortcut Setup

The UI already includes a shortcut guide, but the exact flow is:

1. Copy the generated API URL from the app.
2. Open the iPhone `Shortcuts` app.
3. Create a new shortcut.
4. Add `URL`.
5. Add `Get Contents of URL`.
6. Add `Set Wallpaper`.
7. In `Set Wallpaper`, turn `Show Preview` off.
8. Run the shortcut once so iOS grants permissions.

For a daily automation:

1. Open the `Automation` tab in Shortcuts.
2. Create a `Time of Day` automation.
3. Add `Run Shortcut`.
4. Select your wallpaper shortcut.
5. Set `Run Immediately`.
6. Turn `Ask Before Running` off.

If `Show Preview` is left on, iOS will still require confirmation and the wallpaper will not be fully automatic.

## Vercel Setup

This repository is a standard Next.js application, so Vercel can deploy it without custom build adapters.

### Recommended setup: import the GitHub repository

1. Push this repository to GitHub if it is not already there.
2. Sign in to [Vercel](https://vercel.com/).
3. Click `Add New...` -> `Project`.
4. Choose to import an existing Git repository.
5. Select `Roninanu777/year-progress-wallpaper`.
6. Let Vercel auto-detect the framework.
7. Confirm the build settings and deploy.

### Vercel project settings for this repo

Use these settings unless you have a specific reason to override them:

| Setting | Value |
| --- | --- |
| Framework Preset | `Next.js` |
| Root Directory | repository root |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | leave blank / default for Next.js |
| Node version | use Vercel default or Node 20+ |

### Production branch

This repository currently ships from:

```text
master
```

After import, check `Project Settings -> Git` and confirm the production branch is `master`.

### What Vercel will do automatically

With Git integration enabled:

- pushes to non-production branches create preview deployments
- pushes to `master` create production deployments
- each deployment gets build logs and a deployment URL

### Environment variables

This project does not currently require any custom environment variables.

If you add them later:

1. Open the Vercel project.
2. Go to `Settings -> Environment Variables`.
3. Add the variable for `Production`, `Preview`, and/or `Development`.
4. Redeploy after changing them.

### First deployment checklist

After the first deploy, verify:

1. the homepage loads correctly
2. the live preview renders
3. `/api/wallpaper` returns an image
4. `/api/wallpaper/month` returns an image
5. the production branch is correct
6. preview deployments are being created for future pushes

### Re-deploying after code changes

Normal workflow:

1. commit and push changes to GitHub
2. let Vercel create a preview deployment
3. confirm the preview is healthy
4. merge or push to `master` for production

### Custom domains

After the first successful deploy:

1. open the Vercel project
2. go to `Settings -> Domains`
3. add your custom domain
4. update DNS records as Vercel instructs

## Vercel CLI Setup

If you prefer using the CLI instead of the dashboard:

### 1. Install the CLI

```bash
npm i -g vercel
```

### 2. Authenticate

```bash
vercel login
```

### 3. Link this directory to a Vercel project

Run this from the repository root:

```bash
vercel
```

The CLI will ask which scope and project to use.

### 4. Create a preview deployment

```bash
vercel
```

### 5. Create a production deployment

```bash
vercel --prod
```

## Troubleshooting

### `npm run build` fails locally while loading fonts

`/Users/ronirajkamalpradhan/Documents/live-calendar/app/layout.tsx` uses `next/font/google` for Geist fonts. Local production builds can fail if the machine cannot reach Google font assets.

If that happens:

- retry with working internet access
- or switch to local/self-hosted fonts if offline builds matter for your workflow

### Port `5051` is already in use

Another process is already using the configured dev port.

Either stop that process or run Next.js on a different port temporarily while debugging.

### Vercel deployment failed

The fastest local reproduction is:

```bash
npm run build
```

If local build fails, fix that first before retrying Vercel.

### Preview deploys work but production does not

Check:

- the repository is still connected in Vercel
- the production branch is set to `master`
- the production deployment is not failing its build

## Maintenance Notes

If you later add external services, update this README with:

- required environment variables
- any Vercel project settings that changed
- domain setup changes
- production-only behavior
- rate limits or API constraints if automation depends on them

## References

- [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying)
- [Vercel import project docs](https://vercel.com/docs/getting-started-with-vercel/import)
- [Vercel environment variables docs](https://vercel.com/docs/environment-variables)
