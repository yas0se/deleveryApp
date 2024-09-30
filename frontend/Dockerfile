FROM node:20 

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

COPY .next ./.next

CMD [ "npm" , "run" , "dev" ]
# docker build -t frontend .
# docker run -p 3000:3000 frontend