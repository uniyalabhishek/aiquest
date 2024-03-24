# AI Quest

Craft your own RPG universe and elevate your social gaming experience with your blockchain activities! AI Quest, a text-based RPG built on the Farcaster framework, offers an evolving adventure shaped by your on-chain and Farcaster interactions.

![banner](./docs/banner.png)

## Live App

https://ai-quest-frameworks.vercel.app/

## Demo Video

https://youtu.be/-BZMiEdXBlo

## Description

### Overview:

AI Quest merges text-based RPGs with blockchain and AI to create unique experiences. Your social and blockchain activities directly influence the game's story and environment.

### Features:

- **Dynamic Adventure:** Your actions and interactions shape a unique dark fantasy world, offering a new journey every time.
- **Video NFTs:** Transform your gameplay stories into Video NFTs, capturing memorable moments.
- **Social Gaming:** The game mirrors your online life, changing scenarios and challenges based on your digital footprint.

### Technical Highlights:

- **Open Standards:** Uses Frames.js for seamless integration within the open frame ecosystem.
- **Data Analysis:** Leverages Airstack and Pinata for in-depth interaction tracking.
- **Creative Content:** Employs Livepeer and Base Sepolia for cutting-edge video creation and NFT minting.

## How It Works

![technical-detail](./frames/public/technical-detail.png)

- Utilizes Frames.js to build a Farcaster Frame, ensuring compatibility with the open frame standard.
- Utilizes Airstack to access Farcaster and on-chain activity data through OnchainKit.
- Utilizes Pinata analytics to send and receive data regarding user interactions with the frame.
- Utilizes Livepeer for video generation and uploading.
- Utilizes Base Sepolia for NFT minting with generated content.
- Utilizes OpenAI API for the creation of text and images, dynamically changing content based on user interaction and activity from Farcaster and the blockchain.

## Technical Detail

### Frames.js

Utilizes Frames.js to build a Farcaster Frame, ensuring compatibility with the open frame standard.

We utilize the following example code:

- new-api-multi-page
- new-api-transaction
- new-api-only-followers-can-mint

Using Frames.js, we successfully developed the product within a two-day period.

This is the code where this technology is applied.

https://github.com/taijusanagi/aiquest/blob/main/frames/app/frames/route.tsx

Frames.js v0.9 is relatively new, so it was somewhat challenging to determine how to construct specific functions.

### Airstack

Utilizes Airstack to access Farcaster and on-chain activity data through OnchainKit. This data dictates the types of enemies based on the number of followers and accounts followed. It showcases a social RPG game influenced by on-chain activity, highlighting the potential to develop additional games using various OnchainKit data.

This is the code where this technology is applied.

https://github.com/taijusanagi/aiquest/blob/main/frames/pages/api/ai.ts#L55

Onchain data & social game is the future.

### Pinata Analytics

Utilizes Pinata analytics to send and receive data regarding user interactions with the frame. The data is employed to assess difficulty levels. The difficulty increases with more user interactions within a 30-minute timeframe.

This is the code where this technology is applied.

https://github.com/taijusanagi/aiquest/blob/main/frames/pages/api/ai.ts#L35

Next time, I aim to explore the Pinata Frame SDK more comprehensively, not just its analytics features.

### Livepeer

Utilizes Livepeer for video generation and uploading. It utilizes ffmpeg to create videos from images and audio, then uploads them to Livepeer Studio.

This is the video that was created during the demonstration.

https://lvpr.tv/?v=3035cse1fdtnhemq

This is the code where this technology is applied.

https://github.com/taijusanagi/aiquest/blob/main/frames/pages/api/video.ts

I find Video NFTs very interesting and want to delve deeper into creating more of them.

### Base

Utilizes Base Sepolia for NFT minting with generated content. Base is currently thriving and is believed to be the best place to create games based on on-chain activity.

This is the transaction that was created during the demonstration.

https://base-sepolia.blockscout.com/tx/0x3a099a29d1f5cf4bdd83d25129300342bd93301054de9d974fc95cbedf07336e

This is the code where this technology is applied.

https://github.com/taijusanagi/aiquest/blob/main/frames/app/txdata/route.ts#

Base and Farcaster have emerged as the default choices for Web3 social platforms.

### XMTP

AI Quest is compatible with Open Frame Standard.

https://github.com/open-frames/awesome-open-frames/pull/30

This is the code where this technology is applied.

https://github.com/taijusanagi/aiquest/blob/main/frames/app/frames/route.tsx#L13

Experienced something novel.
