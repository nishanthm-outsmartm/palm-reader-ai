# Palm Reader AI 🔮🖐️

Palm Reader AI is an innovative (but mostly fun) web application that uses artificial intelligence to analyze palm images and provide mystical readings. This project was developed as part of the Dev Pinata challenge, showcasing the integration of AI technologies with decentralized storage solutions.

## 🌟 Features

- Upload palm images for AI analysis
- Receive personalized palm readings
- Text-to-speech functionality for audio readings
- Gallery of past readings
- Responsive and mystical UI design

## 🚀 Tech Stack

- **Frontend**: Next.js with React
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API Requests**: Axios
- **Text-to-Speech**: Hugging Face Inference API
- **Decentralized Storage**: Pinata IPFS

## 🧠 AI Models

- **Palm Analysis**: facebook/detr-resnet-50 (Object Detection)
- **Text Generation**: meta-llama/Llama-2-7b-chat-hf
- **Text-to-Speech**: espnet/kan-bayashi_ljspeech_vits

## 🏗️ Project Structure

- `components/`: React components (Hero, FileUpload, PalmReading, etc.)
- `pages/`: Next.js pages and API routes
- `lib/`: Utility functions and AI model interactions
- `public/`: Static assets

## 🚀 Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/palm-reader-ai.git
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following:
   ```
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   PINATA_API_KEY=your_pinata_api_key
   PINATA_SECRET_API_KEY=your_pinata_secret_key
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔗 Dev Pinata Challenge

This project was created as part of the Dev Pinata challenge, which focuses on integrating Pinata's IPFS storage solutions into innovative applications. Palm Reader AI demonstrates the use of Pinata for storing and retrieving palm images and audio readings in a decentralized manner.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/palm-reader-ai/issues).

## 📜 License

This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.

## 🙏 Acknowledgements

- [Hugging Face](https://huggingface.co/) for providing powerful AI models
- [Pinata](https://www.pinata.cloud/) for decentralized storage solutions
- [Unsplash](https://unsplash.com/) for the beautiful tarot card image used in the hero section
- All open-source libraries and tools used in this project