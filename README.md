# Instrucciones

## Local

Configurar Access y Secret de AWS

## Subir lambda

npm install

npm run build

delete node_modules

npm install --omit=dev

zip -r payments-core.zip build node_modules/

# Nueva Lambda

npm run build

zip -r build/handler.zip build/handler.js
