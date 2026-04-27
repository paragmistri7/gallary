"use client";

import React, { useState, useEffect } from "react";

export interface UserFormData {
  username: string;
  password: string;
  name: string;
  email: string;
  mobile_no: string;
  address: string;
}

interface Props {
  mode: "add" | "update";
  initialData?: UserFormData | null;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
}

interface FieldDef {
  label: string;
  name: keyof UserFormData;
  type: string;
  multiline?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
  hideOnUpdate?: boolean;
}

const FIELDS: FieldDef[] = [
  { label: "Username",   name: "username",  type: "text",     placeholder: "e.g. john_doe" },
  { label: "Password",   name: "password",  type: "password", placeholder: "••••••••", hideOnUpdate: true },
  { label: "Full Name",  name: "name",      type: "text",     placeholder: "e.g. John Doe" },
  { label: "Email",      name: "email",     type: "email",    placeholder: "e.g. john@example.com" },
  { label: "Mobile No",  name: "mobile_no", type: "tel",      placeholder: "e.g. +91 9876543210" },
  { label: "Address",    name: "address",   type: "text",     multiline: true, fullWidth: true, placeholder: "Enter full address" },
];

const REQUIRED_FIELDS: (keyof UserFormData)[] = ["username", "password", "name", "email"];

const EMPTY: UserFormData = {
  username: "", password: "", name: "", email: "", mobile_no: "", address: "",
};

