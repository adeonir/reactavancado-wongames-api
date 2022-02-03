FROM strapi/base:14-alpine

WORKDIR /opt/app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install --prod --frozen-lockfile

RUN npx browserslist@latest --update-db

COPY . .

ENV NODE_ENV=production
ENV DATABASE_CLIENT=postgres

RUN yarn build

EXPOSE 1337

CMD ["yarn", "start"]
