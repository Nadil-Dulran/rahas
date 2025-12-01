# 🕵️‍♂️ Rahas — Secure & Private Messaging App

Rahas is a private, real-time messaging app built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io for live updates.

Live deployment: https://rahas.onrender.com

Note: Sign-in to the deployed app requires access approval. To request access, contact: nadilgamage@gmail.com

---

## 🚀 Main Features (implemented)

- Real-time chat between users (Socket.io)
- User search and list in the left sidebar
- Edit Profile (profile page) and Logout actions
- Online/offline presence indicators
- Send text messages and images (in-chat image upload)
- Media gallery for conversation images (right sidebar)
- Responsive UI (collapsible sidebars on small screens)

---

## 🛠️ Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB
- Real-time: Socket.io

---

## 🧭 Deployment

- Deployed URL: `https://rahas.onrender.com`
- Note: The deployed instance is access-controlled. If you attempt to sign in and are asked for approval, email `nadilgamage@gmail.com` to request access.

---

## 🧩 Running locally (development)

1. Install dependencies for server and client:

```bash
# from project root
cd server
npm install

cd ../client
npm install
```

2. Create environment variables for the server (example)

```
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_URL=your_cloudinary_url_if_used
```

3. Start both apps (example using two terminals)

```bash
# Terminal 1 - server
cd server
npm run server

# Terminal 2 - client
cd client
npm run dev
```

Open `http://localhost:5173` (or the port Vite shows) to use the app locally.

---

## 🔐 Notes & Contact

- The deployed app requires manual sign-in approval — contact `nadilgamage@gmail.com` for access.
- For issues, feature requests, or contributions, open an issue or contact the owner.

---

## License

This repo does not include a license file. Add one if you want to make the project open source.

---

Thanks for trying Rahas — let me know if you want the README to include screenshots, API docs, or environment variable examples.