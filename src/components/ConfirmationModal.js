'use client';

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonColor = 'bg-[#ED2024] hover:bg-[#C91A1A]',
  icon: Icon,
  iconColor = 'text-gray-500',
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          {/* Icon & Title */}
          <div className="flex items-center gap-4 mb-4">
            {Icon && (
              <div className={`flex-shrink-0 ${iconColor}`}>
                <Icon className="w-6 h-6" />
              </div>
            )}
            <h3 className="text-lg font-semibold text-primary-black">
              {title}
            </h3>
          </div>

          {/* Message */}
          <p className="text-sm text-gray-600 mb-6">
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-[5px] hover:bg-gray-50 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`cursor-pointer px-4 py-2 text-sm font-medium text-white rounded-[5px] transition-colors ${confirmButtonColor}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

