'use client';

import { motion, AnimatePresence } from 'framer-motion';

/**
 * Props for the Modal component
 * @interface ModalProps
 * 
 * @property {boolean} isOpen - Controls modal visibility
 * @property {() => void} onClose - Function called to close the modal
 * @property {React.ReactNode} children - Content to display inside the modal
 */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const modalVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.95,
    y: 20
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20
  }
};

/**
 * Reusable Modal component with backdrop and animation
 * 
 * @component
 * @param {ModalProps} props - Component props
 * @returns {JSX.Element|null} The modal or null if isOpen is false
 * 
 * @example
 * ```tsx
 * <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
 *   <div className="p-4">
 *     <h2>Modal Content</h2>
 *   </div>
 * </Modal>
 * ```
 */
export default function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 w-full max-w-lg mx-4"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 