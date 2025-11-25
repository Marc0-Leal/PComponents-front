import "../../styles/components/organisms/AdminModal.css";

export default function AdminModal({
  title,
  children,
  onClose,
}) {
  return (
    <div className="admin-modal-backdrop">
      <div className="admin-modal">
        <header className="admin-modal-header">
          <h2>{title}</h2>
          <button
            type="button"
            className="admin-modal-close"
            onClick={onClose}
          >
            ✕
          </button>
        </header>

        <div className="admin-modal-body">{children}</div>
      </div>
    </div>
  );
}
