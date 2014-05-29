openssl genrsa -out ./app/keys/key.pem
openssl req -new -key ./app/keys/key.pem -out ./app/keys/csr.pem
openssl x509 -req -days 9999 -in ./app/keys/csr.pem -signkey ./app/keys/key.pem -out ./app/keys/cert.pem
rm ./app/keys/csr.pem
