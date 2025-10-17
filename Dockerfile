FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 4100
CMD ["npm", "start"]
