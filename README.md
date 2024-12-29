# Dungeons & Dragons Session Guardian

An AI assistant to help dungeon masters during the session

## Core Features

![image](https://github.com/user-attachments/assets/9ef111a3-df44-491a-ba71-d8a738060c4d)

### Name Tables

Did your players ask for a name for the tavern keeper? No stress!
![image](https://github.com/user-attachments/assets/4baf1606-1dba-4b28-808a-b905c4b851ec)

### Monster Statblock Generator

Need a statblock but don't have a specific monster?

![image](https://github.com/user-attachments/assets/ca47cb11-c6c0-4b00-80fa-b767b92e0957)

Save any statblocks you like to refer back to later

![image](https://github.com/user-attachments/assets/39cec8f9-fd74-426e-b435-e60012fe4bf6) ![image](https://github.com/user-attachments/assets/a7cfa203-dff9-4d12-805a-f729a256478d)

### Loot Table Generator

Did your players ask to loot something and don't just want to give gold?

![image](https://github.com/user-attachments/assets/2f0ddd86-d9f6-4f18-b953-43c9b9d60461) ![image](https://github.com/user-attachments/assets/3e22fee7-ae89-4763-8a3b-42aa6063bd39)

### Rumor Generator

Did your players go off your expected path, and are now asking for something to do in that new town?

![image](https://github.com/user-attachments/assets/eb243958-0f05-40ba-8909-bd690b6bada4)

### Random Encounters

Need an interesting random counter?

![image](https://github.com/user-attachments/assets/edc313e3-f78a-44f1-9bc3-83603a1e0891)

### Campaign Management

Add details about whats happened so far and the adventurers in your campaign. This will help fine tune all results to your campaign

![image](https://github.com/user-attachments/assets/96a47ffb-f4e7-4565-a883-306c71512a42)

![image](https://github.com/user-attachments/assets/7c657b77-a8b9-4fa5-a239-1c848f2c87ad)


## Tech Stack

### Backend

- Python / Flask for codebase
- Bazel + Docker for building
- Automatic build and deploy to google cloud run on new commits to main via GitHub actions

### Frontend

- Expo + React Native for app
- Firebase Auth + Firestore DB
- Automatic build and deploy to Apple App Store on new commits to main via Expo Developer
