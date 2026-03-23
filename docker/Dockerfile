FROM node:16-alpine

WORKDIR /app

# Install dependencies first for better layer caching
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

# Copy source after deps so code changes don't bust the yarn cache layer
COPY . .

EXPOSE 9060

CMD ["yarn", "serve"]

