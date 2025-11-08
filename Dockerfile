FROM oven/bun:1
WORKDIR /home/node/app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .


USER bun
CMD ["bun", "index.ts"]