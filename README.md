# Gelato <img src="./public/gelato-icon.svg" alt="Logo" width="24" align="center" /> - EIP-7702 Next.js Demo

<hr/>

![Next.js](https://img.shields.io/badge/-Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Wagmi](https://img.shields.io/badge/Wagmi-FFD700?style=for-the-badge&logo=ethereum&logoColor=black)
![Gelato](https://img.shields.io/badge/Gelato-FF4A4A?style=for-the-badge&logo=gelato&logoColor=white)
![Pnpm](https://img.shields.io/badge/pnpm-yellow?style=for-the-badge&logo=pnpm&logoColor=white)

A Next.js playground for exploring EIP-7702 gas sponsorship and account abstraction, powered by Gelato

---

## Prerequisites

- Git
- Node.js (v18 or higher)
- pnpm

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=your-dynamic-environment-id
NEXT_PUBLIC_GELATO_API_KEY="your-gelato-sponsor-api-key"
NEXT_PUBLIC_RPC_URL="your-rpc-url"
```

### How to get Gelato Sponsor API key?

--- Navigate to [Gelato App](https://app.gelato.network) into relay section -> Create Relay App -> Add your networks -> Get API Key ([Learn More](https://docs.gelato.network/web3-services/relay/quick-start/sponsored-calls))

---

## Getting Started

1. **Clone the repository:**

   ```sh
   git clone https://github.com/gelatodigital/gelato-smart-wallet-sdk-demo.git
   cd gelato-smart-wallet-sdk-demo
   ```

2. **Install dependencies:**

   ```sh
   pnpm install
   ```

3. **Set up your environment variables** as described above.

4. **Start the development server:**
   ```sh
   pnpm dev
   ```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## Building for Production

```sh
pnpm build
```

To start the production server:

```sh
pnpm start
```

---

## Project Structure

- `/app` - Next.js app router, layouts, and pages
- `/components` - Reusable UI and feature components
- `/lib` - Utility functions and custom hooks
- `/public` - Static assets (images, SVGs, etc.)
- `/constants` - Project-wide constants (add as needed)
- `/providers` - React context and global providers (add as needed)

---

## Features

- ⚡ Explore EIP-7702 gas sponsorship and account abstraction
- 🔗 Connect and manage Ethereum wallets
- 🧮 Gas estimation and transaction modals
- 📜 Activity log for blockchain actions
- 🎨 Responsive, modern UI with TailwindCSS
- 🦄 Powered by Gelato

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

## Acknowledgements

- [Gelato Network](https://www.gelato.network/)
- [Next.js](https://nextjs.org/)
- [Wagmi](https://wagmi.sh/)
- [Ethers.js](https://docs.ethers.org/)
- [TailwindCSS](https://tailwindcss.com/)
