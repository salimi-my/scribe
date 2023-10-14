# [Scribe](https://scribe.salimi.my) &middot; [![Author Salimi](https://img.shields.io/badge/Author-Salimi-%3C%3E)](https://www.linkedin.com/in/mohamad-salimi/)

Scribe offers you the remarkable ability to engage in insightful conversations with any PDF document of your choice. With the simple act of uploading your file, you can seamlessly embark on a journey of exploration, posing your inquiries and gaining valuable insights in real-time with AI.

## Chat with your documents

- Drag & drop file upload
- Chat with PDF using AI
- Authentication using Kinde
- Subscription using Stripe
- MongoDB & Prisma for database
- Hosted in Vercel

## Tech/framework used

- Next.js 13 App Dir
- Shadcn/ui
- Kinde
- Tailwind CSS
- UploadThing
- TypeScript
- MongoDB
- Prisma
- Stripe
- Vercel

## Starting the project

Open the [.env.example](/.env.example) and fill in your Database URL, Kinde Auth, UploadThing, Pinecone, OpenAI & Stripe configurations then save it as .env then run the following command:

```bash
npm install
npx prisma db push
npx prisma generate
npm run dev
```

## Demo

The app is hosted on Vercel. [Click here](https://scribe.salimi.my) to visit.
<br>
Direct link: `https://scribe.salimi.my`

## Screenshots

#### Landing Page

![Landing Page](/screenshots/screenshot-1.png)

#### Sign in

![Sign in](/screenshots/screenshot-2.png)

#### Dashboard

![Dashboard](/screenshots/screenshot-3.png)

#### Chat with PDF

![Chat with PDF](/screenshots/screenshot-4.png)

#### Upload File

![Upload File](/screenshots/screenshot-5.png)

#### Payment Page

![Payment Page](/screenshots/screenshot-6.png)

#### Manage Subscription

![Manage Subscription](/screenshots/screenshot-7.png)
