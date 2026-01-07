Mantle RPC
With Quicknode, you get access to our global Mantle network which always routes your API requests to the nearest available location, ensuring low latency and the fastest speeds.
Mantle Overview
Mantle Network is an EVM-compatible scaling solution for Ethereum built as an optimistic rollup with a modular architecture.

Under the hood, Mantle separates transaction execution, consensus, settlement, and storage into individual modules. Its core infrastructure includes an EVM-compatible execution layer for transaction execution, consensus and settlement layers completed on Ethereum, and an external data availability component powered by Mantle DA (data availability).

Mantle utilizes Ethereum validators and consensus protocols, with L2 state transitions verified by Ethereum validators through the same consensus and settlement processes as L1 transactions. Users can customize transaction confirmation requirements for low confirmation latency.

Interacting with Mantle APIs
Mantle supports standard Ethereum JSON-RPC methods, allowing developers to use familiar Ethereum development tools and libraries without modification. All contracts and tools running on Ethereum can operate on Mantle Network with minimal changes.

For the most current information on Mantle specific features and RPC behavior, we recommend referencing the official Mantle documentation alongside our documentation.

Making API Requests on Mantle
The quickest way to start building on Mantle is to create a Quicknode endpoint and send your first JSON-RPC request.

Quicknode provides managed Mantle endpoints, giving you immediate access to Mantle Mainnet and Sepolia without the overhead of running infrastructure. These endpoints offer:


High reliability – globally distributed infrastructure designed to minimize downtime
Enhanced performance – optimized latency and request handling for production-grade apps
Integrated ecosystem – additional functionality through specialized APIs (add-ons) on the Quicknode Marketplace and products like Streams
Visit the QuickStart page to create your endpoint and send your first request.

Supported Networks
Quicknode provides access to the following Mantle networks:

Network
Type
Chain ID
HTTP
WSS
Archive
Pruning
Mainnet
Production
5000
Yes
None
Sepolia
Testnet
5001
Yes
None
Complete reference for developers building on Mantle with Quicknode:

QuickStart
Get started with Mantle quickly. Follow our step-by-step quickstart to set up your endpoint and make your first API request.

Provider Endpoints
Learn how to configure and manage your Mantle endpoints for optimal performance and reliability.

API Overview
Explore supported APIs, networks, Quicknode products, and enhanced API features for building powerful applications.

Marketplace
Discover and integrate powerful add-ons and tools from the Quicknode Marketplace to enhance your web3 applications.

Endpoint Security
Secure your endpoints with authentication, whitelisting, and best security practices.

Error Codes
Understand common error codes and troubleshooting steps for Mantle API requests.

Last updated on Nov 26, 2025
Share this doc


Mantle QuickStart
Updated on
Nov 26, 2025
The quickest way to start building on Mantle with Quicknode is by sending a JSON-RPC request to your endpoint. In this quickstart, you’ll create an endpoint, copy its provider URL, and make your first request. Code samples are available in cURL as well as popular SDKs and programming languages.

Get Your Mantle Endpoint
1
Create a Quicknode account
Sign up here if you haven't already.

2
Go to your dashboard
Open the Endpoints dashboard from the left sidebar menu to manage all your blockchain endpoints

3
Create a new endpoint
Click Create an Endpoint in the top-right corner, select Mantle as your blockchain, then select your preferred network

4
Copy your provider URLs
Keep the HTTP URL handy. You'll use it in your requests below.

Learn More about the Dashboard
For a detailed walkthrough of the Quicknode dashboard, check out our guide


Send Your First Request
Your endpoint is ready. Now, let's make your first call to the Mantle blockchain. We’ll use the eth_blockNumber method, which returns the latest block number. Select your preferred language or SDK and follow the steps below to send your first request.


cURL
Quicknode SDK
Python
JavaScript
Ruby
Go
Ethers.js
Web3.py
Eth.rb
Ethgo
1
Check cURL installation
Most *nix based systems have cURL support out of the box. Open your terminal and check the cURL version by running the command below:

curl --version

2
Send a JSON-RPC request
In your terminal, copy and paste the following cURL command to retrieve the latest block number:

curl -X POST YOUR_QUICKNODE_ENDPOINT_URL/ \
-H "Content-Type: application/json" \
-d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

3
Sample Response
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x1234567"
}

If you want to continue learning about making API requests, check out our guides and sample apps.

API Overview
Discover Supported Mantle APIs, Networks, Chain Configurations, and compatible Quicknode Products

Provider Endpoints
Learn how to set up and configure your Mantle RPC endpoints for development and production use

Endpoint Security
Secure your endpoints with Token Authentication, Rate-limiting, Whitelisting, JWT and best security practices

Error Reference
Reference document for common Mantle RPC error codes and troubleshooting tips

Marketplace Add-ons
Discover powerful add-ons and extensions to enhance your Mantle development workflow

Guides
Explore comprehensive Mantle development guides and best practices to accelerate your blockchain application development

We ❤️ Feedback!
If you have any feedback or questions about this documentation, let us know. We'd love to hear from you!



Mantle API Endpoints
Updated on
Nov 26, 2025
Quicknode gives you high-performance access to the Mantle blockchain through HTTP and WebSocket (WSS) endpoints. These endpoints are designed for reliability, speed, and real-time data delivery, and provide the foundation for building scalable Web3 applications.

HTTP Endpoints
Quicknode's HTTP endpoints provide robust JSON-RPC API access with multiple performance tiers and optimization features designed for different application requirements.


https://your-endpoint.quiknode.pro/auth-token/
Best for:


Web3 application backends and APIs
Smart contract deployment and interaction
Blockchain data queries and analysis
Development and testing environments
WebSocket (WSS) Endpoints
Quicknode's WebSocket endpoints provide real-time blockchain data streaming through persistent connections optimized for different use cases and performance requirements.


wss://your-endpoint.quiknode.pro/auth-token/
Best for:


DeFi applications requiring real-time price feeds
Block explorers and analytics dashboards
Transaction monitoring and confirmation tracking
Smart contract event listening
WebSocket (WSS) Limits
WebSocket responses are capped at a certain limit, which is subject to change. In cases where responses are potentially large, it is recommended to use a POST request. If the response size exceeds the limit, the associated error code will be -32616.

Credit Usage
Different methods consume different amounts of credits: View Mantle API credit costs →

Rate Limits
Rate limits vary by plan tier: View detailed pricing and limits →


Mantle Endpoint Security
Updated on
Nov 26, 2025
Quicknode provides multiple authentication methods to secure your Mantle endpoints. Choose the approach that best fits your application's security requirements and deployment environment.


i
Authentication Feature Availability
Some authentication methods described below require specific plans:
Free Trial plan: Token authentication and basic rate limiting
Build plan and higher: All authentication methods including JWT, referrer whitelisting, advanced rate limiting, and domain masking
Visit our pricing page for more information
Token-Based Authentication
Each endpoint includes a unique authentication token embedded directly in the URL:


https://your-endpoint-name.mantle.quiknode.pro/your-auth-token/
Header-Based Authentication
Alternatively, you can pass x-token in the Header of the request:


curl https://your-endpoint-name.mantle.quiknode.pro/ \
  -X POST \
  -H "x-token: your-auth-token" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"method_name","params":[],"id":1}'
All requests must include a valid token to be accepted. You can regenerate tokens anytime from your dashboard, and old tokens become invalid immediately upon regeneration. When rotating tokens, create a new one first, update your applications to use the new token, then delete the old one to ensure continuous service availability.

Disabling Token Authentication: For development or testing purposes, you can completely disable token authentication in your endpoint's Security settings, creating a publicly accessible endpoint.

Referrer Whitelisting
You can restrict access to your endpoint by allowing only traffic from specific domains. This helps prevent unauthorized use of your endpoint from browser-based environments.


HTTP requests must include a valid Referrer header
WebSocket connections must include a valid Origin header
Domain matching requires an exact match — wildcards are not supported

Security Limitations: While referrer whitelisting improves security, it is not foolproof. HTTP headers like Referer and Origin can be spoofed or manipulated by attackers using custom HTTP clients or scripts, such as with curl. For example, someone with your endpoint URL and knowledge of the whitelisted domain could craft a request with the correct headers to bypass this restriction. For stronger protection, consider combining referrer whitelisting with other security features like rate limiting or authentication tokens.
Learn More: For detailed setup instructions, see our Referrer Whitelist Configuration Guide

JWT Authentication
JSON Web Tokens (JWT) provide enterprise-grade security through cryptographically signed authentication tokens. Unlike basic token authentication, JWTs allow you to embed custom permissions, user information, and expiration times directly into the token.

JWTs enable stateless authentication between you and your endpoint, making them ideal for applications requiring fine-grained access control, programmatic token generation, and complex permission systems. They're particularly useful for microservices architectures where session storage isn't practical.

For complete implementation details and code examples, see our JWT Implementation Guide

Multiple Authentication Tokens
By default, each Quicknode endpoint comes with a single authentication token. However, you can create additional tokens for the same endpoint, giving you more control over access management and security practices.

