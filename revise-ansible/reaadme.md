# playbooks

site.yml
webservers.yml
fooservers.yml




by default ansible will look for  most role directory for main.yml
roles/ 
   common/
      tasks/
        main.yml
      handlers/
        main.yml
      templates/
        ntp.conf.j2
      files/
        bar.txt
        foo.sh
      vars/
        main.yml
      defaults/
        main.yml
      meta/
        main.yml
      library/
      module_utils/
      lookup_plugins/
    webtier/
    monitoring/
    fooapp/