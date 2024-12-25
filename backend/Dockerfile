FROM python:3
LABEL maintainer="Ashwin Mahesh"

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    bash \
    curl \
    gnupg \
    file \
    gcc \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd -g 9999 ibuser \
    && useradd -u 9999 -g ibuser -s /bin/bash -m ibuser

COPY --chown=9999:9999 build/dnd_ai_assistant.zip /usr/local/bin/dnd_ai_assistant.zip

WORKDIR /
USER 9999:9999

# EXPOSE ${PORT}
ENV PORT=8080
EXPOSE 8080

CMD ["python3", "/usr/local/bin/dnd_ai_assistant.zip"]