Multiple tokens allow you to separate environments (development, staging, production), isolate different applications or services, and rotate tokens without service disruption. This approach also enables individual usage monitoring for better API consumption insights.

For step-by-step instructions, see our Multi-token Setup Guide

Additional Security Features
Build plans and above unlock advanced security controls for enterprise-grade endpoint protection:


Method Rate Limiting - Set per-second, per-minute, or per-day limits on specific API calls to prevent abuse and manage resource usage
Domain Masking - Replace default Quicknode URLs with your own branded domain for professional endpoints and enhanced security
Security Resources
JWT Authentication Implementation
Learn how to implement JSON Web Token authentication for your Quicknode endpoints with step-by-step examples and best practices.

Setup Multi-Token Authentication
Set up multiple authentication tokens for better security management, token rotation, and environment isolation.

Referrer Whitelist Configuration
Configure referrer whitelisting to restrict endpoint access to specific domains and enhance browser-based application security.

Front-End Security Best Practices
Comprehensive guide to securing your front-end applications when using Quicknode endpoints, including key management and rate limiting strategies.

Method Rate Limiting & Testing
Control the frequency of specific API calls with per-second, per-minute, or per-day limits for enhanced endpoint protection.

How to Setup Domain Masking
Use your own branded domain for endpoint URLs instead of the default Quicknode format for better branding and security.

Last updated on Nov 26, 2025


Mantle Error Code Reference
Updated on
Dec 18, 2025
Quicknode provides Logs for your RPC endpoints. Easily identify and resolve issues by viewing detailed error information directly from your dashboard.
HTTP Error Codes
Let's look at the common http error codes you can encounter, what they mean and what you can do to prevent them.

400
Bad Request
Incorrect HTTP Request type (e.g. using GET instead of POST) or Invalid Characters
401
Unauthorized
This can happen when one or multiple security requirements are not met such as incorrect Token Auth, IP not in the whitelist, invalid JWT, etc.
403
Forbidden
Endpoint Disabled (One of the reasons for this could be a past due payment)
403
Forbidden - custom trace not found
Custom trace code not whitelisted (Submit a ticket to go through the approval process)
404
Not Found
Incorrect URL or Incorrect method
413
Content Too Large
Body of the request is too large
413
Request Entity Too Large
eth_getLogs and eth_newFilter are limited to a 10,000 blocks range. We enforce a limit of 10,000 block ranges when requesting logs and events.
429
Too Many Requests
The requests per second (RPS) of your requests are higher than your plan allows. Learn more about the 429 errors in our support documentation.
500
Internal Server Error
Submit a ticket for the support team to take a look at the errors asap
503
Service Unavailable
Submit a ticket for the support team to take a look at the errors asap
HTTP Error Code Example
The code snippet below is an example of Error Code 429.

{
	"jsonrpc": "2.0",
	"error": {
		"code": 429,
		"message": "The requests per second (RPS) of your requests are higher than your plan allows."
	},
	"id": 1
}
Mantle RPC Error Codes
Let's look at the common mantle rpc error codes you can encounter, what they mean and what you can do to prevent them.

-32000
Header not found / Block not found
The requested block doesn't exist on the node. Invalid block number or the node you're hitting is not in sync yet. Use a retry mechanism with an incremental timeout
-32000
Stack limit reached
Usually a smart contract error/bug - stack limit reached 1024 (1023)
-32000
Method handler crashed
Internal error from the blockchain client, which can be a client bug. Submit a ticket so we can double check the nodes
-32000
Execution timeout
Add the timeout param in your request to override the default client timeout.
-32000
Nonce too low
The nonce value specified in your transaction is lower than the next valid nonce for the sender account.
-32000
Filter not found
Filter exceeded timeout; you'll have to recreate the filter once more.
-32001
Resource Not Found
The requested resource does not exist or is unavailable.
-32002
Resource Unavailable
The requested resource is temporarily or permanently unavailable.
-32003
Transaction Rejected
The transaction could not be created due to validation failure or insufficient resources.
-32004
Method Not Supported
The requested method is not implemented or supported by the server.
-32005
Limit Exceeded
The request exceeds the allowed limit or quota.
-32006
JSON-RPC Version Not Supported
The specified JSON-RPC version is not supported by the server.
-32009
Trace requests limited
We have limited the debug and trace method to a specific RPS to prevent the nodes from overloading
-32010
Transaction cost exceeds gas limit
Gas limit is set too low
-32011
Network error
This error occurs when there is a problem with the connection between the client and server, such as a timeout or a dropped connection
-32015
VM execution error
Smart contract execution error
-32600
Invalid request
JSON request is malformed or missing required fields. Ensure it follows the expected format
-32601
Method not found
Typically a typo in the method name; check for spelling errors
-32601
Failed to parse request
Incorrect request body; double check the method params
-32602
Invalid params - missing 0x prefix
Incorrect request; the 0x is missing from the address. the hex
-32602
Block range limit exceeded
eth_getLogs and eth_newFilter are limited to a 10,000 blocks range. Read an in-depth explanation in our support documentation.
-32603
Internal JSON-RPC error
This error is typically due to a bad or invalid payload
-32612
Custom traces are blocked
Submit a request to get custom traces enabled.
-32613
Custom trace not allowed
Custom trace not found in allowed custom traces. Submit a request to get this trace whitelisted.
-32700
Parse error
Invalid JSON received. The server encountered an error while parsing the JSON text
3
Execution reverted
The transaction was reverted during execution, likely due to failing conditions, insufficient gas, or a contract error
Mantle RPC Error Code Example
The code snippet below is an example of Error Code -32601.

{
	"jsonrpc": "2.0",
	"id": 1,
	"error": {
		"code": -32601,
		"message": "the method eth_randomMethod does not exist/is not available"
	}
}
The RPC errors defined above are a collection of common errors you can encounter while developing on chains like ETH, BSC, Polygon, etc. These chains run on multiple clients with their own error definitions. You can view the errors mentioned in the node client source here as well:


Erigon Error Source Code
Geth Errors
Nethermind Errors
Endpoint Logs
Quicknode provides logs for your RPC endpoints to help you diagnose issues and track transaction activity. You can view logs directly in your Quicknode dashboard by navigating to:


Endpoints in the sidebar
Selecting your endpoint
Opening the Logs tab
You can filter logs by time window, response type, method, and network.

What Gets Logged
RPC Errors
All failed requests including invalid methods, malformed parameters, execution errors, and network timeouts.

Transaction Submissions
Send transaction requests and their success or failure status.

Logging Limitations
Only RPC errors and transaction submissions are logged — successful read operations are not captured. To maintain optimal endpoint performance, logging operates on a best-effort basis. Some logs may be dropped during high-traffic periods to preserve low latency.

Retention and Access
Build and Scale plans include dashboard access with standard log retention. Enterprise plans provide extended retention periods and programmatic API access for log retrieval.

If you're experiencing other error codes, please let us know by submitting a ticket. We're more than happy to assist

Last updated on Dec 18, 2025



Mantle API Overview
Updated on
Nov 26, 2025
Quicknode supports the following Mantle APIs on all endpoints. Using your Mantle endpoint, you can call any of the methods available in these APIs. For a complete list of supported RPC methods, refer to the documentation for each API.

Supported APIs
Ethereum JSON-RPC API
Core Ethereum protocol methods for blockchain interaction, account management, and transaction processing
Debug API
Development and debugging utilities for deep blockchain analysis and transaction inspection
OP-Node API
Optimism node data retrieval method for querying specific blockchain objects by hash identifier
Supported Networks
Quicknode provides access to the following Mantle networks:

Network
Type
Chain ID
HTTP
WSS
Archive
Pruning
Mainnet
Production
5000
Yes
None
Sepolia
Testnet
5001
Yes
None
Supported Products
The following Quicknode products are supported on the Mantle blockchain:

Streams
Real-time and historical blockchain data ingestion with exactly-once delivery guarantees and custom filtering.
Webhooks
HTTP endpoint notifications for blockchain events with payload customization and retry mechanisms.



eth_accounts RPC Method
Returns an array of addresses owned by the client. Since Quicknode does not store private keys, this will always return an empty response.

The API credit value for this method is 20.
Updated on
Nov 12, 2025
Please note that this JSON-RPC method will always return an empty response.
Parameters
This method does not accept any parameters
Returns 
result
An array of addresses owned by the client

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"method":"eth_accounts","id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free



eth_blockNumber RPC Method
Returns the latest block number of the blockchain.

The API credit value for this method is 20.
Updated on
Apr 24, 2024
Parameters
This method does not accept any parameters
Returns 
result
An integer value of the latest block number encoded as hexadecimal

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"method":"eth_blockNumber","params":[],"id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free



eth_call RPC Method
Executes a new message call immediately without creating a transaction on the block chain.

The API credit value for this method is 20.
Updated on
Apr 24, 2024
Parameters
transaction
object
REQUIRED
The transaction call object which contains the following fields:

