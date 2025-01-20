"use client";
import { useState } from "react";

type RejectPopupProps = Readonly<{
  isOpen: boolean;
  onClose: () => void;
  onReject: (reason: string) => void;
}>;

export function RejectPopup({ isOpen, onClose, onReject }: RejectPopupProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Reject Exam Request</h3>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter rejection reason..."
          className="w-full p-3 border rounded-md h-32 mb-4 min-h-[120px] max-h-[200px]"
          maxLength={150} // Limit to 150 characters
        />
        <p className="text-sm text-gray-500 mt-1">
          {reason.length} / 150 characters
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onReject(reason);
              onClose();
            }}
            disabled={!reason.trim()}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
