FROM 549230430157.dkr.ecr.us-east-2.amazonaws.com/instabase-build/python:3.9.17
LABEL maintainer="Ashwin Mahesh"

RUN apk add --no-cache \
        bash \
        curl \
        libmagic \
        libstdc++ \
    && addgroup -g 9999 ibuser \
    && adduser -u 9999 -S -H -G ibuser ibuser

COPY --chown=9999:9999 build/prediction_engine.zip /usr/local/bin/prediction_engine.zip
COPY --chmod=755 start-main.sh /usr/local/bin/start-main.sh

WORKDIR /
USER 9999:9999
# CMD ["/bin/bash", "/usr/local/bin/start-main.sh"]
CMD ["python", /usr/local/bin/prediction_engine.zip]
