FROM oven/bun:1
WORKDIR /usr/src/app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .

RUN bun db:migrate

USER bun
ENTRYPOINT ["bun"]
CMD ["index.ts"]