FROM ubuntu:16.04
ENV DEBIAN_FRONTEND noninteractive
ENV LC_ALL C.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8
#RUN locale-gen --purge en_US.UTF-8 && /bin/echo -e  "LANG=$LANG\nLANGUAGE=$LANGUAGE\n" | tee /etc/default/locale && locale-gen $LANGUAGE && dpkg-reconfigure locales
RUN apt-get update -qq && apt-get install --no-install-recommends -y --force-yes icu-devtools libicu-dev libicu55 nodejs npm git build-essential netcat && apt-get clean && rm -rf /var/lib/apt/lists/*
RUN ln -s /usr/bin/nodejs /usr/bin/node

RUN useradd --home-dir /home/app --create-home --shell /bin/bash app

ADD package.json /home/app/
ADD npm-shrinkwrap.json /home/app/

RUN chown -R app. /home/app

WORKDIR /home/app
USER app
RUN NPM_CONFIG_OPTIONAL=false npm install

ADD web.js /home/app
ADD public /home/app/public

CMD ["true"]