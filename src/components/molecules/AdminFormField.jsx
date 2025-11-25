import "../../styles/components/molecules/Forms.css";

export default function AdminFormField({
  label,
  children,
}) {
  return (
    <div className="admin-form-field">
      <label className="admin-form-label">
        <span>{label}</span>
        {children}
      </label>
    </div>
  );
}
