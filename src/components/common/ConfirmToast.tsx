import { toast } from 'react-hot-toast';

type Props = {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
};

export function showConfirmToast({ message, onConfirm, confirmText = 'Delete', cancelText = 'Cancel' }: Props) {
  const id = toast.custom(
    (t) => (
      <div
        className="w-[480px] max-w-[90vw] rounded-xl border border-gray-200 bg-white shadow-lg p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`confirm-${id}`}
      >
        <p id={`confirm-${id}`} className="text-sm text-gray-800">
          {message}
        </p>
        <div className="mt-3 flex justify-end gap-2">
          <button
            className="px-3 py-1.5 text-sm rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
            onClick={() => toast.dismiss(t.id)}
          >
            {cancelText}
          </button>
          <button
            className="px-3 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    ),
    { duration: 5000 }
  );

  return id;
}
