import { motion } from 'framer-motion';
import { Upload, Search, Clock, Volume2 } from 'lucide-react';

const steps = [
  {
    icon: <Upload className="w-8 h-8 text-orange-500" />,
    title: "Upload or Capture",
    description: "Upload a picture of your palm or take one using your webcam."
  },
  {
    icon: <Search className="w-8 h-8 text-orange-500" />,
    title: "Analyze",
    description: "Press the 'Analyze Palm' button to start the AI analysis."
  },
  {
    icon: <Clock className="w-8 h-8 text-orange-500" />,
    title: "Wait",
    description: "Our mystical AI will decode the secrets hidden in your palm lines."
  },
  {
    icon: <Volume2 className="w-8 h-8 text-orange-500" />,
    title: "Listen or Read",
    description: "Receive your palm reading as text or listen to the audio version."
  }
];

const HowToUse: React.FC = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-yellow-100 to-orange-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-orange-800 mb-8">How to Use Palm Reader AI</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-orange-700 mb-2 text-center">{step.title}</h3>
              <p className="text-orange-600 text-center">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToUse;