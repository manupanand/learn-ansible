git pull
ansible-playbook -i $1-dev.rdevops.online, -e ansible_user=ec2-user -e ansible_password=password  -e role_name=$1 playbook.yml
