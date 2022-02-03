FROM strapi/base:14

WORKDIR /opt/app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN apt-get install -y build-essential

RUN yarn install --prod

RUN npx browserslist@latest --update-db

COPY . .

RUN yarn build

EXPOSE 1337

ENV NODE_ENV=14
ENV DATABASE_CLIENT=postgres

CMD ["yarn", "start"]
