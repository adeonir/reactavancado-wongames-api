FROM strapi/base:14

ENV NODE_ENV production
ENV DATABASE_CLIENT=postgres

WORKDIR /opt/app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install --prod

RUN npx browserslist@latest --update-db

COPY . .

RUN yarn build

EXPOSE 1337
CMD ["yarn", "start"]
