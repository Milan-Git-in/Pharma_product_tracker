import React, { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";

export interface ReasonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  title: string;
  subtitle?: string;
  minCharacters?: number;
  placeholder?: string;
  confirmLabel?: string;
  loading?: boolean;
}

export const ReasonDialog: React.FC<ReasonDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  subtitle = "GMP regulations (21 CFR Part 11) require an explicit justification for this modification.",
  minCharacters = 5,
  placeholder = "Provide a detailed justification for this action...",
  confirmLabel = "Submit Justification",
  loading = false,
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim().length < minCharacters) {
      setError(`Reason must contain at least ${minCharacters} characters.`);
      return;
    }
    setError("");
    onSubmit(reason.trim());
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      badge="AUDIT MANDATED"
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="font-caption text-xs font-semibold text-on-surface flex items-center justify-between">
          <span>Reason for Change / Action</span>
          <span className="font-mono text-[10px] text-outline font-normal">
            Min {minCharacters} characters
          </span>
        </label>
        <textarea
          rows={3}
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (error) setError("");
          }}
          placeholder={placeholder}
          className="w-full p-3 bg-surface-container-lowest border border-outline-variant/60 rounded-lg text-xs font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {error && <span className="font-caption text-[11px] text-error font-medium">{error}</span>}
      </form>
    </Modal>
  );
};

export default ReasonDialog;

