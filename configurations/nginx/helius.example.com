server {
  # Your default configuration comes here...
  listen 80;
  listen [::]:80;

  server_name helius.example.com;

  location / {
    proxy_pass             http://127.0.0.1:4000;
    proxy_set_header Host  $host;
    proxy_read_timeout     60;
    proxy_connect_timeout  60;
    proxy_redirect         off;
  }
}