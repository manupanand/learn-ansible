sudo useradd --system --home-dir /etc/vault.d vault
sudo groupadd vault
sudo chown -R vault:vault /etc/vault.d /opt/vault/data
sudo systemctl daemon-reload
sudo systemctl enable vault
sudo systemctl start vault
sudo chown vault:vault /var/log/vault

sudo chown vault:vault /var/log/vault/vault.log


------------------------------
Step 1: Store the .pem Key in Vault

First, you'll store the .pem file in HashiCorp Vault as a secret.

    Authenticate with Vault (if you haven’t already):

vault login <your-vault-token>

Store the .pem file in Vault: You can use the vault kv put command to store the private key.

    Create a new secret path (e.g., ssh_key/my_key) and store your .pem file:

vault kv put secret/ssh_key/my_key key=@/path/to/your/private_key.pem

    If using Vault's transit engine to encrypt, the process is slightly different.

Verify the key has been stored correctly:

    vault kv get secret/ssh_key/my_key

    This should display the contents of the .pem file.

Step 2: Configure Ansible to Retrieve the .pem Key from Vault

Ansible can be configured to use Vault to retrieve the .pem key, and then use it to configure a server.

To do this, you'll need to integrate Ansible Vault with HashiCorp Vault by using the hashivault lookup plugin.
Install Required Dependencies:

You need to install the hvac library, which is a Python client for HashiCorp Vault, and Ansible Vault integration with Vault.

pip install hvac

Example Playbook Configuration

    Configure Ansible Vault: First, you need to set up the integration between Vault and Ansible. To do this, you’ll use the hashivault lookup plugin in your playbook.

    Playbook Example: Here’s an example of an Ansible Playbook that retrieves the .pem private key from Vault and uses it for SSH configuration on a remote server:

---
- name: Retrieve PEM key from Vault and configure the server
  hosts: all
  gather_facts: no
  vars:
    # Vault URL and token (You can also store Vault token securely as an environment variable)
    vault_addr: "http://your-vault-address:8200"
    vault_token: "your-vault-token"
  
  tasks:
    - name: Fetch the PEM key from Vault
      ansible.builtin.set_fact:
        ssh_key: "{{ lookup('hashivault', 'secret/ssh_key/my_key key', vault_url=vault_addr, vault_token=vault_token) }}"
    
    - name: Show the fetched key (for debugging purposes)
      debug:
        msg: "{{ ssh_key }}"

    - name: Configure server using the SSH key
      ansible.builtin.user:
        name: myuser
        state: present
        ssh_key: "{{ ssh_key }}"
        comment: "SSH User"

Explanation of Playbook:

    vault_addr: Your Vault server URL (e.g., http://your-vault-address:8200).
    vault_token: The token used to authenticate with Vault.
    lookup('hashivault', ...): This will fetch the secret (i.e., the .pem private key) from Vault.
    ssh_key: The private key that will be retrieved and used in the playbook.

Step 3: Using the PEM Key in Ansible

The .pem key can now be used in Ansible tasks. For example:

    Using the PEM Key for SSH: If you want to use the private key for SSH connections, you can specify the ssh_key in your playbook or inventory configuration. For instance:

- name: Use SSH key for connecting to the remote server
  hosts: all
  tasks:
    - name: Fetch the PEM key from Vault
      ansible.builtin.set_fact:
        ssh_key: "{{ lookup('hashivault', 'secret/ssh_key/my_key key', vault_url=vault_addr, vault_token=vault_token) }}"

    - name: Add SSH key to remote server user
      ansible.builtin.authorized_key:
        user: myuser
        state: present
        key: "{{ ssh_key }}"

In this example, the .pem private key is retrieved from Vault and is used to configure the myuser account on the remote server. The authorized_key module ensures that the key is present in the ~/.ssh/authorized_keys file for the user.
Step 4: Run the Playbook

Once your playbook is ready, run it using the following command:

ansible-playbook -i inventory_file your-playbook.yml

Step 5: Vault Token Management

Make sure to securely manage your Vault token. Ideally, avoid hardcoding it in the playbook and instead use environment variables or a Vault authentication method (e.g., AppRole or Kubernetes auth) to authenticate securely.
Summary

By following these steps, you:

    Store your .pem file (SSH private key) in HashiCorp Vault.
    Integrate Vault into your Ansible playbook using the hashivault lookup plugin.
    Retrieve the key dynamically from Vault during Ansible runs.
    Use the key in your playbook to configure servers or perform actions requiring SSH access.

This approach allows you to securely manage SSH keys without exposing them directly in your Ansible playbooks or configuration files.

Let me know if you need any more details!
