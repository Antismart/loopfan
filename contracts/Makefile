# LoopFan Smart Contracts Makefile
# Make sure to set up your .env file before running these commands

.PHONY: help build test deploy-testnet deploy-mainnet setup-tiers interact clean

# Load environment variables
include .env
export

help: ## Show this help message
	@echo "LoopFan Smart Contracts - Available Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	@echo "Installing Foundry dependencies..."
	forge install

build: ## Build contracts
	@echo "Building contracts..."
	forge build

test: ## Run all tests
	@echo "Running tests..."
	forge test -vv

test-coverage: ## Run tests with coverage report
	@echo "Running tests with coverage..."
	forge coverage

clean: ## Clean build artifacts
	@echo "Cleaning build artifacts..."
	forge clean

# Deployment commands
deploy-testnet: ## Deploy to Base Sepolia testnet
	@echo "Deploying to Base Sepolia..."
	forge script script/Deploy.s.sol:DeployScript \
		--rpc-url $(BASE_SEPOLIA_RPC_URL) \
		--broadcast \
		--verify \
		--etherscan-api-key $(BASESCAN_API_KEY) \
		-vvvv

deploy-mainnet: ## Deploy to Base mainnet (use with caution!)
	@echo "⚠️  DEPLOYING TO MAINNET - This will use real ETH!"
	@read -p "Are you sure you want to deploy to mainnet? (y/N): " confirm && [ "$$confirm" = "y" ]
	forge script script/Deploy.s.sol:DeployScript \
		--rpc-url $(BASE_MAINNET_RPC_URL) \
		--broadcast \
		--verify \
		--etherscan-api-key $(BASESCAN_API_KEY) \
		-vvvv

# Post-deployment setup
setup-tiers: ## Setup default membership tiers (requires MEMBERSHIP_NFT_ADDRESS)
	@echo "Setting up membership tiers..."
	@if [ -z "$(MEMBERSHIP_NFT_ADDRESS)" ]; then \
		echo "Error: MEMBERSHIP_NFT_ADDRESS not set"; \
		exit 1; \
	fi
	CREATOR_PRIVATE_KEY=$(PRIVATE_KEY) forge script script/SetupMembershipTiers.s.sol:SetupMembershipTiers \
		--rpc-url $(BASE_SEPOLIA_RPC_URL) \
		--broadcast \
		-vvv

# Interaction commands
interact: ## Check status of deployed contracts
	@echo "Checking contract status..."
	forge script script/Interact.s.sol:InteractScript \
		--rpc-url $(BASE_SEPOLIA_RPC_URL) \
		-vvv

tip-example: ## Send example tip (requires TIPJAR_ADDRESS and USER_PRIVATE_KEY)
	@echo "Sending example tip..."
	forge script script/Interact.s.sol:ExampleInteractions --sig "tipWithETH()" \
		--rpc-url $(BASE_SEPOLIA_RPC_URL) \
		--broadcast \
		-vvv

buy-membership: ## Buy membership example (requires addresses and TIER_ID)
	@echo "Buying membership..."
	forge script script/Interact.s.sol:ExampleInteractions --sig "buyMembership()" \
		--rpc-url $(BASE_SEPOLIA_RPC_URL) \
		--broadcast \
		-vvv

publish-content: ## Publish content example
	@echo "Publishing content..."
	forge script script/Interact.s.sol:ExampleInteractions --sig "publishContent()" \
		--rpc-url $(BASE_SEPOLIA_RPC_URL) \
		--broadcast \
		-vvv

# Verification commands
verify-contracts: ## Verify contracts on Basescan (if deployment verification failed)
	@echo "Verifying contracts..."
	@if [ -z "$(TIPJAR_ADDRESS)" ]; then echo "TIPJAR_ADDRESS not set"; exit 1; fi
	forge verify-contract $(TIPJAR_ADDRESS) src/TipJar.sol:TipJar \
		--chain-id 84532 \
		--etherscan-api-key $(BASESCAN_API_KEY)

# Development commands
format: ## Format code
	@echo "Formatting code..."
	forge fmt

lint: ## Run linter
	@echo "Running linter..."
	forge fmt --check

gas-report: ## Generate gas usage report
	@echo "Generating gas report..."
	forge test --gas-report

# Contract interaction helpers
get-tip-balance: ## Get creator balance from TipJar
	@if [ -z "$(TIPJAR_ADDRESS)" ]; then echo "TIPJAR_ADDRESS not set"; exit 1; fi
	cast call $(TIPJAR_ADDRESS) "creator()" --rpc-url $(BASE_SEPOLIA_RPC_URL)

get-membership-tiers: ## List all membership tiers
	@if [ -z "$(MEMBERSHIP_NFT_ADDRESS)" ]; then echo "MEMBERSHIP_NFT_ADDRESS not set"; exit 1; fi
	cast call $(MEMBERSHIP_NFT_ADDRESS) "nextTierId()" --rpc-url $(BASE_SEPOLIA_RPC_URL)

check-membership: ## Check if address has membership (requires USER_ADDRESS and TIER_ID)
	@if [ -z "$(MEMBERSHIP_NFT_ADDRESS)" ] || [ -z "$(USER_ADDRESS)" ] || [ -z "$(TIER_ID)" ]; then \
		echo "Missing required env vars: MEMBERSHIP_NFT_ADDRESS, USER_ADDRESS, TIER_ID"; \
		exit 1; \
	fi
	cast call $(MEMBERSHIP_NFT_ADDRESS) "isMember(address,uint256)(bool)" $(USER_ADDRESS) $(TIER_ID) --rpc-url $(BASE_SEPOLIA_RPC_URL)

# Local development
anvil: ## Start local Anvil node
	@echo "Starting Anvil local node..."
	anvil --host 0.0.0.0 --port 8545

deploy-local: ## Deploy to local Anvil node
	@echo "Deploying to local node..."
	forge script script/Deploy.s.sol:DeployScript \
		--rpc-url http://localhost:8545 \
		--broadcast \
		--private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
		-vvvv

# Useful for debugging
decode-error: ## Decode error from transaction hash (requires TX_HASH)
	@if [ -z "$(TX_HASH)" ]; then echo "TX_HASH not set"; exit 1; fi
	cast run $(TX_HASH) --rpc-url $(BASE_SEPOLIA_RPC_URL)

# Security
slither: ## Run Slither security analysis (requires slither installation)
	@echo "Running Slither security analysis..."
	slither .

# Documentation
docs: ## Generate documentation
	@echo "Generating documentation..."
	forge doc

docs-serve: ## Serve documentation locally
	@echo "Serving documentation on http://localhost:3000"
	forge doc --serve --port 3000
