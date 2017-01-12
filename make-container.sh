#!/bin/sh

#curl -s -k https://packages.cloud.google.com/apt/doc/apt-key.gpg > /var/tmp/apt-key.gpg
sudo lxc-start -F --name attalos -- /bin/sh -s <<'ENDSSH'
set -x
set -e

echo nameserver 10.0.0.2 | tee /etc/resolvconf/resolv.conf.d/base
resolvconf -u

cat /etc/resolv.conf
ping 8.8.8.8
ping google.com

ls -l /etc/
DEBIAN_FRONTEND=nonintaractive apt-get install -y nodejs
which node
node --version
ENDSSH
