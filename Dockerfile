# Step 1: Use an official Node.js image as the base image
FROM node:18 AS builder

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (or yarn.lock) to the container
COPY package*.json ./

ENV NEXT_PUBLIC_BASE_URL=https://prod.myairesource.us
ENV NEXT_PUBLIC_BASE_URL_DOCS=https://prod.myairesource.us/api-docs
ENV NEXT_PUBLIC_PRIVATE_KEY=mLF8*\$4LwRfEzDYyDi!_0w

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the Next.js application
RUN npm run build

# Step 7: Create a production image
FROM node:18 AS production

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
