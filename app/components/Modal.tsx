'use client';

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-black/75 transition-opacity"
          onClick={onClose}
        />

        <div className="inline-block transform overflow-hidden rounded-lg text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="relative">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 