FROM ubuntu:18.04

ENV DEBIAN_FRONTEND noninteractive
ENV LC_ALL C.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8

RUN apt-get update -qq && apt-get install --no-install-recommends -y --force-yes ca-certificates openjdk-8-jre-headless dnsutils ruby2.5 ruby2.5-dev ruby-bundler rake icu-devtools libicu-dev nodejs npm git build-essential netcat && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN useradd --home-dir /home/app --create-home --shell /bin/bash app

WORKDIR /home/app
USER app

ADD package.json /home/app/
RUN NPM_CONFIG_OPTIONAL=false npm install

ADD Gemfile /home/app/
RUN bundle install --path=vendor/bundle

USER root
COPY [".", "/home/app"]

WORKDIR /home/app
USER app
RUN make

CMD ["true"]