from
string
The address from which the transaction is sent

to
string
REQUIRED
The address to which the transaction is addressed

gas
integer
The integer of gas provided for the transaction execution

gasPrice
integer
The integer of gasPrice used for each paid gas encoded as hexadecimal

value
integer
The integer of value sent with this transaction encoded as hexadecimal

data
string
The hash of the method signature and encoded parameters. For more information, see the Contract ABI description in the Solidity documentation

blockNumber/tag
string
REQUIRED
The block number in hexadecimal format or the string latest, earliest, pending, safe or finalized (safe and finalized tags are only supported on Ethereum, Gnosis, Arbitrum, Arbitrum Nova and Avalanche C-chain), see the default block parameter description in the official Ethereum documentation

Object
object
The State Override Set option allows you to change the state of a contract before executing the call, which means you can modify the values of variables stored in the contract, such as balances and approvals for that call without actually modifying the contract. Each address maps to an object containing:

balance
string
The fake balance to set for the account before executing the call

nonce
string
The fake nonce to set for the account before executing the call

code
string
The fake EVM bytecode to inject into the account before executing the call

state
object
The fake key-value mapping to override all slots in the account storage before executing the call

stateDiff
integer
The fake key-value mapping to override individual slots in the account storage before executing the call

Returns 
data
The return value of the executed contract method

Request

Curl
curl --location 'https://docs-demo.mantle-mainnet.quiknode.pro/' \
--header 'Content-Type: application/json' \
--data '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_call",
  "params": [
    {
      "to": "0x0fd43c8fabe26d70dfa4c8b6fa680db39f147460",
      "data": "0x919840ad"
    },
    "latest",
    {
        "0x0fd43c8fabe26d70dfa4c8b6fa680db39f147460": {
            "code": "0x6080604052348015600f57600080fd5b506004361060285760003560e01c8063919840ad14602d575b600080fd5b60336045565b60408051918252519081900360200190f35b60005a90509056fea265627a7a72315820df124583906aafd283490b866399b6762e2075e1d84214363893c5993a13276f64736f6c63430005110032"
        }
    }
  ]
}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free



eth_chainId RPC Method
Returns the current network/chain ID, used to sign replay-protected transaction introduced in EIP-155.

The API credit value for this method is 20.
Updated on
Apr 24, 2024
Parameters
This method does not accept any parameters
Returns 
chain ID
It returns a hexadecimal value in string format which represents an integer of the chain ID

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"method":"eth_chainId","params":[],"id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free



eth_estimateGas RPC Method
Returns an estimation of gas for a given transaction.

The API credit value for this method is 20.
Updated on
Apr 24, 2024
Parameters
transaction
object
REQUIRED
The transaction call object:

from
string
The address from which the transaction is sent

to
string
REQUIRED
The address to which the transaction is addressed

gas
integer
The integer of gas provided for the transaction execution

gasPrice
integer
The integer of gasPrice used for each paid gas encoded as hexadecimal

value
integer
The integer of value sent with this transaction encoded as hexadecimal

data
string
The hash of the method signature and encoded parameters. For more information, see the Contract ABI description in the Solidity documentation.

blockNumber
string
The block number in hexadecimal format or the string latest, earliest, pending, safe or finalized

Returns 
quantity
The estimated amount of gas used

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"method":"eth_estimateGas","params":[{"from":"0x735e08A7092AA74890745ca71427c35FCd3130B0","to":"0xcD18b8af3fF9BC921aD6444528c1C14752849ceb"}],"id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free


eth_feeHistory RPC Method
Returns the collection of historical gas information.

The API credit value for this method is 20.
Updated on
Apr 24, 2024
Parameters
blockCount
string/integer
REQUIRED
The number of blocks in the requested range. Between 1 and 1024 blocks can be requested in a single query. It will return less than the requested range if not all blocks are available

newestBlock
string
REQUIRED
The highest number block of the requested range in hexadecimal format or tags. The supported tag values include earliest for the earliest/genesis block, latest for the latest mined block, pending for the pending state/transactions, safe for the most recent secure block, and finalized for the most recent secure block accepted by more than 2/3 of validators. safe and finalized are only supported on Ethereum, Gnosis, Arbitrum, Arbitrum Nova, and Avalanche C-chain

rewardPercentiles
integer
REQUIRED
A list of percentile values with a monotonic increase in value. The transactions will be ranked by effective tip per gas for each block in the requested range, and the corresponding effective tip for the percentile will be calculated while taking gas consumption into consideration

Returns 
oldestBlock
The lowest number block of the returned range encoded in hexadecimal format

baseFeePerGas
An array of block base fees per gas. This includes the next block after the newest of the returned range, because this value can be derived from the newest block. Zeroes are returned for pre-EIP-1559 blocks

gasUsedRatio
An array of block gas used ratios. These are calculated as the ratio of gasUsed and gasLimit

reward
(Optional) An array of effective priority fees per gas data points from a single block. All zeroes are returned if the block is empty

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"method":"eth_feeHistory","params":[4, "latest", [25, 75]],"id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free


eth_gasPrice RPC Method
Returns the current gas price on the network in wei.

The API credit value for this method is 20.
Updated on
Apr 24, 2024
Parameters
This method does not accept any parameters
Returns 
result
The hexadecimal value of the current gas price in wei

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"method":"eth_gasPrice","params":[],"id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free
Previous



eth_getBalance RPC Method
Returns the balance of given account address in wei.

The API credit value for this method is 20.
Updated on
Apr 24, 2024
Parameters
address
string
REQUIRED
The address (20 bytes) to check for balance

blockNumber/tag
string
REQUIRED
The block number in hexadecimal format or the tags (latest, earliest, pending, safe or finalized)

Returns 
result
The ETH balance of the specified address in hexadecimal value, measured in wei

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"method":"eth_getBalance","params":["0x1DAa4F9E8f68B71541ED4eB08f496C8e591A6Bb5", "latest"],"id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free



eth_getBlockByHash RPC Method
Returns information of the block matching the given block hash.

The API credit value for this method is 20.
Updated on
Apr 24, 2024
Parameters
hash
string
REQUIRED
The hash (32 bytes) of the block

transaction detail flag
boolean
REQUIRED
It returns the full transaction objects when it is true otherwise it returns only the hashes of the transactions

Returns 
object
object
A block object, or null when no block was found:

baseFeePerGas
(Optional) A string of the base fee encoded in hexadecimal format. Please note that this response field will not be included in a block requested before the EIP-1559 upgrade

difficulty
The integer of the difficulty for this block encoded as a hexadecimal

extraData
The “extra data” field of this block

gasLimit
The maximum gas allowed in this block encoded as a hexadecimal

gasUsed
The total used gas by all transactions in this block encoded as a hexadecimal

hash
The block hash of the requested block. null if pending

logsBloom
The bloom filter for the logs of the block. null if pending

miner
The address of the beneficiary to whom the mining rewards were given

mixHash
A string of a 256-bit hash encoded as a hexadecimal

nonce
The hash of the generated proof-of-work. null if pending

number
The block number of the requested block encoded as a hexadecimal. null if pending

parentHash
The hash of the parent block

receiptsRoot
The root of the receipts trie of the block

sha3Uncles
The SHA3 of the uncles data in the block

size
The size of this block in bytes as an Integer value encoded as hexadecimal

stateRoot
The root of the final state trie of the block

timestamp
The unix timestamp for when the block was collated

totalDifficulty
The integer of the total difficulty of the chain until this block encoded as a hexadecimal

transactions
An array of transaction objects

transactionsRoot
The root of the transaction trie of the block

uncles
An array of uncle hashes

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"method":"eth_getBlockByHash","params":["0x4a517ab3f52b8da496c7192eab937b71f6c7c47120c802c7ff968205b0d30db9",false],"id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free



eth_getBlockByNumber RPC Method
Returns information of the block matching the given block number.

The API credit value for this method is 20.
Updated on
Apr 24, 2024
Parameters
blockNumber/tag
string
REQUIRED
The block number in hexadecimal format or the string latest, earliest, pending, safe or finalized

transaction detail flag
boolean
REQUIRED
The method returns the full transaction objects when this value is true otherwise, it returns only the hashes of the transactions

Returns 
object
object
A block object, or null when no block was found:

baseFeePerGas
(Optional) A string of the base fee encoded in hexadecimal format. Please note that this response field will not be included in a block requested before the EIP-1559 upgrade

difficulty
The integer of the difficulty for this block encoded as a hexadecimal

extraData
The “extra data” field of this block

gasLimit
The maximum gas allowed in this block encoded as a hexadecimal

gasUsed
The total used gas by all transactions in this block encoded as a hexadecimal

hash
The block hash of the requested block. null if pending

logsBloom
The bloom filter for the logs of the block. null if pending

miner
The address of the beneficiary to whom the mining rewards were given

mixHash
A string of a 256-bit hash encoded as a hexadecimal

nonce
The hash of the generated proof-of-work. null if pending

