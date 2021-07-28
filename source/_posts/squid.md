---
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
title: Squid 代理服务器配置
date: 2017-04-21 11:10:50
tags:
    - Squid
categories:
    - 工具
---
## 安装

```shell
yum -y install squid
```


安装`Mysql`



```
yum install perl-ExtUtils-CBuilder perl-ExtUtils-MakeMaker -y
```



安装`DBI-1.636.tar.gz`

```
wget http://search.cpan.org/CPAN/authors/id/T/TI/TIMB/DBI-1.636.tar.gz
tar -xvf DBI-1.636.tar.gz

cd DBI-1.636

make
make install
```


安装 `DBD-mysql-4.039.tar.gz` 时，需要设置
```
wget http://www.cpan.org/authors/id/C/CA/CAPTTOFU/DBD-mysql-4.039.tar.gz
tar -xvf DBD-mysql-4.039.tar.gz

cd DBD-mysql-4.039

perl Makefile.PL --mysql_config=/usr/bin/mysql_config
make
make install
```





*配置文件 `squid.conf`*
```
#auth_param basic program /usr/lib64/squid/basic_ncsa_auth /etc/squid/passwd
auth_param basic program /usr/lib64/squid/basic_db_auth --user root --password mysql2016 --plaintext --persist
auth_param basic children 5
auth_param basic realm Squid proxy-caching web server
auth_param basic credentialsttl 2 hours
acl normal proxy_auth REQUIRED
http_access allow normal

#
# Recommended minimum configuration:
#

# Example rule allowing access from your local networks.
# Adapt to list your (internal) IP networks from where browsing
# should be allowed
acl localnet src 10.0.0.0/8     # RFC1918 possible internal network
acl localnet src 172.16.0.0/12  # RFC1918 possible internal network
acl localnet src 192.168.0.0/16 # RFC1918 possible internal network
acl localnet src fc00::/7       # RFC 4193 local private network range
acl localnet src fe80::/10      # RFC 4291 link-local (directly plugged) machines

acl SSL_ports port 443
acl Safe_ports port 80          # http
acl Safe_ports port 21          # ftp
acl Safe_ports port 443         # https
acl Safe_ports port 70          # gopher
acl Safe_ports port 210         # wais
acl Safe_ports port 1025-65535  # unregistered ports
acl Safe_ports port 280         # http-mgmt
acl Safe_ports port 488         # gss-http
acl Safe_ports port 591         # filemaker
acl Safe_ports port 777         # multiling http
acl CONNECT method CONNECT


#
# Recommended minimum Access Permission configuration:
#
# Deny requests to certain unsafe ports
http_access deny !Safe_ports

# Deny CONNECT to other than secure SSL ports
http_access deny CONNECT !SSL_ports

# Only allow cachemgr access from localhost
http_access allow localhost manager
http_access deny manager

# We strongly recommend the following be uncommented to protect innocent
# web applications running on the proxy server who think the only
# one who can access services on "localhost" is a local user
#http_access deny to_localhost

#
# INSERT YOUR OWN RULE(S) HERE TO ALLOW ACCESS FROM YOUR CLIENTS
#

# Example rule allowing access from your local networks.
# Adapt localnet in the ACL section to list your (internal) IP networks
# from where browsing should be allowed
http_access allow localnet
http_access allow localhost

# And finally deny all other access to this proxy
http_access allow all

# Squid normally listens to port 3128
http_port 3128

# Uncomment and adjust the following to add a disk cache directory.

# Uncomment and adjust the following to add a disk cache directory.
#cache_dir ufs /var/spool/squid 100 16 256

# Leave coredumps in the first cache dir
coredump_dir /var/spool/squid

#
# Add any of your own refresh_pattern entries above these.
#
refresh_pattern ^ftp:           1440    20%     10080
refresh_pattern ^gopher:        1440    0%      1440
refresh_pattern -i (/cgi-bin/|\?) 0     0%      0
refresh_pattern .               0       20%     4320

#auth_param basic program /usr/lib64/squid/ncsa_auth /etc/squid/passwd
#auth_param basic children 5        
#auth_param basic credentialsttl 1 hours    
#auth_param basic realm my test prosy         
#acl test123 proxy_auth REQUIRED  
#http_access allow test123    

#auth_param basic program /usr/lib64/squid/basic_ncsa_auth /etc/squid/passwd
#auth_param basic children 5
#auth_param basic realm Squid proxy-caching web server
#auth_param basic credentialsttl 2 hours
#acl normal proxy_auth REQUIRED
#http_access allow normal                                      
```
