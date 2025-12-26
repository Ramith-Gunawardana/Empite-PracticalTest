# Places API Proxy - Vercel Serverless Function

This is a secure proxy for Google Places API to prevent exposing your API key in the mobile app.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Environment File

Create a `.env` file:

```bash
GOOGLE_PLACES_API_KEY="API_KEY"
```

### 3. Install Vercel CLI

```bash
npm install -g vercel
```

### 4. Deploy to Vercel

```bash
vercel login
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? Select your account
- Link to existing project? **No**
- Project name? **places-api-proxy** (or your choice)
- Directory? **./** (current directory)
- Override settings? **No**

### 5. Add Environment Variable

After deployment:

```bash
vercel env add GOOGLE_PLACES_API_KEY
```

Enter your Google API key when prompted, and select **Production**.

### 6. Redeploy with Environment Variable

```bash
vercel --prod
```

### 7. Get Your API URL

After deployment, you'll get a URL like:
```
https://places-api-proxy.vercel.app
```

Your endpoint will be:
```
https://places-api-proxy.vercel.app/api/places
```

### 8. Update React Native App

Update `src/config/env.ts` with your Vercel URL:

```typescript
export const Config = {
  PLACES_API_URL: 'https://your-project.vercel.app/api/places',
  // ... other config
};
```

## Testing Locally

```bash
vercel dev
```

Then test with:
```bash
curl -X POST http://localhost:3000/api/places \
  -H "Content-Type: application/json" \
  -d '{"latitude": 37.7749, "longitude": -122.4194, "radius": 1500}'
```

## API Usage

### Endpoint
`POST /api/places`

### Request Body
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "radius": 1500
}
```

### Response
```json
{
  "results": [...],
  "status": "OK"
}
```

## Security

- API key is stored as Vercel environment variable (never in code)
- CORS enabled for mobile app access
- Only POST requests allowed
- Input validation for required parameters

## Google Cloud Console Setup

For the Places API key used on Vercel:

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create/Edit API key
3. Application restrictions: **HTTP referrers**
4. Add: `*.vercel.app/*`
5. API restrictions: Select **Places API**

This restricts the key to only work from your Vercel deployment.
