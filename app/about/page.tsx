"use client";

import React, { useState } from "react";
import { supabase } from "../../supabaseClient";

interface User {
  id: number;
  name: string;
  email: string;
}

const About = () => {
  const [usersData, setUsersData] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [updateId, setUpdateId] = useState<number | "">("");
  const [updateName, setUpdateName] = useState("");
  const [updateEmail, setUpdateEmail] = useState("");
  const [deleteId, setDeleteId] = useState<number | "">("");

  const addUser = async () => {
    if (!name || !email) return alert("Name and email are required");
    try {
      const { data, error } = await supabase
        .from("users")
        .insert([{ name, email }])
        .select();
      if (error) { console.error("Error:", error.message); return; }
      console.log("Inserted:", data);
      setName("");
      setEmail("");
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const updateUser = async () => {
    if (!updateId || !updateName || !updateEmail) return alert("All fields required");
    try {
      const { data, error } = await supabase
        .from("users")
        .update({ email: updateEmail, name: updateName })
        .eq("id", updateId)
        .select();
      if (error) { console.error("Error:", error.message); return; }
      console.log("Updated:", data);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const deleteUser = async () => {
    if (!deleteId) return alert("ID is required");
    try {
      const { data, error } = await supabase
        .from("users")
        .delete()
        .eq("id", deleteId)
        .select();
      if (error) { console.error("Error:", error.message); return; }
      console.log("Deleted:", data);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const getUsers = async () => {
    try {
      const { data, error } = await supabase.from("users").select("*");
      if (error) { console.error("Error:", error.message); return; }
      setUsersData(data);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 16 }}>
        <h3>Add User</h3>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button onClick={addUser}>Add</button>

        <h3>Update User</h3>
        <input placeholder="ID" type="number" value={updateId} onChange={(e) => setUpdateId(Number(e.target.value))} />
        <input placeholder="New Name" value={updateName} onChange={(e) => setUpdateName(e.target.value)} />
        <input placeholder="New Email" value={updateEmail} onChange={(e) => setUpdateEmail(e.target.value)} />
        <button onClick={updateUser}>Update</button>

        <h3>Delete User</h3>
        <input placeholder="ID" type="number" value={deleteId} onChange={(e) => setDeleteId(Number(e.target.value))} />
        <button onClick={deleteUser}>Delete</button>

        <button onClick={getUsers}>Get Users</button>
      </div>

      <div style={{ padding: 16 }}>
        {usersData.map((user: User) => (
          <div key={user.id}>
            <span>Name: {user.name}</span>&nbsp;&nbsp;
            <span>Email: {user.email}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default About;