const UserDialog: React.FC<Props> = ({ mode, initialData, onSubmit, onCancel }) => {
const [form, setForm] = useState<UserFormData>(() =>
  initialData ? { ...EMPTY, ...initialData, password: "" } : EMPTY
);
  
  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});
  const [showPassword, setShowPassword] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof UserFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errs: Partial<Record<keyof UserFormData, string>> = {};

    if (!form.username.trim()) errs.username = "Username is required";
    else if (form.username.length < 3) errs.username = "Min 3 characters";

    if (mode === "add") {
      if (!form.password.trim()) errs.password = "Password is required";
      else if (form.password.length < 4) errs.password = "Min 4 characters";
    }

    if (!form.name.trim()) errs.name = "Full name is required";

    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email address";

    if (form.mobile_no && !/^\+?[\d\s\-(]{10}$/.test(form.mobile_no))
      errs.mobile_no = "Invalid mobile number";

   if (form.address.length > 75) errs.address = "Address too long (max 75 chars)"; 

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const payload = { ...form };
      // Don't send empty password on update
      if (mode === "update" && !payload.password) {
        delete (payload as Partial<UserFormData>).password;
      }
      onSubmit(payload);
    }
  };

  const isAdd = mode === "add";
  const visibleFields = FIELDS.filter((f) => !(mode === "update" && f.hideOnUpdate));

  return (
    <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div style={s.dialog}>

        {/* ── Header ── */}
        <div style={s.dialogHeader}>
          <div style={{ ...s.iconWrap, background: isAdd ? "linear-gradient(135deg,#14b8a6,#0d9488)" : "linear-gradient(135deg,#6366f1,#4f46e5)" }}>
            <span style={s.icon}>{isAdd ? "＋" : "✎"}</span>
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={s.title}>{isAdd ? "Add New User" : "Edit User"}</h2>
            <p style={s.subtitle}>
              {isAdd
                ? "Fill in all required fields to create a new account."
                : `Editing: ${initialData?.username ?? ""} — leave password blank to keep it unchanged.`}
            </p>
          </div>
          <button style={s.closeBtn} onClick={onCancel} title="Close">✕</button>
        </div>

        <div style={s.divider} />

        {/* ── Fields ── */}
        <div style={s.scrollArea}>
          <div style={s.fieldGrid}>
            {visibleFields.map(({ label, name, type, multiline, fullWidth, placeholder }) => {
              const isRequired = mode === "add"
                ? REQUIRED_FIELDS.includes(name)
                : name !== "password" && REQUIRED_FIELDS.filter(f => f !== "password").includes(name);
              const isPassword = name === "password";
              const inputType = isPassword ? (showPassword ? "text" : "password") : type;

              return (
                <div key={name} style={fullWidth ? s.fullCol : s.halfCol}>
                  <label style={s.label}>
                    {label}
                    {isRequired && <span style={s.required}> *</span>}
                  </label>

                  <div style={isPassword ? s.inputWrap : undefined}>
                    {multiline ? (<>
                      <textarea
                        name={name}
                        value={form[name]}
                        maxLength={75}
                        onChange={handleChange}
                        rows={3}
                        placeholder={placeholder}
                        style={{
                          ...s.input,
                          ...s.textarea,
                          ...(errors[name] ? s.inputError : {}),
                        }}
                      />
                      <div style={{ fontSize: "12px", color: "#888" , display: "flex", justifyContent: "flex-end"}}>
                         {form.address.length}/75
                      </div>
                        </>
                    ) : (
                      <input
                        type={inputType}
                        name={name}
                        value={form[name]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        autoComplete={isPassword ? "new-password" : "off"}
                        style={{
                          ...s.input,
                          ...(isPassword ? { paddingRight: 40 } : {}),
                          ...(errors[name] ? s.inputError : {}),
                        }}
                      />
                    )}
                    {isPassword && (
                      <button
                        type="button"
                        style={s.eyeBtn}
                        onClick={() => setShowPassword((v) => !v)}
                        tabIndex={-1}
                      >
                        {showPassword ? "🙈" : "👁"}
                      </button>
                    )}
                  </div>

                  {errors[name] && <span style={s.errorMsg}>⚠ {errors[name]}</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div style={s.divider} />

        {/* ── Footer Buttons ── */}
        <div style={s.btnRow}>
          <button
            style={s.cancelBtn}
            onClick={onCancel}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#475569")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e293b")}
          >
            Cancel
          </button>
          <button
            style={isAdd ? s.submitBtnAdd : s.submitBtnUpdate}
            onClick={handleSubmit}
          >
            {isAdd ? "＋  Add User" : "✓  Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Styles ── */
const s: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "16px",
  },
  dialog: {
    background: "#1e293b",
    borderRadius: "18px",
    width: "100%",
    maxWidth: "560px",
    boxShadow: "0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.07)",
    overflow: "hidden",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
  },
  dialogHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    padding: "22px 22px 18px",
    position: "relative",
    flexShrink: 0,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
  },
  icon: {
    fontSize: "1.3rem",
    color: "#fff",
  },
  title: {
    margin: "0 0 4px",
    fontSize: "1.15rem",
    fontWeight: 700,
    color: "#f1f5f9",
    fontFamily: "'Sora', sans-serif",
  },
  subtitle: {
    margin: 0,
    fontSize: "0.8rem",
    color: "#64748b",
    lineHeight: 1.5,
  },
  closeBtn: {
    position: "absolute",
    top: 18,
    right: 18,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#64748b",
    fontSize: "0.9rem",
    cursor: "pointer",
    padding: "5px 9px",
    borderRadius: "8px",
    lineHeight: 1,
    transition: "background 0.2s",
  },
  divider: {
    height: 1,
    background: "rgba(255,255,255,0.07)",
    flexShrink: 0,
  },
  scrollArea: {
    overflowY: "auto",
    flex: 1,
  },
  fieldGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
    padding: "18px 22px",
  },
  halfCol: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  fullCol: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    gridColumn: "1 / -1",
  },
  label: {
    fontSize: "0.72rem",
    fontWeight: 700,
    color: "#94a3b8",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  required: {
    color: "#f87171",
  },
  inputWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  input: {
    padding: "10px 14px",
    background: "#0f172a",
    border: "1.5px solid #2d3f55",
    borderRadius: "8px",
    color: "#e2e8f0",
    fontSize: "0.88rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "'Sora', sans-serif",
    transition: "border-color 0.2s",
  },
  textarea: {
    resize: "none",
    lineHeight: "1.5",
  },
  inputError: {
    borderColor: "#f87171",
    background: "rgba(248,113,113,0.05)",
  },
  eyeBtn: {
    position: "absolute",
    right: 10,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "0.9rem",
    padding: "0 4px",
    color: "#475569",
    lineHeight: 1,
  },
  errorMsg: {
    fontSize: "0.72rem",
    color: "#f87171",
    marginTop: "2px",
  },
  btnRow: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
    padding: "14px 22px",
    flexShrink: 0,
  },
  cancelBtn: {
    padding: "10px 22px",
    background: "transparent",
    color: "#94a3b8",
    border: "1.5px solid #1e293b",
    borderRadius: "8px",
    fontSize: "0.85rem",
    cursor: "pointer",
    fontWeight: 600,
    transition: "border-color 0.2s",
    fontFamily: "'Sora', sans-serif",
  },
  submitBtnAdd: {
    padding: "10px 24px",
    background: "linear-gradient(135deg,#14b8a6,#0d9488)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.85rem",
    cursor: "pointer",
    fontWeight: 700,
    boxShadow: "0 4px 16px rgba(20,184,166,0.4)",
    fontFamily: "'Sora', sans-serif",
    letterSpacing: "0.01em",
  },
  submitBtnUpdate: {
    padding: "10px 24px",
    background: "linear-gradient(135deg,#6366f1,#4f46e5)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.85rem",
    cursor: "pointer",
    fontWeight: 700,
    boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
    fontFamily: "'Sora', sans-serif",
    letterSpacing: "0.01em",
  },
};

export default UserDialog;