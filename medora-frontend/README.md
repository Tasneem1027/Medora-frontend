# Medora frontend

Medora is a standalone React/Vite telemedicine demo. All demo accounts, appointments, prescriptions, and profile edits are stored in this browser's `localStorage`. The app makes no backend or REST API requests and does not require Axios, PostgreSQL, an API Gateway, or Eureka.

## Run locally

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite. No environment file or backend service is needed.

## Reviewer demo accounts

- Patient: `patient@medora.test` / `Patient123!`
- Doctor: `doctor@medora.test` / `Doctor123!`
- Other fictional doctor profiles: `ethan@medora.test`, `sophia@medora.test`, and `noah@medora.test`; each uses `Doctor123!`.

New accounts are saved in this browser and cannot sign in from another browser or device. Demo passwords are stored locally for this student-project demonstration; do not use real credentials or personal health information.

Use the browser's application storage controls to clear `medora.demo.*` entries and restore the initial demo accounts and sample records.
