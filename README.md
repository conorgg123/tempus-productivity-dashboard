This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Productivity Dashboard Desktop App

This application combines Next.js and Electron to provide a full-featured productivity dashboard as a standalone desktop application.

## Getting Started

### Running as a Desktop Application

To run this application as a desktop app:

```bash
# From the project root
npm run electron-dev
```

This will start both the Next.js development server and Electron app together.

Alternatively, use the provided batch scripts from the parent directory:
- `run-dev.bat` - Starts the app in development mode
- `start-app.bat` - Interactive script that lets you choose development or production mode

### Build for Production

To build the desktop application for distribution:

```bash
npm run build
```

This will build both the Next.js application and package it with Electron.

### Running as a Web Application

You can still run the application as a regular web app:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

For more information about Electron:
- [Electron Documentation](https://www.electronjs.org/docs) - learn about Electron features.

## Features

- **Daily Focus**: Manage your tasks for the current day
- **YouTube Manager**: Save and organize video links
- **Todo List**: Keep track of all your tasks
- **Reminders**: Set reminders for important events
- **Scheduler**: Plan your activities with a visual timeline

## Deployment

The easiest way to deploy the web version of your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

For desktop distribution, the app can be packaged using electron-builder with:

```bash
npm run dist
```

This will create distributable packages in the `dist` directory.

## Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
