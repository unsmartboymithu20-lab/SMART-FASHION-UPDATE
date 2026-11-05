# SMART FASHION — Complete E-commerce Website

Responsive Bangladesh fashion store with customer accounts, product catalogue, cart, checkout, order tracking and protected admin panel. Backend uses **MongoDB Atlas** (not PostgreSQL) and is configured for **GitHub + Render** deployment.

## Included

- Mobile-first storefront with responsive desktop layout and fixed mobile bottom navigation.
- Home, category filtering, live search, product cards, wishlist, cart and checkout.
- Customer registration, login, logout and personal order history.
- Server-side price/stock checks, order creation, delivery charge and coupon validation.
- Cash on Delivery plus bKash/Nagad manual-payment selection.
- Order tracking by order ID and checkout phone number.
- Product reviews with admin approval, contact messages and newsletter subscriptions.
- Protected admin login and dashboard: products, gallery image upload, orders/status, coupons, reviews, messages, subscribers and store settings.
- 20 demo products inserted only when the MongoDB products collection is empty.
- MongoDB-backed sessions; session survives Render restarts while MongoDB remains available.

## Deploy to Render (recommended)

### 1. MongoDB Atlas

1. Create a MongoDB Atlas cluster and database user.
2. In Atlas → Network Access, allow Render to connect. For a simple first deployment you can allow `0.0.0.0/0` and use a strong database password; for stricter security configure Render's outbound IP allowlist where available.
3. Copy the application connection string. It should look like:
   `mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/smart-fashion?retryWrites=true&w=majority`
4. Replace the username/password and URL-encode special characters in the password.

### 2. GitHub

1. Extract this ZIP.
2. Open the `smart-fashion` folder.
3. Upload the **contents of this folder** to the root of a new GitHub repository. Do not upload only the ZIP or an extra nested folder.
4. Do not upload `.env` or real passwords. `.env` is ignored by Git.

### 3. Render Web Service

1. In Render choose **New → Web Service** and connect the GitHub repository.
2. Runtime: Node. Build command: `npm install`. Start command: `npm start`.
3. Add these Environment Variables:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Your complete MongoDB Atlas connection string |
| `ADMIN_EMAIL` | Your own admin email |
| `ADMIN_PASSWORD` | A strong unique admin password (at least 12 characters) |
| `SESSION_SECRET` | A random secret string of at least 32 characters |

`PORT` is provided by Render automatically. `render.yaml` is included as a Blueprint option, but you must still enter the secret values.

4. Deploy. Wait until the Render logs say `MongoDB connected` and `SMART FASHION running`.
5. Open `https://YOUR-SERVICE.onrender.com/` for the store and `https://YOUR-SERVICE.onrender.com/admin` for the admin panel.
6. Sign in with `ADMIN_EMAIL` and `ADMIN_PASSWORD` configured in Render.

## Local run

```bash
npm install
cp .env.example .env
# Edit .env and add a valid MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_SECRET
npm run dev
```

Open `http://localhost:3000` and `http://localhost:3000/admin`.

## Important payment and launch notes

- bKash/Nagad are **manual payment selections only** in this build. The site does not automatically collect or verify payments. Automatic payment requires an approved merchant account and official gateway credentials/integration.
- Product gallery uploads are stored as base64 data URLs in MongoDB. This keeps images across Render deploys, but for a large catalogue use Cloudinary or S3 to avoid growing database documents.
- Contact form messages and newsletter addresses are stored in MongoDB; outbound email/SMS/WhatsApp notifications are not configured.
- Replace demo products, images, store contact details, delivery charge and policy text before accepting real orders.
- Use a strong database password and admin password. Never put secrets in GitHub. Keep MongoDB backups enabled and check Render logs after deployment.
- This project is a functional starter store, not a substitute for independent security review, payment gateway certification, tax/legal review or load testing before a high-volume launch.

## Troubleshooting

- **MongoDB connection error:** confirm `MONGODB_URI`, Atlas database username/password, URL-encoded special characters and Atlas Network Access.
- **Admin login fails:** check `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the Render service environment, then redeploy. The configured admin password is hashed in MongoDB at startup.
- **Images too large:** uploads accept JPG, PNG, WEBP and GIF up to 5 MB each.
- **Service sleeps:** Render free services may sleep when idle depending on current plan terms; the first request can take longer.

## Project files

- `server.js` — Express API, MongoDB models/collections, auth, orders and admin routes.
- `public/index.html`, `public/style.css`, `public/store.js` — responsive storefront.
- `public/admin.html`, `public/admin.js` — admin dashboard.
- `render.yaml` — Render Blueprint.
- `.env.example` — environment variable template.
