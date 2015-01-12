# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.ssh.forward_agent = true
  config.ssh.username = ENV["VAGRANT_USERNAME"] || "vagrant"
  if ENV["VAGRANT_PRIVATE_KEY_PATH"]
    config.ssh.private_key_path = ENV["VAGRANT_PRIVATE_KEY_PATH"]
  end

  config.vm.provider :virtualbox do |vb|
    vb.customize ["modifyvm", :id, "--memory", 1024 * 1]
    vb.customize ["modifyvm", :id, "--natdnshostresolver1", "off"]
    vb.customize ["modifyvm", :id, "--natdnsproxy1", "off"]
  end

  stack = "attalos"
  config.vm.define(stack) do |node|
    config.vm.synced_folder ".", "/vagrant", :disabled => false
    #node.vm.box = "trusty64" # ubuntu 14.x LTS, has issues with apparmor
    #node.vm.box_url = "http://cloud-images.ubuntu.com/vagrant/trusty/current/trusty-server-cloudimg-amd64-vagrant-disk1.box"
    node.vm.box = "precise64" # ubuntu 12.x LTS
    node.vm.box_url = "http://cloud-images.ubuntu.com/vagrant/precise/current/precise-server-cloudimg-amd64-vagrant-disk1.box"
    node.vm.network :private_network, ip: "10.0.30.11"
  end
end
