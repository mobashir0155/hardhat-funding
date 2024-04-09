# Hardhat Funding Project

This project implements funding contract with hardhat along with unit test, staging test and coverage.

## Setup

```shell
yarn install

```

## Deploy localhost

```shell
yarn hardhat node
yarn hardhat run scripts/deploy.ts --network localhost
```

## Deploy testnet

```shell
yarn hardhat run scripts/deploy.ts --network sepolia
```

## Test

```shell
yarn hardhat test  || yarn test
yarn hardhat test --network sepolia || yarn test:staging
yarn hardhat coverage
```
