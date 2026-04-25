"use client"

import React from 'react'
import { supabase } from '../../supabaseClient'

interface User {
    id: number
    name: string
    email: string
}

const About = () => {

    const [usersData, setUsersData] = React.useState<User[]>([])
    const addUser = async () => {
        try {
            const { data, error } = await supabase
                .from('users')
                .insert([{ name: 'Parag', email: 'parag@gmail.com' }])
                .select()

            if (error) { console.error("Error:", error.message); return }
            console.log("Inserted:", data)
        } catch (err) {
            console.log("Unexpected error:", err)
        }
    }

    // ✅ UPDATE — change email where id = 7
    const updateUser = async () => {
        try {
            const { data, error } = await supabase
                .from('users')
                .update({ email: 'newemail@gmail.com', name: "vijay" })  // 👈 jo update karna ho
                .eq('id', 7)                               // 👈 konsa row update karna hai
                .select()

            if (error) { console.error("Error:", error.message); return }
            console.log("Updated:", data)
        } catch (err) {
            console.log("Unexpected error:", err)
        }
    }

    // ✅ DELETE — delete row where id = 7
    const deleteUser = async () => {
        try {
            const { data, error } = await supabase
                .from('users')
                .delete()
                .eq('id', 7)   // 👈 konsa row delete karna hai
                .select()      // 👈 deleted row return karega (optional)

            if (error) { console.error("Error:", error.message); return }
            console.log("Deleted:", data)
        } catch (err) {
            console.log("Unexpected error:", err)
        }
    }
    const getUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')   // 👈 * means all columns

            if (error) { console.error("Error:", error.message); return }
            console.log("Users:", data)
            setUsersData(data)
      
        } catch (err) {
            console.log("Unexpected error:", err)
        }
    }
    return (
        <>
            <div>
                <button onClick={addUser}>Add</button> <br />
                <button onClick={updateUser}>Update</button> <br />
                <button type='button' onClick={deleteUser}>Delete</button>
                <button onClick={getUsers}>Get Users</button>
            </div>

            <div>
                {usersData.map((user: User) => (
                    <div key={user.id}>
                        <span>Name: {user.name}</span>&nbsp;&nbsp;
                        <span>Email: {user.email}</span>
                    </div>
                ))
                }
            </div>
        </>)
}
export default About