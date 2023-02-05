FROM node:current-alpine

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

ADD https://raw.githubusercontent.com/SirlyDreamer/Yunzai-Bot/DockerResources/wqy-microhei/wqy-microhei.ttc /usr/share/fonts/wqy-microhei.ttc

RUN apk -U --no-cache update \
    && apk -U --no-cache upgrade \
    && apk -U --no-cache --allow-untrusted add git chromium nss freetype harfbuzz ca-certificates ttf-freefont \
    && git config --global --add safe.directory '*' \
    && git config --global pull.rebase false \
    && git config --global user.email "Yunzai@yunzai.bot" \
    && git config --global user.name "Yunzai"

WORKDIR /app

RUN git clone --depth=1 --branch main https://gitee.com/Le-niao/Yunzai-Bot.git \
    && cd ./Yunzai-Bot \
    && npm install pnpm -g \
    && pnpm install -P

WORKDIR /app/Yunzai-Bot

COPY ./docker-entrypoint.sh entrypoint.sh

RUN chmod +x ./entrypoint.sh \
    && sed -i 's/127.0.0.1/redis/g' ./config/default_config/redis.yaml \
    && rm -rf /var/cache/* \
    && rm -rf /tmp/*

ENTRYPOINT ["./entrypoint.sh"]
