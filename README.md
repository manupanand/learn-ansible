# learn-ansible
repo for codes related to ansible study

Install
 require 3.10 or greater so use pip.3.10 or greater pip-v
```
sudo pip-v install ansible
```
##
ansible commands

```
ansible -i serverfilename all -e ansible_user=ec2-user -e ansible_password=passwd -m ping
```

private key .pem

```
ansible all -i your_server_ip, -u ec2-user --private-key /path/to/your.pem -m ping

```