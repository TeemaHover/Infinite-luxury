FROM golang:1.21 AS build-tools
RUN go install github.com/tj/node-prune@latest

FROM node:20 AS build
ARG NPM_TOKEN
ENV NPM_TOKEN=$NPM_TOKEN
WORKDIR /app

COPY --from=build-tools /go/bin/node-prune /usr/local/bin/node-prune

COPY package.json package-lock.json tsconfig.json .npmrc tsconfig.build.json ./
COPY src ./src

RUN npm install && npm run build && rm -rf node_modules && \
    npm install --omit=dev

# ---- timezone helper stage (new, small) ----
FROM debian:bookworm-slim AS tz
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && \
    apt-get install -y --no-install-recommends tzdata && \
    rm -rf /var/lib/apt/lists/*
# Prepare files we’ll copy to the final image
RUN cp /usr/share/zoneinfo/Asia/Ulaanbaatar /etc/localtime && \
    printf "Asia/Ulaanbaatar\n" > /etc/timezone

FROM node:20-slim

WORKDIR /opt/oracle

RUN apt-get update && \
    apt-get install -y libaio1 unzip curl && \
    curl -o instantclient-basiclite.zip https://download.oracle.com/otn_software/linux/instantclient/1918000/instantclient-basiclite-linux.x64-19.18.0.0.0dbru.zip -SL && \
    unzip instantclient-basiclite.zip && \
    mv instantclient*/ /opt/oracle/instantclient && \
    rm -f instantclient-basiclite.zip && \
    rm -f /opt/oracle/instantclient/*jdbc* *occi* *mysql* *jar uidrvci genezi adrci && \
    echo /opt/oracle/instantclient > /etc/ld.so.conf.d/oracle-instantclient.conf && \
    ldconfig && \
    apt-get purge unzip curl -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV LD_LIBRARY_PATH=/opt/oracle/instantclient
ENV NODE_ENV=production
# Make TZ available to apps and libc uses /etc/localtime
ENV TZ=Asia/Ulaanbaatar

WORKDIR /app

# Copy timezone files from the tz stage (no tzdata install needed here)
COPY --from=tz /etc/localtime /etc/localtime
COPY --from=tz /etc/timezone /etc/timezone

COPY --from=build /app/package.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "./dist/main.js"]