number
The block number of the requested block encoded as a hexadecimal. null if pending

parentHash
The hash of the parent block

receiptsRoot
The root of the receipts trie of the block

sha3Uncles
The SHA3 of the uncles data in the block

size
The size of this block in bytes as an Integer value encoded as hexadecimal

stateRoot
The root of the final state trie of the block

timestamp
The unix timestamp for when the block was collated

totalDifficulty
The integer of the total difficulty of the chain until this block encoded as a hexadecimal

transactions
An array of transaction objects

transactionsRoot
The root of the transaction trie of the block

uncles
An array of uncle hashes

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"method":"eth_getBlockByNumber","params":["0x3BC17E0",false],"id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free



eth_getBlockReceipts RPC Method
Returns all transaction receipts for a given block.

Updated on
Feb 25, 2025
Parameters
blockNumber
string
REQUIRED
The block number in hexadecimal format or the string latest, earliest, pending, safe or finalized

Returns 
result
array
An array of transaction receipt objects

blockHash
string
The hash of the block. null when pending

blockNumber
string
The block number in hexadecimal

contractAddress
string
The contract address created if the transaction was a contract creation, otherwise null

cumulativeGasUsed
string
The total amount of gas used when this transaction was executed in the block

depositNonce
string
The nonce of the deposit transaction (only present in deposit transactions)

effectiveGasPrice
string
The actual value per gas deducted from the sender account

from
string
The address of the sender

gasUsed
string
The amount of gas used by this specific transaction alone

l1Fee
string
The fee paid for L1 data and computation

l1FeeScalar
string
The scalar value used to calculate L1 fee

l1GasPrice
string
The gas price on L1 at the time of the transaction

l1GasUsed
string
The amount of gas used on L1 for this transaction

logs
array
Array of log objects generated by this transaction

address
string
The address from which this log originated

topics
array
Array of 0 to 4 32-byte DATA of indexed log arguments

data
string
Contains one or more 32-byte non-indexed arguments of the log

blockNumber
string
The block number where this log was in. null when its a pending log

transactionHash
string
The hash of the transactions this log was created from

transactionIndex
string
Integer of the transaction's index position log was created from

blockHash
string
Hash of the block where this log was in. null when pending

logIndex
string
Integer of the log index position in the block

removed
boolean
True when the log was removed due to a chain reorganization

logsBloom
string
The bloom filter for light clients to quickly retrieve related logs

status
string
Either 1 (success) or 0 (failure) encoded as hexadecimal

to
string
The address of the receiver. null when it's a contract creation transaction

tokenRatio
string
The ratio between tokens used in the transaction

transactionHash
string
The hash of the transaction

transactionIndex
string
The index of the transaction in the block

type
string
The transaction type

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"method":"eth_getBlockReceipts","params":["latest"],"id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free
Previous


eth_getBlockTransactionCountByHash RPC Method
Returns the number of transactions for the block matching the given block hash.

The API credit value for this method is 20.
Updated on
Apr 24, 2024
Parameters
hash
string
REQUIRED
The hash of the block

Returns 
result
The number of transactions associated with a specific block, in hexadecimal value

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"method":"eth_getBlockTransactionCountByHash","params":["0x7859ba65c5c07e488657328f4da9f2dda37e225d6b27131d46c21eca246740be"],"id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free



eth_getBlockTransactionCountByNumber RPC Method
Returns the number of transactions for the block matching the given block number.

The API credit value for this method is 20.
Updated on
Apr 24, 2024
Parameters
blockNumber
string
REQUIRED
The block number as a string in hexadecimal format or tags. The supported tag values include earliest for the earliest/genesis block, latest for the latest mined block, pending for the pending state/transactions, safe for the most recent secure block, and finalized for the most recent secure block accepted by more than 2/3 of validators

Returns 
result
The number of transactions in a specific block represented in hexadecimal format

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"method":"eth_getBlockTransactionCountByNumber","params":["0x3BC180A"],"id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free

eth_getCode RPC Method
Returns the compiled bytecode of a smart contract.

The API credit value for this method is 20.
Updated on
Apr 24, 2024
Parameters
address
string
REQUIRED
The address of the smart contract from which the bytecode will be obtained

blockNumber
string
REQUIRED
The block number as a string in hexadecimal format or tags. The supported tag values include earliest for the earliest/genesis block, latest for the latest mined block, pending for the pending state/transactions, safe for the most recent secure block, and finalized for the most recent secure block accepted by more than 2/3 of validators. safe and finalized are only supported on Ethereum, Gnosis, Arbitrum, Arbitrum Nova, and Avalanche C-chain

Returns 
result
The bytecode from a given address returned as a string

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"method":"eth_getCode","params":["0xa8486096C719024D4eB2262A45AAc5cA8A256Cd6","latest"],"id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free


eth_getFilterChanges RPC Method
Polling method for a filter, which returns an array of events that have occurred since the last poll.

The API credit value for this method is 20.
Updated on
Apr 24, 2024
Parameters
filter ID
string
REQUIRED
The filter id that is returned from eth_newFilter, eth_newBlockFilter

Returns 
array
An array of one of the following, depending on the filter type, or empty if there were no changes since the last poll:

eth_newBlockFilter
blockHash
The 32 byte hash of a block that meets your filter requirements

eth_newBlockFilter
address
An address from which this log originated

topics
An array of zero to four 32 Bytes DATA of indexed log arguments. In Solidity, the first topic is the hash of the signature of the event (e.g. Deposit(address, bytes32, uint256)), except you declare the event with the anonymous specifier

data
It contains one or more 32 Bytes non-indexed arguments of the log

blockNumber
The block number where this log was in. null when its a pending log

transactionHash
The hash of the transactions this log was created from. null when its a pending log

transactionIndex
The integer of the transaction's index position that the log was created from. null when it's a pending log

blockHash
The hash of the block where this log was in. null when its a pending log

logIndex
The integer of the log index position in the block. null when it's a pending log

removed
It is true when the log was removed due to a chain reorganization, and false if it's a valid log

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"method":"eth_getFilterChanges","params":["YOUR_FILTER_ID"],"id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free


eth_getFilterLogs RPC Method
Returns an array of all logs matching filter with given id.

The API credit value for this method is 20.
Updated on
Apr 24, 2024
Parameters
id
string
REQUIRED
The filter ID

Returns 
result
An array of log objects, or an empty array if nothing has changed since last poll

address
string
The address from which this log originated

topics
array
An array of (0 to 4) 32 Bytes DATA of indexed log arguments. (In solidity: The first topic is the hash of the signature of the event (e.g. Deposit(address,bytes32,uint256)), except you declared the event with the anonymous specifier)

data
string
It contains one or more 32 Bytes non-indexed arguments of the log

blockNumber
string
The block number where this log was in. null when its pending. Null when it's a pending log

transactionHash
string
The hash of the transaction from which this log was created from. null if the log is pending

transactionIndex
string
The integer of the transaction's index position that the log was created from. Null when it's a pending log

blockHash
string
The hash of the block where this log was in. Null when it's a pending log

logIndex
string
The integer of the log index position in the block. Null when it's a pending log

removed
boolean
It is true if log was removed, due to a chain reorganization and false if it's a valid log

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"method":"eth_getFilterLogs","params":["YOUR_FILTER_ID"],"id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free


eth_getLogs RPC Method
Returns an array of all logs matching a given filter object.

The API credit value for this method is 20.
Updated on
MNT 07, 2025
Please be aware that the block range limit for this RPC method is 5 blocks for users on the Free Trial plan and 10,000 blocks for those on paid plans. Consider dividing your queries into smaller segments to enhance response times and manage errors more effectively. For further details on the block range limit and strategies for mitigating it, please consult the FAQ
Parameters
object
object
The transaction call object which contains the following fields

fromBlock
string
The block number as a string in hexadecimal format or tags. The supported tag values include earliest for the earliest/genesis block, latest for the latest mined block, pending for the pending state/transactions, safe for the most recent secure block, and finalized for the most recent secure block accepted by more than 2/3 of validators. safe and finalized are only supported on Ethereum, Gnosis, Arbitrum, Arbitrum Nova, and Avalanche C-chain

toBlock
string
The block number as a string in hexadecimal format or tags. The supported tag values include earliest for the earliest/genesis block, latest for the latest mined block, pending for the pending state/transactions, safe for the most recent secure block, and finalized for the most recent secure block accepted by more than 2/3 of validators. safe and finalized are only supported on Ethereum, Gnosis, Arbitrum, Arbitrum Nova, and Avalanche C-chain

address
string
The contract address or a list of addresses from which logs should originate

topics
string
An array of DATA topics and also, the topics are order-dependent. Visit this official page to learn more about topics

blockHash
string
With the addition of EIP-234, blockHash is a new filter option that restricts the logs returned to the block number referenced in the blockHash. Using the blockHash field is equivalent to setting the fromBlock and toBlock to the block number the blockHash references. If blockHash is present in the filter criteria, neither fromBlock nor toBlock is allowed

