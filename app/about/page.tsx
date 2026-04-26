"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import UserDialog, { UserFormData } from "./useDialog";

/* ─── Types ─── */
interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  mobile_no: string;
  address: string;
  created_at: string;
}

export default function About() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "update">("add");
  const [selected, setSelected] = useState<User | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  /* ── Toast ── */
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Fetch Users ── */
  const fetchUsers = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("users")
      .select("id, username, name, email, mobile_no, address, created_at")
      .order("id", { ascending: true });

    if (!error && data) setUsers(data as User[]);
    else showToast("Failed to fetch users", "error");

    setLoading(false);
  };

useEffect(() => {
  const loadUsers = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("id", { ascending: true });

    if (!error && data) setUsers(data as User[]);
    else showToast("Failed to fetch users", "error");

    setLoading(false);
  };

  loadUsers();
}, []);

  /* ── Handlers ── */
  const handleAddNew = () => {
    setSelected(null);
    setMode("add");
    setDialogOpen(true);
  };

  const handleDialogSubmit = async (formData: UserFormData) => {
    if (mode === "add") {
      const { error } = await supabase.from("users").insert([formData]);
      if (error) return showToast(error.message, "error");
      showToast("User created ✓");
    } else if (selected) {
      const payload: Partial<UserFormData> = { ...formData };
      if (!payload.password) delete payload.password;

      const { error } = await supabase
        .from("users")
        .update(payload)
        .eq("id", selected.id);

      if (error) return showToast(error.message, "error");
      showToast("User updated ✓");
    }

    setDialogOpen(false);
    fetchUsers();
  };

  const dialogInitialData: UserFormData | null = selected
    ? {
        username: selected.username ?? "",
        password: "",
        name: selected.name ?? "",
        email: selected.email ?? "",
        mobile_no: selected.mobile_no ?? "",
        address: selected.address ?? "",
      }
    : null;

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.topBar}>
        <div>
          <h1 style={s.heading}>User Management</h1>
          <p style={s.subheading}>
            {loading ? "Loading..." : `${users.length} users`}
          </p>
        </div>

        <button style={s.addBtn} onClick={handleAddNew}>
          + Add User
        </button>
      </div>

      {/* Table */}
      <div style={s.tableWrapper}>
     <table style={s.table}>
  <thead>
    <tr>
      {["ID", "Username", "Name", "Email", "Mobile", "Address", "Joined"].map((h) => (
        <th key={h} style={s.th}>{h}</th>
      ))}
    </tr>
  </thead>

  <tbody>
    {loading ? (
      <tr>
        <td colSpan={7} style={s.empty}>Loading...</td>
      </tr>
    ) : users.length === 0 ? (
      <tr>
        <td colSpan={7} style={s.empty}>No users found</td>
      </tr>
    ) : (
      users.map((u) => (
        <tr
          key={u.id}
          style={s.row}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, s.rowHover)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, { background: "transparent", transform: "none" })}
          onDoubleClick={() => {
            setSelected(u);
            setMode("update");
            setDialogOpen(true);
          }}
        >
          <td style={s.td}>{u.id}</td>
          <td style={{ ...s.td, fontWeight: 600 }}>{u.username ?? "-"}</td>
          <td style={s.td}>{u.name ?? "-"}</td>
          <td style={s.td}>{u.email ?? "-"}</td>
          <td style={{ ...s.td, fontFamily: "monospace" }}>{u.mobile_no ?? "-"}</td>
          <td style={s.td}>{u.address ?? "-"}</td>
          <td style={s.td}>
            {u.created_at
              ? new Date(u.created_at).toLocaleDateString("en-IN")
              : "-"}
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>
      </div>

      {/* Toast */}
      {toast && (
        <div
          style={{
            ...s.toast,
            background:
              toast.type === "success"
                ? "green"
                : "crimson",
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* Dialog */}
      {dialogOpen && (
        <UserDialog
          key={mode + (dialogInitialData?.username ?? "new")}
          mode={mode}
          initialData={dialogInitialData}
          onSubmit={handleDialogSubmit}
          onCancel={() => setDialogOpen(false)}
        />
      )}
    </div>
  );
}

/* ─── Styles ─── */
const s: Record<string, React.CSSProperties> = {
  page: {
    padding: 24,
    background: "#070e1c",
    minHeight: "100vh",
    fontFamily: "'Sora', sans-serif",
    color: "#e2e8f0",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  heading: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#f1f5f9",
  },

  subheading: {
    fontSize: "0.8rem",
    color: "#64748b",
  },

  addBtn: {
    padding: "10px 18px",
    background: "linear-gradient(135deg,#14b8a6,#0d9488)",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    boxShadow: "0 4px 14px rgba(20,184,166,0.35)",
  },

  tableWrapper: {
    overflow: "hidden",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.06)",
    background: "#0f172a",
    boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.85rem",
  },

  th: {
    textAlign: "left",
    padding: "14px 16px",
    background: "#1e293b",
    color: "#94a3b8",
    fontSize: "0.7rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 700,
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },

  td: {
    padding: "14px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    color: "#cbd5e1",
  },

  row: {
    transition: "all 0.2s ease",
    cursor: "pointer",
  },

  rowHover: {
    background: "rgba(255,255,255,0.03)",
    transform: "scale(1.002)",
  },

  empty: {
    textAlign: "center",
    padding: 30,
    color: "#64748b",
  },

  toast: {
    position: "fixed",
    bottom: 24,
    right: 24,
    padding: "12px 18px",
    borderRadius: 10,
    color: "#fff",
    fontWeight: 600,
    fontSize: "0.85rem",
    boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
  },
};