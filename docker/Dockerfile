FROM node:16-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile --ignore-scripts

COPY . .

EXPOSE 9060

CMD ["yarn", "serve"]

