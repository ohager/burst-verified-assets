# Burst Verified Assets

TO DO


# Development

> Prerequisites: NodeJS V14 installed - it's recommended to use (Node Version Manager)[https://github.com/nvm-sh/nvm]

1. `npm i`
2. `cp .env.example .env` and eventually adjust the vars accordingly
3. `npm run dev` to run locally on your machine

## Build and start a deployable static site

> This will be relevant for deployment on platforms like Vercel, Fastify, Github Pages etc.

1. `npm run export`
    - The static site is being available under __sapper__/build 
2. `npx serve __sapper__/export`


## Using a Mocked Mining Blockchain

> Prerequisites: Docker installed

1. `docker run -p 6876:6876 shefass/burstmockmining` (the image will be downloaded, if it's not already)
2. Set `SAPPER_APP_BURST_PEER_URL` in `.env` to `http://localhost:6876`


### Mine/Validate a block

#### Using UI API

1. Open `http://localhost:6876/test?requestTag=MINING` in your browser
2. Click on `submitNonce`
3. Enter a `secretPhrase` you want, i.e. `foo bar is cool`
4. Enter `nonce` = 0 (or any other value)
5. Click `submit`

#### Using curl

`curl --location --request POST 'http://localhost:6876/burst?requestType=submitNonce&secretPhrase=foo%20bar%20is%20cool&nonce=0'`
