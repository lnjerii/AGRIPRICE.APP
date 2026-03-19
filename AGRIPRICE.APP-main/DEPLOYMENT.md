# Deployment

## Backend Deployment (Render)

1. Open Render and create a **Blueprint** deployment from this repo.
2. Select branch `njeri`.
3. Render will detect `render.yaml` and create service `agriprice1-hub-api`.
4. After deploy, copy your backend URL, for example:
   `https://agriprice1-hub-api.onrender.com`

## Notes

- Backend CORS should allow your frontend origin.
- GitHub Pages deployment workflow and GitHub deployment steps were removed from this repo.
