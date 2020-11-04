# Burst Verified Assets
## A Burst token protocol extension

This protocol describes a new Burst token protocol layer. A layer that allows any token to create a stronger link to the real/digital assets. Making it more attractive to tokenize and sell assets on the Burst platform to non-Burst account holders.

All the information of the asset is collected in a JSON (asset/token id, custom buy url, websites, contact, media, downloads and SHA256 hashes). This data is used within a javascript web app to generate a portal for each asset.

Burst's built-in asset/token system provides the means to create a token. While the alias system gives a human readable unique index and allows for mutable storage of the JSON data. Which is useful for asset updates from the creator and automatically signed and secure. For example a software binary update with new urls and hashes.

The web portal acts as a token specific wallet. The visitor of the portal creates a Burst compatible paper wallet, to hold the token and only holds some Burst (plancks) for token and account transactions. The Burst can be obtained from the seller via the custom token buy link (webshop) or Burst faucet. 

Users can import existing Burst accounts holding more assets. But the security model via browser password input should not encourage this. This model is compatible with password managers to lower the onboarding threshold.

The verified aspect of this protocol is performed by dropping the asset files on the web portal. This calculates the SHA256 hash of the file and will attempt to match it with the hashes in the asset JSON. This verification ensures that the file is genuine to the tokens they represent.


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
