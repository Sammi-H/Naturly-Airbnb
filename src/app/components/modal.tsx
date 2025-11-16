interface ModalProps {
  isOpen: boolean;
  title: string;
  confirmText?: string;
  onConfirm?: () => void;
  onClose?: () => void;
}

export default function Modal({ isOpen, title, confirmText, onConfirm, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modalBackdrop">
      <div className="modalContent">
        <p>{title}</p>
        <div className="modalButtons">
          {confirmText && onConfirm && (
            <button className="paymentbtn" onClick={onConfirm}>{confirmText}</button>
          )}
          <button className="close" onClick={onClose}>Stäng</button>
        </div>
      </div>
    </div>
  );
}
