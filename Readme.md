# 🗳️ Blockchain Voting System

This is a decentralized voting application built as a minor project. It uses a Solidity smart contract on the backend to ensure a secure and transparent voting process, a Node.js server, and a simple HTML/CSS/JavaScript frontend.

---

## ✨ Features

* **Secure User Authentication**: Connects with a user's blockchain wallet (e.g., MetaMask).
* **Voter Registration**: Allows authorized users to register for an election.
* **Decentralized Voting**: Votes are cast as transactions on the blockchain, making them immutable.
* **Transparent Results**: Anyone can view the final tally, ensuring the integrity of the election.
* **Admin Panel**: A simple interface for the administrator to manage the election process.

---

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running on your machine.

### Prerequisites

You must have the following software installed on your machine:
* [Node.js](https://nodejs.org/en/) (which includes npm)
* A web browser with the [MetaMask](https://metamask.io/) extension installed.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/DarshanK2424/Minor-Project.git](https://github.com/DarshanK2424/Minor-Project.git)
    ```

2.  **Navigate into the project directory:**
    ```bash
    cd Minor-Project
    ```

3.  **Install the required dependencies:**
    This command will read the `package.json` file and download all necessary libraries into a `node_modules` folder.
    ```bash
    npm install
    ```

4.  **Configure your environment variables:**
    This project requires a secret file to connect to the blockchain and use a wallet. This file is not included in the repository for security reasons.
    * Create a new file in the root directory named `voter-keystore.json`.
    * Place your private key information inside this file. You will need to get this from your friend or create your own wallet.

---

## 🏃‍♀️ Running the Application

Once the installation is complete, you can start the local server.

1.  **Start the server:**
    ```bash
    node server.js
    ```
2.  Open your web browser and navigate to `http://localhost:3000` (or whichever port is configured in `server.js`).
3.  Connect your MetaMask wallet when prompted and interact with the application.

---

## 🛠️ Technologies Used

* **Smart Contract**: [Solidity](https://soliditylang.org/)
* **Blockchain Interaction**: [Ethers.js](https://ethers.io/)
* **Backend Server**: [Node.js](https://nodejs.org/)
* **Frontend**: HTML, CSS, JavaScript
* **Wallet**: [MetaMask](https://metamask.io/)
