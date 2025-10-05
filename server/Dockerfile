FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
# Use npm install because we do not ship a lockfile in this scaffold
RUN npm install --omit=dev --no-audit --no-fund
COPY src ./src
EXPOSE 3000
CMD ["node", "src/index.js"]
