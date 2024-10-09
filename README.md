for Setup following commands need to be run
```
npm i
npx wrangler login
npx wrangler d1 create billing-system-db
npx wrangler d1 execute billing-system-db --local --file=./initial-schema.sql ## for creating required table locally 
npx wrangler d1 execute billing-system-db --remote --file=./initial-schema.sql ## for creating required table on remote(cloudflare)
```

for Running locally,
```
npm run dev
```

for publishing worker on cloudflare Worker, we can use bellow command
```
npm run publish
```
or 

we can setup github pipeline, can control setup from wrangler configuration.
