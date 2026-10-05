# LTO Reviewer

An offline-first Philippine LTO Non-Professional practice reviewer built with Expo and React Native. The app includes category-based quizzes, a 60-question mock exam, answer review, exam history, mistake tracking, bookmarks, statistics, light and dark themes, and optional haptic feedback.

> **Disclaimer:** This is a practice reviewer only. It is not affiliated with or endorsed by the Land Transportation Office (LTO), and results are not official LTO exam results.

## How the app works

The complete question bank is bundled with the application in `src/data/questions.ts`. The app does not download questions or require an account, backend, API key, or internet connection.

The database currently contains 75 questions:

- Road Signs: 30
- Traffic Rules: 22
- Penalties: 12
- Defensive Driving: 8
- General & Republic Acts: 3

### Practice Quiz

1. Open **Practice Quiz** from the Home screen.
2. Choose a category and a question count of 10, 20, or 30.
3. The app selects unique questions and randomizes both the question and answer-choice order.
4. Select an answer to see immediate correct or incorrect feedback, the correct answer when needed, the explanation, and its source.
5. Complete the quiz to see the score and incorrect-answer references.

If a category has fewer questions than the requested amount, the quiz safely uses every available question in that category.

### Mock Exam

1. Tap **Start Mock Exam** to generate up to 60 unique questions.
2. Move between questions with Previous, Next, or the question navigator.
3. Answers can be changed until the exam is submitted. Correct answers and explanations remain hidden during the exam.
4. Submit the exam after confirming any unanswered questions.
5. The results screen shows the score, percentage, and correct, incorrect, and unanswered totals.
6. Use **Review Answers** to inspect every response and its explanation.

Each completed mock exam is saved locally and contributes to History and Statistics.

### Learning tools

- **Review Mistakes:** Prioritizes questions that have been answered incorrectly and retains progress across app restarts.
- **Bookmarks:** Saves question IDs locally and supports a focused bookmarked-question practice session.
- **Exam History:** Lists saved mock exam attempts and opens the recorded details for each attempt.
- **Statistics:** Calculates overall and category performance from actual locally stored attempts.
- **Settings:** Controls appearance and haptics and provides confirmed actions for clearing local app data.

### Local data

Exam history, quiz performance, mistakes, bookmarks, appearance, and haptic preferences are stored on the device with AsyncStorage. Clearing the app's storage or uninstalling the app removes this data. Storage failures are handled without preventing the current quiz or exam result from being displayed.

## Technology used

- [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/) and React Native 0.86
- React 19 and strict TypeScript
- [Expo Router](https://docs.expo.dev/router/introduction/) for file-based navigation
- Zustand for quiz, exam, preference, and locally cached application state
- AsyncStorage for offline persistence
- Expo Haptics for optional answer feedback
- Lucide React Native for interface icons
- React Native Reanimated for lightweight UI animation
- Bricolage Grotesque for application typography
- React Native `StyleSheet` with a centralized light/dark theme system

No backend, authentication provider, cloud database, analytics service, or network API is required.

## Project structure

```text
.
├── assets/                 # App icons, splash artwork, and image assets
├── src/
│   ├── app/                # Expo Router screens and root navigation layout
│   ├── components/         # Shared quiz, exam, result, and themed UI components
│   ├── constants/          # Theme tokens and shared constants
│   ├── data/               # Offline LTO question database
│   ├── hooks/              # Theme, settings, and platform hooks
│   ├── services/           # AsyncStorage persistence boundaries
│   ├── stores/             # Zustand state stores
│   ├── types/              # Shared TypeScript models
│   └── utils/              # Scoring, randomization, validation, and review logic
├── app.json                # Expo and Android application configuration
├── eas.json                # EAS APK and production build profiles
├── package.json            # Dependencies and npm scripts
└── tsconfig.json           # TypeScript configuration
```

## Requirements

Install the following before setting up the project:

- [Node.js](https://nodejs.org/) current LTS release
- npm, which is included with Node.js
- Git
- For physical-device development: an Android phone with [Expo Go](https://expo.dev/go)
- For emulator development: Android Studio with an Android Virtual Device
- For cloud APK builds: a free Expo account

This repository uses `package-lock.json`, so the instructions below use npm.

## Step-by-step development setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd lto-reviewer
```

Replace `<repository-url>` with the URL of your Git repository.

### 2. Install the exact dependencies

```bash
npm ci
```

Use `npm install` instead if you are intentionally updating the lockfile. Expo-compatible native packages should be installed with `npx expo install <package>` rather than a direct npm version selection.

### 3. Validate the project

```bash
npx tsc --noEmit
npx expo lint
npx expo-doctor
```

These commands check TypeScript, lint rules, Expo configuration, and dependency compatibility.

### 4. Start the development server

```bash
npx expo start
```

From the Expo terminal interface:

- Scan the QR code with Expo Go on an Android phone connected to the same network.
- Press `a` to open an available Android emulator.
- Press `w` to open the web version for basic development checks.

The equivalent npm commands are:

```bash
npm run android
npm run ios
npm run web
```

An iOS simulator requires macOS. Android development works on Windows, macOS, or Linux.

### 5. Clear the development cache if needed

If Metro reports stale modules or assets after dependency or configuration changes, restart it with:

```bash
npx expo start --clear
```

No `.env` file, database migration, seed command, or local server is needed.

## Common development commands

```bash
# Start Expo
npm start

# Start directly for a target
npm run android
npm run ios
npm run web

# Check types
npx tsc --noEmit

# Run linting
npm run lint

# Diagnose Expo configuration and dependencies
npx expo-doctor
```

## Build an installable Android APK

The `apk` profile in `eas.json` creates an APK for direct installation on an Android phone. It does not publish the app to Google Play.

### 1. Sign in to Expo

```bash
npx eas-cli@latest login
npx eas-cli@latest whoami
```

### 2. Link or create the EAS project

Run this once for a new checkout or Expo account:

```bash
npx eas-cli@latest init
```

EAS may add an `extra.eas.projectId` value to `app.json`. That identifier links the local project to its EAS project.

### 3. Verify the Android build profile

```bash
npx eas-cli@latest config --platform android --profile apk
```

### 4. Build the APK

```bash
npx eas-cli@latest build --platform android --profile apk
```

For the first Android build, allow EAS to generate and securely manage the Android keystore unless you already have one that must be reused. When the build finishes, open the provided EAS build URL, download the APK, and install it on the phone. Android may ask you to permit installation from the browser or file manager used to open it.

If Android Debug Bridge is installed, a downloaded APK can also be installed with:

```bash
adb install -r /path/to/lto-reviewer.apk
```

See the official [EAS Build setup guide](https://docs.expo.dev/build/setup/) and [APK build guide](https://docs.expo.dev/build-reference/apk/) for additional build-machine and credential details.

## Data and content notes

- Questions are maintained in `src/data/questions.ts` and validated during development.
- Do not change a correct answer, explanation, or source without verifying it against the project's source document.
- Randomization uses non-mutating Fisher-Yates utilities. Do not use array sorting with a random comparator.
- Persisted records reference stable question IDs. Changing or removing IDs can affect existing bookmarks and historical reviews.
- Do not commit `.env` files, signing keys, credentials, or downloaded build artifacts.

## License

See [LICENSE](./LICENSE) for this repository's license terms.
