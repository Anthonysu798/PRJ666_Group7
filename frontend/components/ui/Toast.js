import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X } from "lucide-react";

const Toast = ({ message, onClose, type = "success" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 
                    text-emerald-400 px-4 py-3 rounded-lg shadow-lg">
        <CheckCircle className="w-5 h-5" />
        <p className="font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-4 p-1 hover:bg-emerald-500/10 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default Toast; 