Returns 
result
An array of log objects, or an empty array if nothing has changed since last poll

address
string
The address from which this log originated

topics
array
An array of (0 to 4) 32 Bytes DATA of indexed log arguments. (In solidity: The first topic is the hash of the signature of the event (e.g. Deposit(address,bytes32,uint256)), except you declared the event with the anonymous specifier)

data
string
It contains one or more 32 Bytes non-indexed arguments of the log

blockNumber
string
The block number where this log was in. null when its pending. Null when it's a pending log

transactionHash
string
The hash of the transaction from which this log was created from. null if the log is pending

transactionIndex
string
The integer of the transaction's index position that the log was created from. Null when it's a pending log

blockHash
string
The hash of the block where this log was in. Null when it's a pending log

logIndex
string
The integer of the log index position in the block. Null when it's a pending log

removed
boolean
It is true if log was removed, due to a chain reorganization and false if it's a valid log

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"method":"eth_getLogs","params":[{"address": "YOUR_CONTRACT_ADDRESS"}],"id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free


eth_getProof RPC Method
Returns the account and storage values of the specified account including the Merkle-proof.

The API credit value for this method is 20.
Updated on
Apr 24, 2024
Parameters
address
string
REQUIRED
The address of the account for which the balance is to be checked

storageKeys
array[strings]
REQUIRED
An array of storage-keys that should be proofed and included

blockNumber
string
The block number as a string in hexadecimal format or tags. The supported tag values include earliest for the earliest/genesis block, latest for the latest mined block, pending for the pending state/transactions, safe for the most recent secure block, and finalized for the most recent secure block accepted by more than 2/3 of validators.

Returns 
address
The address associated with the account

accountProof
An array of rlp-serialized MerkleTree-Nodes which starts with the stateRoot-Node and follows the path of the SHA3 address as key

balance
The account balance

codeHash
A 32 byte hash of the code of the account

nonce
The hash of the generated proof-of-work. Null if pending

storageHash
A 32 byte SHA3 of the storageRoot. All storage will deliver a MerkleProof starting with this rootHash

storageProof
An array of storage-entries as requested. Each entry is an object with the following fields:

key
The requested storage key

value
The storage value

proof
An array of rlp-serialized MerkleTree-Nodes which starts with the stateRoot-Node and follows the path of the SHA3 address as key

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"method":"eth_getProof","params":["0x7F0d15C7FAae65896648C8273B6d7E43f58Fa842",["0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421"],"latest"],"id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free



eth_getStorageAt RPC Method
Returns the value from a storage position at a given address.

The API credit value for this method is 20.
Updated on
Apr 24, 2024
Parameters
address
string
REQUIRED
The address to check for storage

position
string
REQUIRED
The integer of the position in storage

blockNumber
string
The block number as a string in hexadecimal format or tags. The supported tag values include earliest for the earliest/genesis block, latest for the latest mined block, pending for the pending state/transactions, safe for the most recent secure block, and finalized for the most recent secure block accepted by more than 2/3 of validators. safe and finalized are only supported on Ethereum, Gnosis, Arbitrum, Arbitrum Nova, and Avalanche C-chain

Returns 
result
It returns the value from a storage position at a given address

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"method":"eth_getStorageAt","params":["0xE592427A0AEce92De3Edee1F18E0157C05861564", "0x0", "latest"],"id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free


eth_getTransactionByBlockHashAndIndex RPC Method
Returns information about a transaction given a blockhash and transaction index position.

The API credit value for this method is 20.
Updated on
Apr 24, 2024
Parameters
blockHash
string
REQUIRED
The block hash

index
string
REQUIRED
An integer of the transaction index position encoded as a hexadecimal

Returns 
object
The transaction response object, or null if no transaction is found:

blockHash
The hash of the block where this log was in. null when it's a pending log

blockNumber
The block number where this log was in. null when it's a pending log

from
The address of the sender

gas
The gas provided by the sender, encoded as hexadecimal

gasPrice
The gas price provided by the sender in wei, encoded as hexadecimal

hash
The hash of the transaction

input
The data sent along with the transaction

nonce
The number of transactions made by the sender prior to this one encoded as hexadecimal

to
The address of the receiver. null when it's a contract creation transaction

transactionIndex
The integer of the transaction's index position that the log was created from. null when it's a pending log

value
The value transferred in wei encoded as hexadecimal

type
The transaction type

v
The standardized V field of the signature

r
The R field of the signature

s
The S field of the signature

sourceHash
The hash of the source transaction that created this transaction

mint
The minting event associated with the transaction

ethValue
The eth value for the transaction

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"method":"eth_getTransactionByBlockHashAndIndex","params":["0xb1c5fe0359e531fdd1445d1785adaa17d6eb807be9dde2536b104bff7bcf0377","0x0"],"id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free



eth_getTransactionByBlockNumberAndIndex RPC Method
Returns information about a transaction given a block number and transaction index position.

The API credit value for this method is 20.
Updated on
Apr 24, 2024
Parameters
blockNumber
string
REQUIRED
The block number as a string in hexadecimal format or tags. The supported tag values include earliest for the earliest/genesis block, latest for the latest mined block, pending for the pending state/transactions, safe for the most recent secure block, and finalized for the most recent secure block accepted by more than 2/3 of validators

index
string
REQUIRED
An integer of the transaction index position encoded as a hexadecimal

Returns 
object
The transaction response object, or null if no transaction is found:

blockHash
The hash of the block where this log was in. null when it's a pending log

blockNumber
The block number where this log was in. null when it's a pending log

from
The address of the sender

gas
The gas provided by the sender, encoded as hexadecimal

gasPrice
The gas price provided by the sender in wei, encoded as hexadecimal

hash
The hash of the transaction

input
The data sent along with the transaction

nonce
The number of transactions made by the sender prior to this one encoded as hexadecimal

to
The address of the receiver. null when it's a contract creation transaction

transactionIndex
The integer of the transaction's index position that the log was created from. null when it's a pending log

value
The value transferred in wei encoded as hexadecimal

type
The transaction type

v
The standardized V field of the signature

r
The R field of the signature

s
The S field of the signature

sourceHash
The hash of the source transaction that created this transaction

mint
The minting event associated with the transaction

ethValue
The eth value for the transaction

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"method":"eth_getTransactionByBlockNumberAndIndex","params":["0x3BC18B7", "0x0"],"id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free






eth_getTransactionCount RPC Method
Returns the number of transactions sent from an address.

The API credit value for this method is 20.
Updated on
Apr 24, 2024
Parameters
address
string
REQUIRED
The address from which the transaction count to be checked

blockNumber
string
REQUIRED
The block number as a string in hexadecimal format or tags. The supported tag values include earliest for the earliest/genesis block, latest for the latest mined block, pending for the pending state/transactions, safe for the most recent secure block, and finalized for the most recent secure block accepted by more than 2/3 of validators. safe and finalized are only supported on Ethereum, Gnosis, Arbitrum, Arbitrum Nova, and Avalanche C-chain

Returns 
result
The integer of the number of transactions sent from an address encoded as hexadecimal

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"method":"eth_getTransactionCount","params":["0xdeaddeaddeaddeaddeaddeaddeaddeaddead0001", "latest"],"id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free
Previous



eth_getTransactionReceipt RPC Method
Returns the receipt of a transaction by transaction hash.

The API credit value for this method is 20.
Updated on
Apr 24, 2024
Please note that transaction receipts are not available for pending transactions.
Parameters
hash
string
REQUIRED
The hash of a transaction

Returns 
object
A transaction receipt object, or null when no receipt was found

blockHash
The hash of the block where this transaction was in

blockNumber
The block number where this transaction was added encoded as a hexadecimal

contractAddress
The contract address created for contract creation, otherwise null

cumulativeGasUsed
The total gas used when this transaction was executed in the block

depositNonce
(Optional) The deposit nonce associated with a particular address

effectiveGasPrice
The total base charge plus tip paid for each unit of gas

from
The address of the sender

gasUsed
The amount of gas used by this specific transaction alone

l1Fee
(Optional) The fee associated with a transaction on the Layer 1, it is calculated as l1GasPrice multiplied by l1GasUsed

l1FeeScalar
(Optional) A multiplier applied to the actual gas usage on Layer 1 to calculate the dynamic costs. If set to 1, it has no impact on the L1 gas usage

l1GasPrice
(Optional) The gas price for transactions on the Layer 1

l1GasUsed
(Optional) The amount of gas consumed by a transaction on the Layer 1

logs
An array of log objects that generated this transaction

address
The address from which this log was generated

topics
An array of zero to four 32 Bytes DATA of indexed log arguments. In Solidity, the first topic is the hash of the signature of the event (e.g. Deposit(address, bytes32, uint256)), except you declare the event with the anonymous specifier

data
The 32 byte non-indexed argument of the log

blockNumber
The block number where this log was in

transactionHash
The hash of the transaction from which this log was created from. null if the log is pending

