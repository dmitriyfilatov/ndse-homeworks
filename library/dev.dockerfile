FROM node:15-alpine

RUN apk --update --virtual build-deps add \
        bash \
        bash-completion

WORKDIR /app/library

ENTRYPOINT npm run dev