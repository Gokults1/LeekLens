# Deploying LeakLens to Render for Free

Follow these steps exactly to deploy LeakLens to Render.

## 1. Push project to GitHub
1. Make sure you have committed your recent changes.
2. Ensure you have not committed `.env` files (except `.env.example`).
3. Push your repository to GitHub.

## 2. Deploy FastAPI backend to Render
1. Go to [Render](https://render.com/) and create a new **Web Service**.
2. Connect your GitHub repository.
3. Configure the service:
   - **Name:** leaklens-backend (or similar)
   - **Region:** Any
   - **Branch:** main
   - **Root Directory:** `backend`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type:** Free
4. Click **Create Web Service**.
5. Do **NOT** set `FRONTEND_URL` yet.

## 3. Copy backend Render URL
Once the backend service is created, copy its public URL from the top of the Render dashboard (e.g., `https://leaklens-backend.onrender.com`).

## 4. Deploy React frontend to Render
1. Go to Render and create a new **Static Site**.
2. Connect the same GitHub repository.
3. Configure the site:
   - **Name:** leaklens-frontend (or similar)
   - **Branch:** main
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish directory:** `dist`
4. Expand **Advanced** and click **Add Environment Variable**.
   - **Key:** `VITE_API_URL`
   - **Value:** Paste the backend URL you copied in Step 3 (e.g., `https://leaklens-backend.onrender.com`).
5. Click **Create Static Site**.

## 5. Set VITE_API_URL to backend URL
If you missed setting `VITE_API_URL` during the frontend creation, go to your **Frontend Static Site > Environment** on Render, add `VITE_API_URL`, and trigger a new build.

## 6. Set FRONTEND_URL in backend to frontend URL
1. Copy the public URL of your new frontend static site (e.g., `https://leaklens-frontend.onrender.com`).
2. Go to your **Backend Web Service > Environment** on Render.
3. Add a new environment variable:
   - **Key:** `FRONTEND_URL`
   - **Value:** Paste the frontend URL (do NOT include a trailing slash, e.g., `https://leaklens-frontend.onrender.com`).
4. Save the changes.

## 7. Redeploy backend if necessary
Render should automatically restart the backend when you save the environment variable. If it doesn't, click **Manual Deploy > Deploy latest commit** for the backend.

## 8. Open the public frontend URL
Visit your new public LeakLens frontend URL in your browser.

## 9. Test /health
You can verify the backend is running by visiting `<backend-url>/health` in your browser. It should return:
```json
{
  "status": "ok"
}
```

## 10. Test the real email scanner
On your public frontend, enter an email address into the scanner and verify that the results appear correctly. LeakLens is securely contacting your FastAPI backend, which is securely contacting XposedOrNot. No keys or backend endpoints are exposed in the browser!
