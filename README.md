# Web Scraper Worker Service

## Description
A containerized web scraping service that monitors product prices from various e-commerce websites (emag.bg, technopolis.bg) and provides a web interface to manage tracked products.

## Features
- Automated product price monitoring
- Web interface for managing tracked links (port 8080)
- Support for multiple e-commerce sources
- SQLite database for storing product data
- Docker containerization
- Factory pattern for easy addition of new sources

## Prerequisites
- Node.js v18.20.8 or higher
- Docker
- npm

## Installation

### Local Development
```powershell
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Build TypeScript
npm run build
```

### Docker
```powershell
# Build Docker image
docker build -t worker-service .

# Run container
docker run -p 8080:8080 -v worker-data:/app/data worker-service
```

## Usage

### Running the Worker
```powershell
npm start
```

### Running the Web Interface
```powershell
npm run web
```

The web interface will be available at `http://localhost:8080`

## Project Structure
```
worker/
├── src/
│   ├── interfaces/       # TypeScript interfaces
│   ├── sources/         # Product source implementations
│   ├── web/            # Web interface
│   └── index.ts        # Main worker entry point
├── prisma/
│   └── schema.prisma   # Database schema
├── Dockerfile
└── package.json
```

## Adding New Sources
1. Create a new source file in `src/sources`
2. Implement the `ProductSource` interface
3. Add the source to the factory in `src/sources/factory.ts`

## Environment Variables
Create a `.env` file:
```
DATABASE_URL="file:./data/products.db"
```

## License
MIT

Feel free to contribute or report issues!
