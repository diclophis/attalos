http://www.dialogic.com/den/developer_forums/f/71/t/10238.aspx

In my last post, I talked about the firewall traversal infrastructure needed for a robust WebRTC application.  I mentioned a TURN server that we have successfully used, but didn't provide any details for setting it up and using it.

Well, here they are...

This is the open source TURN server used is called the rfc5766-turn-server. It is described as a "high-performance free open source TURN Serve implementation for VoIP media traffic, NAT traversal and gateway".

The project can be found here: https://code.google.com/p/rfc5766-turn-server.

The Linux distribution I used for the TURN server was CentOS 6.2. A relatively sparse, non-GUI, server-oriented configuration of the OS should suffice.

The system used for TURN in the case I'm describing here resides at a public IP address, with no firewall involved. It may be possible to set up a TURN server using a cloud service like AWS, but that is beyond the scope of these instructions.

Before installing and configuring the TURN server, the latest libevent library should be downloaded built and installed. As of April 2013, this would be the download from  https://github.com/downloads/libevent/libevent/libevent-2.0.21-stable.tar.gz.

As root, build and install the library with the usual:

> tar xvfz libevent-2.0.21-stable.tar.gz
> cd libevent-2.0.21-stable
> ./configure
> make
> make install

Download the TURN server from  https://code.google.com/p/rfc5766-turn-server/list/download. Build and install with:

> tar xvfz turnserver-1.8.2.0.tar.gz
> ./configure
> make
> make install

There are a good set of README files with the server.  Take a look through them to get a feeling for the software.

The TURN server can either use a flat file or a SQL database for configuration and user information. The simpler flat file, fine for initial testing, will be covered here. Edit /usr/local/etc/turnuserdb.conf. Add an entry on its own line:

my_username:my_password

In your Javascript code where the RTCPeerConnection is created, reference the TURN server as follows:

        var pc_config = {"iceServers": [{"url": "stun:stun.l.google.com:19302"},            {"url":"turn:my_username@<turn_server_ip_address>", "credential":"my_password"}]};
        pc_new = new webkitRTCPeerConnection(pc_config);

Embedding a visible password in your Javascript code may allow someone else to use your TURN server.  I will provide some more info on better security soon.

Since the server is publicly accessible, access to it should be restricted as much as possible. Minimally, port 3478 (STUN) should be opened for TCP and UDP. The most convenient way to do this on CentOS is to use the firewall configuration option of "setup". Select Customize and Forward until the Other Ports screen is found.  There, add 3478:tcp and 3478:upd. Close and save, then restart the firewall with:

> service iptables restart

Check the firewall with:

> service iptables status
Table: filter
Chain INPUT (policy ACCEPT)
num  target     prot opt source               destination
1    ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0           state RELATED,ESTABLISHED
2    REJECT     icmp --  0.0.0.0/0            0.0.0.0/0           icmp type 8 reject-with icmp-host-prohibited
3    ACCEPT     icmp --  0.0.0.0/0            0.0.0.0/0
4    ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0
5    ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0           state NEW tcp dpt:22
6    ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0           state NEW tcp dpt:3478
7    ACCEPT     udp  --  0.0.0.0/0            0.0.0.0/0           state NEW udp dpt:3478
8    REJECT     all  --  0.0.0.0/0            0.0.0.0/0           reject-with icmp-host-prohibited

Chain FORWARD (policy ACCEPT)
num  target     prot opt source               destination
1    REJECT     all  --  0.0.0.0/0            0.0.0.0/0           reject-with icmp-host-prohibited

Chain OUTPUT (policy ACCEPT)
num  target     prot opt source               destination

Note that this configuration has ICMP ping disabled to make the system harder to find and port 22 left open for SSH access.

Finally, for this relatively simple case that uses a system with a single Ethernet NIC and IP addres and no NAT firewall, start the TURN server with:

> turnserver -L <public_ip_address> -a -b turnuserdb.conf -f -r <system_domain_name>

Or, start it as a Linux daemon with:

> turnserver -L <public_ip_address> -o -a -b turnuserdb.conf -f -r <system_domain_name>

The TURN server should now be ready to use for media relay when ICE decides that it is needed for a WebRTC connection.

 

-John