transactionIndex
The transactions index position from which this log was created from. null if the log is pending

blockHash
The hash of the block where this log was in

logIndex
The integer of log index position in the block encoded as hexadecimal. null if the log is pending

removed
It is true if log was removed, due to a chain reorganization and false if it's a valid log

logsBloom
The bloom filter which is used to retrive related logs

status
It is either 1 (success) or 0 (failure) encoded as a hexadecimal

to
The address of the receiver. Null when its a contract creation transaction

tokenRatio
(Optional) The token ratio

transactionHash
The hash of the transaction

transactionIndex
The transactions index position in the block encoded as a hexadecimal

type
The type of value

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"method":"eth_getTransactionReceipt","params":["0x93f458d1eb5d7a2a744ddebe7d552d380e7d5d870b3b1d24bb5a0a84fef61a30"],"id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free



eth_getUncleCountByBlockHash RPC Method
Returns the number of uncles for the block matching the given block hash.

The API credit value for this method is 20.
Updated on
Apr 24, 2024
Parameters
hash
string
REQUIRED
The hash of the block to get uncles for

Returns 
result
The integer value of the number of uncles in the block encoded as hexadecimal

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"method":"eth_getUncleCountByBlockHash","params":["0xf0838a69897b51cba8e9148b210a56ad6cc8bd8ed71315471b6788da9e1aa038"],"id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free
Previous




eth_hashrate RPC Method
Returns the number of hashes per second that the node is mining with.

Updated on
Nov 12, 2025
Please note that Quicknode will always return a 0x0 mining hash rate.
Parameters
This method does not accept any parameters
Returns 
hashrate
The number of hashes per second encoded in hexadecimal format

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_hashrate","params":[],"id":1}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free



    eth_mining RPC Method
Returns true if node is actively mining new blocks.

The API credit value for this method is 20.
Updated on
Apr 24, 2024
Parameters
This method does not accept any parameters
Returns 
result
It is true if the node is mining, otherwise false

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_mining","params":[],"id":1}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free
Previous

eth_newBlockFilter RPC Method
Creates a filter in the node, to notify when a new block arrives. To check if the state has changed, call eth_getFilterChanges.

Updated on
Apr 24, 2024
Parameters
This method does not accept any parameters
Returns 
result
It returns a filter id to be used when calling eth_getFilterChanges

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_newBlockFilter","params":[],"id":1}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free


eth_newFilter RPC Method
Creates a filter object, based on filter options, to notify when the state changes (logs). To check if the state has changed, call eth_getFilterChanges.

The API credit value for this method is 20.
Updated on
MNT 07, 2025
Please be aware that the block range limit for this RPC method is 5 blocks for users on the Free Trial plan and 10,000 blocks for those on paid plans. Consider dividing your queries into smaller segments to enhance response times and manage errors more effectively. For further details on the block range limit and strategies for mitigating it, please consult the FAQ
Parameters
object
object
The transaction response object which contains the following filter information:

fromBlock
string
REQUIRED
The block number as a string in hexadecimal format or tags. The supported tag values include earliest for the earliest/genesis block, latest for the latest mined block, pending for the pending state/transactions, safe for the most recent secure block, and finalized for the most recent secure block accepted by more than 2/3 of validators. safe and finalized are only supported on Ethereum, Gnosis, Arbitrum, Arbitrum Nova, and Avalanche C-chain

toBlock
string
REQUIRED
The block number as a string in hexadecimal format or tags. The supported tag values include earliest for the earliest/genesis block, latest for the latest mined block, pending for the pending state/transactions, safe for the most recent secure block, and finalized for the most recent secure block accepted by more than 2/3 of validators. safe and finalized are only supported on Ethereum, Gnosis, Arbitrum, Arbitrum Nova, and Avalanche C-chain

address
string
REQUIRED
The contract address or a list of addresses from which logs should originate

topics
string
An array of DATA topics and also, the topics are order-dependent. Visit here to learn more about topics

Returns 
result
It returns a filter id to be used when calling eth_getFilterChanges

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_newFilter","params":[{"fromBlock": "0xe20360", "toBlock": "0xe20411", "address": "0x6b175474e89094c44da98b954eedeac495271d0f","topics": []}],"id":1}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free




eth_sendRawTransaction RPC Method
Creates new message call transaction or a contract creation for signed transactions. The new API Credit value for this method is 20 when used part of the Core API. If you are using eth_sendRawTransaction as part of a Marketplace add-on, view the add-on's homepage for more information about the specific charge.

Updated on
Apr 24, 2024
Parameters
data
REQUIRED
The signed transaction (typically signed with a library, using your private key)

Returns 
result
The transaction hash, or the zero hash if the transaction is not yet available

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_sendRawTransaction","params":["YOUR_SIGNED_TRANSACTION"],"id":1}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free



eth_signTransaction RPC Method
Signs a transaction that can be submitted to the network later using eth_sendRawTransaction - not supported by Quicknode!

The API credit value for this method is 20.
Updated on
Nov 12, 2025
Please note that Quicknode does not support the eth_signTransaction RPC method.
Parameters
object
object
The transaction response object which contains the following fields:

from
REQUIRED
The address the transaction is sent from

to
The address the transaction is directed to

gas
The integer of the gas provided for the transaction execution

gasPrice
The integer of the gasPrice used for each paid gas, in wei

value
The integer of the value sent with this transaction, in wei

data
REQUIRED
The compiled code of a contract or the hash of the invoked method signature and encoded parameters

nonce
The integer of a nonce. This allows overwriting the own pending transactions that use the same nonce

Returns 
result
The signed transaction object

Request

Curl
Not supported by Quicknode!

Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free


eth_subscribe RPC Method
Starts a subscription to a specific event.

The API credit value for this method is 20.
Updated on
Apr 24, 2024
Parameters
subscription name
string
The type of event you want to subscribe to (i.e., newHeads, logs). This method supports the following subscription types:

newHeads
It fires a notification each time a new header is appended to the chain, including chain reorganizations

logs
It returns logs that are included in new imported blocks and match the given filter criteria

data
object
The arguments such as an address, multiple addresses, and topics. Note, only logs that are created from these addresses or match the specified topics will return logs

Returns 
result
The hex encoded subscription ID. This ID will be attached to all received events and can also be used to cancel the subscription using eth_unsubscribe

Request

WSCAT
wscat -c wss://docs-demo.mantle-mainnet.quiknode.pro/ \ 
# wait for connection 
{"id":1,"jsonrpc":"2.0","method":"eth_subscribe","params":["newHeads"]}
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free




eth_uninstallFilter RPC Method
It uninstalls a filter with the given filter id.

The API credit value for this method is 20.
Updated on
Apr 24, 2024
Parameters
filter ID
string
REQUIRED
The filter ID that needs to be uninstalled. It should always be called when watch is no longer needed. Additionally, Filters timeout when they aren't requested with eth_getFilterChanges for a period of time

Returns 
result
It returns true if the filter was successfully uninstalled, otherwise false

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_uninstallFilter","params":["0x10ff0bfba9472c87932c56632eef8f5cc70910e8e71d"],"id":1}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free



net_version RPC Method
Returns the current network id.

The API credit value for this method is 20.
Updated on
Apr 24, 2024
Parameters
This method does not accept any parameters
Returns 
result
The current network id. For Mantle Sepolia the network id is '5003' and for Mantle Mainnet the network id is '5000'

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"net_version","params":[],"id":1}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free





web3_sha3 RPC Method
Returns Keccak-256 (not the standardized SHA3-256) hash of the given data.

The API credit value for this method is 20.
Updated on
Apr 24, 2024
Parameters
data
string
REQUIRED
The data in hexadecimal form to convert into a SHA3 hash

Returns 
dATA
The SHA3 hash of the given string

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"web3_sha3","params":["0x68656c6c6f20776f726c64"],"id":1}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free


web3_clientVersion RPC Method
Returns the current version of the chain client.

The API credit value for this method is 20.
Updated on
Apr 24, 2024
Parameters
This method does not accept any parameters
Returns 
result
The current client version in string format

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":1}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free



debug_getBadBlocks RPC Method
Returns a list of the last bad blocks that the client has seen on the network.

The API credit value for this method is 40.
Updated on
Apr 24, 2024
Parameters
This method does not accept any parameters
Returns 
result
The result object which contains the following fields:

hash
The hash of the transaction

block
A block object, or null when no block was found

baseFeePerGas
The integer of the difficulty for this block encoded as hexadecimal

difficulty
The integer of the difficulty for this block encoded as hexadecimal

extraData
The extra data field of this block

gasLimit
The maximum gas allowed in this block encoded as hexadecimal

gasUsed
The total used gas by all transactions in this block encoded as hexadecimal

hash
The block hash of the requested block. Null if pending

logsBloom
The bloom filter for the logs of the block. Null if pending

miner
The address of the beneficiary to whom the mining rewards were given

mixHash
A string of a 256-bit hash encoded as hexadecimal

