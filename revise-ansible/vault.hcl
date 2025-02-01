storage "file" {
        path="/opt/vault/data"
}

listener "tcp"{
        address="0.0.0.0:8200"
        tls_disable=1
}

api_adr = "http://privateip:8200"
ui= true
disable_mlock = true

# Set the log level (options: trace, debug, info, warn, err, critical)
log_level = "info"

# Set the log file path
log_file = "/var/log/vault/vault.log"
