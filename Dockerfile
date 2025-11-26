# Step 1: Use an official Node.js image as the base image
FROM node:22-alpine AS builder

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (or yarn.lock) to the container
COPY package*.json ./

ENV NEXT_PUBLIC_BASE_URL=https://prod.myairesource.us
ENV NEXT_PUBLIC_BASE_URL_DOCS=https://prod.myairesource.us/api-docs
ENV NEXT_PUBLIC_PRIVATE_KEY=mLF8*#87!TiLwRfEzDYyDi!_0w
ENV NODE_ENV=demo
ENV PORT=3000
ENV NEXT_RUNTIME=nodejs
ENV CI=
ENV NEXT_PUBLIC_ENVIRONMENT=demo
ENV NEXT_PUBLIC_APP_URL=http://localhost:3000
ENV NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000
ENV NEXT_PUBLIC_NEW_APP_BASE_URL=http://localhost:3000
ENV NEXT_PUBLIC_DOMAIN_URL=http://localhost:3000
ENV NEXT_PUBLIC_DOMAIN_WEBSITE_URL=http://localhost:3000
ENV NEXT_PUBLIC_URL=http://localhost:3000
ENV NEXT_PUBLIC_PROD_URL=https://prod.myairesource.us
ENV NEXT_PUBLIC_DEMO_URL=https://demo.myairesource.us
ENV NEXT_PUBLIC_STAGING_URL=https://staging.myairesource.us
ENV NEXT_PUBLIC_PROD_APP_URL=https://app.myairesource.us
ENV NEXT_PUBLIC_DEMO_APP_URL=https://demo-app.myairesource.us
ENV NEXT_PUBLIC_STAGING_APP_URL=https://staging-app.myairesource.us
ENV NEXTAUTH_URL=http://localhost:3000
ENV NEXTAUTH_SECRET=CNwC4RsQeADriV8deXuXLwDF1TJvrDYlxvlyOjcRJkE=
ENV AUTH_TRUST_HOST=false
ENV ANALYZE=false
ENV BETTER_STACK_SOURCE_TOKEN=
ENV SENTRY_PROJECT=
ENV SENTRY_ORGANIZATION=
ENV NEXT_PUBLIC_SENTRY_DSN=
ENV NEXT_PUBLIC_SENTRY_DISABLED=false
ENV ARCJET_KEY=ajkey_test_123456789
ENV CHECKLY_LOGICAL_ID=localdev
ENV CHECKLY_PROJECT_NAME=devapp
ENV CHECKLY_EMAIL_ADDRESS=dev@example.com
ENV NEXT_PUBLIC_ENCRYPTION_KEY=dev_encryption_key_123
ENV NEXT_PUBLIC_ENCRYPTION_SALT=dev_salt_123
ENV NEXT_PUBLIC_POSTHOG_KEY=ph_test_123456
ENV NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the Next.js application
RUN npm run build

# Step 7: Create a production image
FROM node:22-alpine AS production

# Step 8: Set the working directory for the production environment
WORKDIR /app

# Step 9: Copy only the necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Step 10: Install production dependencies
RUN npm install --production

# Step 11: Expose the default port (3000 for Next.js)
EXPOSE 3000

# Step 12: Set the command to start the app in production mode
CMD ["npm", "start"]
