# DeFAI Energy Optimization Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Live Demo

Visit our live demo at: [https://greenodeai.netlify.app/](https://greenodeai.netlify.app/)

## Description

Base GreenNode Energy Optimization is a blockchain energy monitoring and optimization platform built on Base Sepolia. It provides real-time analysis of smart contract energy consumption using AI-powered insights to suggest gas optimizations and reduce environmental impact.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Installation

1. Clone the repository

```bash
git clone https://github.com/adidabakare/greenode-ai-agent
cd greenode-ai-agent
```

2. Install dependencies

```bash
yarn install
```

3. Copy environment variables

```bash
cp .env.example .env
```

4. Set up database

```bash
yarn db:push
```

## Usage

Start the development server:

```bash
yarn dev
```

Access the dashboard at `http://localhost:3000`

## Features

- Real-time transaction monitoring
- AI-powered gas optimization suggestions
- Energy impact analysis and visualization
- Smart contract efficiency tracking
- Automated optimization alerts
- Carbon footprint reporting

## Configuration

Required environment variables:

```env
# Database Configuration
DATABASE_URL=your_neon_db_url

# Blockchain Configuration
BASE_SEPOLIA_RPC=your_rpc_url
PRIVATE_KEY=your_wallet_private_key

# AI Configuration
NEXT_PUBLIC_AI_ENDPOINT= your_ai_endpoint
NEXT_PUBLIC_AI_USERNAME= your_username
NEXT_PUBLIC_AI_PASSWORD= your_password
```

## API Reference

### Monitor Transaction

```typescript
POST /api/agent
Content-Type: application/json

{
    "type": "transaction",
    "data": {
        "hash": string,
        "gasUsed": bigint,
        "input": string
    }
}
```

### Get Network Analysis

```typescript
POST /api/agent
Content-Type: application/json

{
    "type": "network",
    "data": {
        "totalGasUsed": bigint,
        "averageGasPrice": bigint,
        "transactionCount": number
    }
}
```

## Testing

Run the test suite:

```bash
# Run unit tests
yarn test

# Run contract tests
npx hardhat test
```

## Deployment

1. Deploy smart contracts:

```bash
npx hardhat run scripts/deploy.ts --network baseSepolia
```

2. Build and deploy frontend:

```bash
yarn build
yarn start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Name - [@Pakari Isbum](https://github.com/pakariisbum0)

Project Link: [pakariisbum](https://github.com/pakariisbum0)
