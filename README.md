## 🔒 Laundromod - A Secure Modding & Application Patcher
<p align="center">
<!-- It's highly recommended to create a simple banner image for your project -->
<img width="1302" height="812" alt="Screenshot 2025-09-23 210849" src="https://github.com/user-attachments/assets/385eab6e-afa1-42d2-9dd3-4df1a74cd782" />

</p>

A secure, full-stack desktop application built with Electron.js and React that patches and enhances popular gaming applications like Steam and WeMod. (More can be added through cloud) It features a complete user authentication flow, a premium software licensing system, and a dynamic UI that responds to user state.

<p align="center">
<img src="https://badgen.net/badge/Framework/Electron.js/blue%3Ficon%3Delectron" alt="Electron.js">
<img src="https://badgen.net/badge/UI/React.js/00d8ff%3Ficon%3Dreact" alt="React.js">
<img src="https://badgen.net/badge/Services/Firebase/orange%3Ficon%3Dfirebase" alt="Firebase">
<img src="https://badgen.net/badge/API/Serverless/purple%3Ficon%3Dcloudflare" alt="Serverless">
<img src="https://badgen.net/badge/license/MIT/yellow" alt="License">
</p>

# ✨ Core Purpose
Laundromod is a powerful tool designed for the gaming community. Its primary functions are:

* Unlock WeMod Premium: It provides a guided, multi-step installer that safely patches the WeMod desktop application.

* Enable Custom Steam Scripts: It automatically configures the necessary folders for Steam, allowing users to easily add their own custom scripts for modding.

* Provide a Secure Platform: The entire application is built around a secure user account system, ensuring that user data and license information are protected.

# 🛠️ Key Technical Features
This project demonstrates the ability to build a secure, end-to-end desktop application that interacts with the local file system and remote services.

# 🔐 Authentication & Security
* Full User Authentication: Secure registration, login, and email verification workflows powered by Firebase Authentication.

* Guest Access: Allows users to explore the application without needing to create an account.

* State-Driven UI: The user interface dynamically changes to reflect the user's authentication and license status.

# 🔑 Premium Licensing System
* License Activation: Users can activate premium features by entering a valid license key. Activated licenses are securely tied to a registered user's account in the Firestore database.

* Dynamic Feature Flagging: The availability of premium features can be updated remotely via Firebase, demonstrating a scalable architecture for a real-world product.

# 🚀 The Serverless Architecture: A Note on Security
A core challenge in this project was securely managing server-side operations (like license verification) without exposing the Firebase Admin SDK keys in a client-side Electron app.

To solve this, I engineered a custom serverless back-end using a Cloudflare Worker.

The Electron app makes API calls to a secure Cloudflare Worker endpoint.

The Worker securely holds the Firebase Admin credentials and is the only entity that communicates directly with the Firebase back-end.

This creates a secure and cost-effective API gateway, demonstrating a resourceful approach to a critical security problem.

# 📸 Screenshots
<p align="center">
<!-- Replace these with links to your actual screenshots! -->
<img width="1283" height="782" alt="image" src="https://github.com/user-attachments/assets/8d75f39c-d0aa-438d-9d11-22bf7c1eb6b1" />
<img width="1305" height="777" alt="image" src="https://github.com/user-attachments/assets/9caa2152-26a0-427f-9289-6c2e20665692" />
<img width="1275" height="767" alt="image" src="https://github.com/user-attachments/assets/9ed8a124-aa19-4524-88f2-035f29d51416" />
<img width="1283" height="790" alt="image" src="https://github.com/user-attachments/assets/045da4f8-519b-4f71-843b-d842273c5e35" />




# 💻 &nbsp;Tools Used 
<p align="left">
 <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" alt="vscode" width="45" height="45"/>
 <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/electron/electron-original.svg" width="45" height="45" />
 <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="45" height="45" />
 <img src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg' alt="firebase" width="45" height="45" />
 <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cloudflareworkers/cloudflareworkers-original.svg" width="45" height="45" />
 <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg" alt="css3" width="45" height="45" />
 <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="45" height="45" />
</p>

# 🚀 Getting Started
* To run a local instance of this application for development:

* Prerequisites
`Node.js and npm`

* A Firebase project with Authentication and Firestore enabled.

* A Cloudflare account for the serverless worker.

# Installation & Setup
Clone the repository:

```bash
git clone https://github.com/aashishud/laundromod.git
cd laundromod
```

# Install dependencies:

```bash
npm install
```

Set up environment variables:
Create a file named .env in the root directory and add your Firebase project credentials. You can find these in your Firebase project settings. The API_ENDPOINT should be the URL of your deployed Cloudflare Worker.

# .env.example

Firebase Client SDK Credentials
```bash
 API_KEY=YourFirebaseApiKey
 AUTH_DOMAIN=YourFirebaseAuthDomain
 PROJECT_ID=YourFirebaseProjectId
```
# ... and other Firebase keys

# URL for your Cloudflare Worker
```bash
const workerUrl=YourCloudflareWorkerUrl
```

# Start the application in development mode:

```bash
npm run dev
```

Build the application:

```bash 
npm run build
```

# 📄 License
This project is licensed under the MIT License. See the LICENSE file for details.
