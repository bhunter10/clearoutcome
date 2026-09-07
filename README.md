# ClearOutcome Website

First version of clearoutcome.com with the ClearOutcome logo, beta opt-in form, contact information, and footer disclaimer.

The opt-in form writes to a Firebase Firestore `betaRequests` collection through a Next.js API route. Admins can view requests at `/admin` after signing in with Firebase Auth.

## Firebase setup

Use the Firebase project named `clearoutcome`.

Enable these Firebase services:
- Firestore Database
- Authentication with Email/Password sign-in

Add these environment variables to the ClearOutcome Vercel project:
- `FIREBASE_SERVICE_ACCOUNT`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

The app writes beta requests server-side, so Firestore browser rules are locked down in `firestore.rules`.
