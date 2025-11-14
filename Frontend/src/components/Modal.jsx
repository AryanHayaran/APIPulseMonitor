function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 from-gray-900/60 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white flex flex-col h-[130px]  rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="cursor-pointer min-w-[80px] px-8 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 font-medium transition duration-200"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer min-w-[80px] px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-sm transition duration-200"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
