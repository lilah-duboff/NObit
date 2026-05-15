# NObit

### File Structure
nobit/
├── README.md
├── .gitignore
│
├── frontend/                    ← React app (deploy to Vercel)
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── components/          ← Reusable UI pieces
│   │   │   ├── Navbar.jsx
│   │   │   ├── PostCard.jsx       ← A single tribute/memory card
│   │   │   ├── UserProfile.jsx
│   │   │   ├── WritePost.jsx      ← Form to write a review/memory
│   │   │   └── AvatarUpload.jsx
│   │   ├── pages/               ← One file per screen
│   │   │   ├── Home.jsx           ← Feed of recent posts
│   │   │   ├── Profile.jsx        ← A person's tribute wall
│   │   │   ├── WriteMemory.jsx    ← Compose new post
│   │   │   ├── Login.jsx
│   │   │   └── Invite.jsx         ← Admin: send invites
│   │   ├── hooks/               ← Custom React hooks
│   │   │   └── usePosts.js
│   │   └── api/                 ← Functions that call your backend
│   │       ├── posts.js
│   │       └── users.js
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     ← Express API (deploy to Railway/Render)
│   ├── server.js                ← Entry point
│   ├── routes/
│   │   ├── posts.js             ← GET/POST /api/posts
│   │   ├── users.js             ← GET/PATCH /api/users
│   │   └── invites.js           ← POST /api/invites
│   ├── middleware/
│   │   └── authCheck.js         ← Verify Clerk JWT on every request
│   ├── db/
│   │   └── supabase.js          ← Supabase client setup
│   ├── .env.example
│   └── package.json
│
└── docs/
    ├── schema.md                ← Database table designs
    └── features.md              ← Feature roadmap