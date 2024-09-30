FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
EXPOSE 3001
RUN chown -R node /app
USER node
CMD ["npm", "start"]
# docker build -t frontend .
# docker run -p 3000:3000 frontend