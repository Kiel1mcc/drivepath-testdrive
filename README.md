# Test Drive Request App

This project allows users to submit requests for test drives and provides a dashboard for guest assistants to manage them.

## Fix applied
- The QR flow submission now includes a `status` field set to `"waiting"` when a request is pushed to Firebase.
- After deploying this change, ensure existing test drive requests in Firebase have their `status` fields reset to `"waiting"` if they were stuck in `"in-progress"`.

## Development
Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