nonce
The hash of the generated proof-of-work. Null if pending

number
The block number of the requested block encoded as hexadecimal. Null if pending

parentHash
The hash of the parent block

receiptsRoot
The root of the receipts trie of the block

sha3Uncles
The SHA3 of the uncles data in the block

size
The size of this block in bytes as an Integer value encoded as hexadecimal

stateRoot
The root of the final state trie of the block

timestamp
The unix timestamp for when the block was collated

transactions
object
An array of transaction objects with the following fields:

blockHash
The hash of the block where this log was in. Null when it's a pending log

blockNumber
The block number where this log was in. Null when it's a pending log

from
The address of the sender

gas
The gas provided by the sender, encoded as hexadecimal

gasPrice
The gas price provided by the sender in wei, encoded as hexadecimal

hash
The hash of the transaction

input
The data sent along with the transaction

nonce
The number of transactions made by the sender before this one encoded as hexadecimal

to
The address of the receiver. Null when it's a contract creation transaction

transactionIndex
The integer of the transaction's index position that the log was created from. Null when it's a pending log

value
The value transferred in wei encoded as hexadecimal

type
The transaction type

chainId
(Optional) The chain id

v
The standardized V field of the signature

r
The R field of the signature

s
The S field of the signature

sourceHash
The hash of the source of the transaction

mint
Indicates whether the transaction is a mint transaction

ethValue
The value of ether involved in the transaction

transactionsRoot
The root of the transaction trie of the block

uncles
An array of uncle hashes

rlp
The RLP encoded header

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
 -X POST \
 -H "Content-Type: application/json" \
 --data '{"method":"debug_getBadBlocks","params":[],"id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free



debug_storageRangeAt RPC Method
Returns the contract storage for the specified range.

The API credit value for this method is 40.
Updated on
Apr 24, 2024
Parameters
blockHash
string
REQUIRED
The hash of the block

txIndex
integer
REQUIRED
The transaction index for the point in which we want the list of accounts

address
string
REQUIRED
The contract address

startKey
string
REQUIRED
The offset (hash of storage key)

limit
string
REQUIRED
The number of storage entries to return

Returns 
result
The result object which contains the following fields:

storage
An object with hash values, and for each of them the key and value it represents

hash
object
The hash value

key
The key associated with the hash

value
The value associated with the hash

nextKey
The hash of next key if further storage in range. Otherwise, not included

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
 -X POST \
 -H "Content-Type: application/json" \
 --data '{"method":"debug_storageRangeAt","params":["0x4a517ab3f52b8da496c7192eab937b71f6c7c47120c802c7ff968205b0d30db9",0,"0x4200000000000000000000000000000000000015","0x0000000000000000000000000000000000000000000000000000000000000000",1],"id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free




debug_traceBlockByHash RPC Method
Returns the possible tracing result number by executing all transactions in the block specified by the block hash with a tracer.

The API credit value for this method is 40.
Updated on
Sep 22, 2025
This RPC method is included in the Free Trial with limited usage. Upgrade your plan to get full access and higher limits. Learn more on our pricing page.
Parameters
blockHash
string
REQUIRED
The hash of the block to be traced

object
object
REQUIRED
The tracer object with the following fields:

tracer
string
The type of tracer. It could be callTracer or prestateTracer

callTracer
string
The calltracer keeps track of all call frames, including depth 0 calls, that are made during a transaction

prestateTracer
string
The prestateTracer replays the transaction and tracks every part of state that occured during the transaction

tracerConfig
object
The object to specify the configurations of the tracer

onlyTopCall
boolean
When set to true, this will only trace the primary (top-level) call and not any sub-calls. It eliminates the additional processing for each call frame

Returns 
result
The result object which contains the following fields:

result
An object containing detailed information about the traced transaction

from
The address the transaction is sent from

gas
The integer of the gas provided for the transaction execution

gasUsed
The integer of the gas used

to
The address the transaction is directed to

input
The data given at the time of input

calls
An array containing information about internal calls made during the transaction

from
The address making the call

gas
The gas limit specified for the call

gasUsed
The amount of gas used during the call

to
The address being called

input
The input data for the call

output
(Optional) The output data of the call

value
The value (in Wei) sent with the call

type
The type of call (e.g., CALL or STATICCALL)

value
The integer of the value sent with this transaction

type
The type of the call

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
-X POST \
-H "Content-Type: application/json" \
--data '{"method":"debug_traceBlockByHash","params":["0xf0838a69897b51cba8e9148b210a56ad6cc8bd8ed71315471b6788da9e1aa038", {"tracer": "callTracer"}],"id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free


debug_traceBlock RPC Method
Returns a full stack trace of all invoked opcodes of all transactions that were included in a block.

The API credit value for this method is 40.
Updated on
Sep 22, 2025
This RPC method is included in the Free Trial with limited usage. Upgrade your plan to get full access and higher limits. Learn more on our pricing page.
Parameters
block
string
REQUIRED
The RLP encoded block

object
object
REQUIRED
The tracer object with the following fields:

tracer
string
The type of tracer. It could be callTracer or prestateTracer

callTracer
string
The calltracer keeps track of all call frames, including depth 0 calls, that are made during a transaction

prestateTracer
string
The prestateTracer replays the transaction and tracks every part of state that occured during the transaction

tracerConfig
object
The object to specify the configurations of the tracer

onlyTopCall
boolean
When set to true, this will only trace the primary (top-level) call and not any sub-calls. It eliminates the additional processing for each call frame

Returns 
result
A result array with the following fields:

type
The type of the call

from
The address the transaction is sent from

to
The address the transaction is directed to

value
The integer of the value sent with this transaction

gas
The integer of the gas provided for the transaction execution

gasUsed
The integer of the gas used

input
The data given at the time of input

output
The data which is returned as an output

calls
A list of sub-calls

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
 -X POST \
 -H "Content-Type: application/json" \
 --data '{"method":"debug_traceBlock","params":["RLP_ENCODED_BLOCK", {"tracer": "callTracer"}],"id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free



debug_traceTransaction RPC Method
Returns all traces of a given transaction.

The API credit value for this method is 40.
Updated on
Sep 22, 2025
This RPC method is included in the Free Trial with limited usage. Upgrade your plan to get full access and higher limits. Learn more on our pricing page.
Parameters
transactionHash
string
REQUIRED
The transaction hash that needs to be traced, encoded in hexadecimal format

object
object
The tracer object with the following fields:

tracer
string
The type of tracer. It could be callTracer or prestateTracer

callTracer
string
The calltracer keeps track of all call frames, including depth 0 calls, that are made during a transaction

prestateTracer
string
The prestateTracer replays the transaction and tracks every part of state that occured during the transaction

tracerConfig
object
The object to specify the configurations of the tracer

onlyTopCall
boolean
When set to true, this will only trace the primary (top-level) call and not any sub-calls. It eliminates the additional processing for each call frame

timeout
string
A string of decimal integers that overrides the JavaScript-based tracing calls default timeout of 5 seconds

Returns 
result
An object containing detailed information about the traced transaction

from
The address the transaction is sent from

gas
The integer of the gas provided for the transaction execution

gasUsed
The integer of the gas used

to
The address the transaction is directed to

input
The data given at the time of input

output
(Optional) The output data of the call

calls
An array containing information about internal calls made during the transaction

from
The address making the call

gas
The gas limit specified for the call

gasUsed
The amount of gas used during the call

to
The address being called

input
The input data for the call

output
(Optional) The output data of the call

value
The value (in Wei) sent with the call

type
The type of call (e.g., CALL or STATICCALL)

calls
The sub-calls associated with the call

value
The integer of the value sent with this transaction

type
The type of the call

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
-X POST \
-H "Content-Type: application/json" \
--data '{"method":"debug_traceTransaction","params":["0xecb2f745bfef428939f0300cf91ee98f63542bc5fb859081f597ebd39d1707fb", {"tracer": "callTracer"}], "id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free


debug_traceBlockByNumber RPC Method
Returns the tracing result by executing all transactions in the block specified by number with a tracer.

The API credit value for this method is 40.
Updated on
Sep 22, 2025
This RPC method is included in the Free Trial with limited usage. Upgrade your plan to get full access and higher limits. Learn more on our pricing page.
Parameters
blockNumber
string
REQUIRED
The block number as a string in hexadecimal format or tags. The supported tag values include earliest for the earliest/genesis block, latest for the latest mined block, pending for the pending state/transactions, safe for the most recent secure block, and finalized for the most recent secure block accepted by more than 2/3 of validators. safe and finalized are only supported on Ethereum, Gnosis, Arbitrum, Arbitrum Nova, and Avalanche C-chain

object
object
The tracer object with the following fields:

tracer
string
The type of tracer. It could be callTracer or prestateTracer

callTracer
string
The calltracer keeps track of all call frames, including depth 0 calls, that are made during a transaction

prestateTracer
string
The prestateTracer replays the transaction and tracks every part of state that occured during the transaction

tracerConfig
object
The object to specify the configurations of the tracer

