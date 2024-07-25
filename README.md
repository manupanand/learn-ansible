# learn-ansible
repo for codes related to ansible study

## Install
 require 3.10 or greater so use pip.3.10 or greater pip-v
```
sudo pip-v install ansible
```
## ansible commands

```
ansible -i serverfilename all -e ansible_user=ec2-user -e ansible_password=passwd -m ping
```

### private key .pem

```
ansible all -i your_server_ip, -u ec2-user --private-key /path/to/your.pem -m ping

```

### ansible-playbook

``` 
ansible-playbook -i your_server_ip, -u ec2-user --private-key /path/to/your.pem your_playbook.yml
ansible-playbook -i hosts --private-key ~/path/name.pem playbook.yml
```

### inventory.yml or inventory.ini
```
ansible-playbook -i inventory.ini playbook.yml
ansible-playbook -i inventory.yml playbook.yml
```

### specific ssh port 

```
ansible-playbook -i ~/path/hosts -u username -e ansible_password=password -e role_name=role -e ansible_ssh_port=port ~/path/filename.yml

ansible-playbook -i ~/path/hosts -u username -e ansible_password=password -e ansible_become_password=sudo_password -e role_name=role -e ansible_ssh_port=port ~/path/filename.yml
```

### using dns record
```
ansible-playbook -i some.example.frontend.com, -u username -e ansible_password=password -e ansible_become_password=sudo_password -e role_name=role -e ansible_ssh_port=port ~/path/filename.yml
```
put comma after not going through a file

some people write all the codes in shell script to execute or use Makefile