onlyTopCall
boolean
When set to true, this will only trace the primary (top-level) call and not any sub-calls. It eliminates the additional processing for each call frame

Returns 
result
The result object which contains the following fields:

result
An object containing detailed information about the traced transaction

from
The address the transaction is sent from

gas
The integer of the gas provided for the transaction execution

gasUsed
The integer of the gas used

to
The address the transaction is directed to

input
The data given at the time of input

calls
An array containing information about internal calls made during the transaction

from
The address making the call

gas
The gas limit specified for the call

gasUsed
The amount of gas used during the call

to
The address being called

input
The input data for the call

output
(Optional) The output data of the call

value
The value (in Wei) sent with the call

type
The type of call (e.g., CALL or STATICCALL)

value
The integer of the value sent with this transaction

type
The type of the call

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
-X POST \
-H "Content-Type: application/json" \
--data '{"method":"debug_traceBlockByNumber","params":["0x3BC1AD8", {"tracer": "callTracer"}],"id":1,"jsonrpc":"2.0"}'

Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free
Previous


optimism_outputAtBlock RPC Method
Returns the output root at a specific block.

Updated on
Apr 24, 2024
Parameters
blockNumber
string
REQUIRED
The block number in hexadecimal format

Returns 
result
The result object which contains the following fields:

version
The output root version number, beginning with 0

outputRoot
The output root

blockRef
The block reference object which contains the following fields:

hash
The hash of the referenced block

number
The block number of the referenced block

parentHash
The hash of the parent block

timestamp
The timestamp associated with the referenced block

l1origin
The l1origin object which contains the following fields

hash
The hash of the L1 origin block

number
The block number of the L1 origin

sequenceNumber
The sequence number of the queued unsafe L2

withdrawalStorageRoot
The root hash of the withdrawal storage data at the specified block

stateRoot
The root hash of the state data at the specified block

syncStatus
The syncStatus object which contains the following fields:

current_l1
The current_l1 object which contains the following fields:

hash
The hash of the current L1 synchronization status

number
The block number of the current L1 synchronization status

parentHash
The hash of the parent block

timestamp
The timestamp of the current L1 synchronization status

current_l1_finalized
The current_l1_finalized object which contains the following fields:

hash
The hash of the finalized state of the current L1

number
The block number of the finalized state of the current L1

parentHash
The hash of the parent block

timestamp
The timestamp of the finalized state of the current L1

head_l1
The head_l1 object which contains the following fields:

hash
The hash of the head L1

number
The block number of the head L1

parentHash
The hash of the parent block

timestamp
The timestamp of the head L1

safe_l1
The safe_l1 object which contains the following fields:

hash
The hash of the safe L1

number
The block number of the safe L1

parentHash
The hash of the parent block

timestamp
The timestamp of the safe L1

finalized_l1
The finalized_l1 object which contains the following fields:

hash
The hash of the finalized L1

number
The block number of the finalized L1

parentHash
The hash of the parent block

timestamp
The timestamp of the finalized L1

unsafe_l2
The unsafe_l2 object which contains the following fields:

hash
The hash of the unsafe L2

number
The block number of the unsafe L2

parentHash
The hash of the parent block

timestamp
The timestamp of the unsafe L2

l1origin
The l1origin object which contains the following fields

hash
The hash of the L1 origin block

number
The block number of the L1 origin

sequenceNumber
The sequence number of the unsafe L2

safe_l2
The safe_l2 object which contains the following fields:

hash
The hash of the safe L2

number
The block number of the safe L2

parentHash
The hash of the parent block

timestamp
The timestamp of the safe L2

l1origin
The l1origin object which contains the following fields

hash
The hash of the L1 origin block

number
The block number of the L1 origin

sequenceNumber
The sequence number of the safe L2

finalized_l2
The finalized_l2 object which contains the following fields:

hash
The hash of the finalized L2

number
The block number of the finalized L2

parentHash
The hash of the parent block

timestamp
The timestamp of the finalized L2

l1origin
The l1origin object which contains the following fields

hash
The hash of the L1 origin block

number
The block number of the L1 origin

sequenceNumber
The sequence number of the finalized L2

queued_unsafe_l2
The queued_unsafe_l2 object which contains the following fields:

hash
The hash of the queued unsafe L2

number
The block number of the queued unsafe L2

parentHash
The hash of the parent block

timestamp
The timestamp of the queued unsafe L2

l1origin
The l1origin object which contains the following fields

hash
The hash of the L1 origin block

number
The block number of the L1 origin

sequenceNumber
The sequence number of the queued unsafe L2

engine_sync_target
The engine_sync_target object which contains the following fields:

hash
The hash of the synchronization target for the engine

number
The block number of the synchronization target for the engine

parentHash
The hash of the parent block

timestamp
The timestamp of the synchronization target for the engine

l1origin
The l1origin object which contains the following fields

hash
The hash of the L1 origin block

number
The block number of the L1 origin

sequenceNumber
The sequence number of the synchronization target for the engine

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
 -X POST \
 -H "Content-Type: application/json" \
 --data '{"method":"optimism_outputAtBlock","params":["BLOCK_NUMBER"],"id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free




optimism_syncStatus RPC Method
Get the synchronization status.

Updated on
Apr 24, 2024
Parameters
This method does not accept any parameters
Returns 
result
The result object which contains the following fields:

current_l1
The current_l1 object which contains the following fields:

hash
The hash of the current L1 synchronization status

number
The block number of the current L1 synchronization status

parentHash
The hash of the parent block

timestamp
The timestamp of the current L1 synchronization status

current_l1_finalized
The current_l1_finalized object which contains the following fields:

hash
The hash of the finalized state of the current L1

number
The block number of the finalized state of the current L1

parentHash
The hash of the parent block

timestamp
The timestamp of the finalized state of the current L1

head_l1
The head_l1 object which contains the following fields:

hash
The hash of the head L1

number
The block number of the head L1

parentHash
The hash of the parent block

timestamp
The timestamp of the head L1

safe_l1
The safe_l1 object which contains the following fields:

hash
The hash of the safe L1

number
The block number of the safe L1

parentHash
The hash of the parent block

timestamp
The timestamp of the safe L1

finalized_l1
The finalized_l1 object which contains the following fields:

hash
The hash of the finalized L1

number
The block number of the finalized L1

parentHash
The hash of the parent block

timestamp
The timestamp of the finalized L1

unsafe_l2
The unsafe_l2 object which contains the following fields:

hash
The hash of the unsafe L2

number
The block number of the unsafe L2

parentHash
The hash of the parent block

timestamp
The timestamp of the unsafe L2

l1origin
The l1origin object which contains the following fields

hash
The hash of the L1 origin block

number
The block number of the L1 origin

sequenceNumber
The sequence number of the unsafe L2

safe_l2
The safe_l2 object which contains the following fields:

hash
The hash of the safe L2

number
The block number of the safe L2

parentHash
The hash of the parent block

timestamp
The timestamp of the safe L2

l1origin
The l1origin object which contains the following fields

hash
The hash of the L1 origin block

number
The block number of the L1 origin

sequenceNumber
The sequence number of the safe L2

finalized_l2
The finalized_l2 object which contains the following fields:

hash
The hash of the finalized L2

number
The block number of the finalized L2

parentHash
The hash of the parent block

timestamp
The timestamp of the finalized L2

l1origin
The l1origin object which contains the following fields

hash
The hash of the L1 origin block

number
The block number of the L1 origin

sequenceNumber
The sequence number of the finalized L2

queued_unsafe_l2
The queued_unsafe_l2 object which contains the following fields:

hash
The hash of the queued unsafe L2

number
The block number of the queued unsafe L2

parentHash
The hash of the parent block

timestamp
The timestamp of the queued unsafe L2

l1origin
The l1origin object which contains the following fields

hash
The hash of the L1 origin block

number
The block number of the L1 origin

sequenceNumber
The sequence number of the queued unsafe L2

engine_sync_target
The engine_sync_target object which contains the following fields:

hash
The hash of the synchronization target for the engine

number
The block number of the synchronization target for the engine

parentHash
The hash of the parent block

timestamp
The timestamp of the synchronization target for the engine

l1origin
The l1origin object which contains the following fields

hash
The hash of the L1 origin block

number
The block number of the L1 origin

sequenceNumber
The sequence number of the synchronization target for the engine

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
 -X POST \
 -H "Content-Type: application/json" \
 --data '{"method":"optimism_syncStatus","params":[],"id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free




optimism_version RPC Method
Returns the software version.

Updated on
Apr 24, 2024
Parameters
This method does not accept any parameters
Returns 
result
A string of the software version of the node

Request

Curl
curl https://docs-demo.mantle-mainnet.quiknode.pro/ \
 -X POST \
 -H "Content-Type: application/json" \
 --data '{"method":"optimism_version","params":[],"id":1,"jsonrpc":"2.0"}'
Don't have an account yet?
Create your Quicknode endpoint in seconds and start building
Get started for free
