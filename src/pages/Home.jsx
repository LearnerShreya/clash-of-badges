// FILE: src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/card';
import { Input } from '../components/input';
import { Button } from '../components/button';

const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const RANGE = "Sheet1!A2:E";

export default function Home() {
  const [segment, setSegment] = useState("Dragon");
  const [data, setData] = useState({});
  const [newMember, setNewMember] = useState({ name: "", badge: "" });

  // Fetch data from Google Sheets
  useEffect(() => {
    fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
    )
      .then((res) => res.json())
      .then((result) => {
        const rows = result.values || [];
        const structuredData = {};
        rows.forEach(([name, badge, date, seg]) => {
          if (!structuredData[seg]) structuredData[seg] = [];
          structuredData[seg].push({ name, badge, date });
        });
        setData(structuredData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.badge) return;

    const today = new Date().toISOString().split('T')[0];
    const postData = {
      values: [[newMember.name, newMember.badge, today, segment, ""]]
    };

    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A2:E:append?valueInputOption=USER_ENTERED&key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to append data:", errorData);
        alert("❌ Failed to add member. Check console for details.");
        return;
      }

      // Update local state without reloading
      const updatedList = data[segment] || [];
      const newEntry = {
        name: newMember.name,
        badge: newMember.badge,
        date: today
      };
      setData({ ...data, [segment]: [...updatedList, newEntry] });

      // Reset form
      setNewMember({ name: "", badge: "" });

    } catch (error) {
      console.error("Error adding member:", error);
      alert("❌ An error occurred. Try again.");
    }
  };

  const segments = Object.keys(data);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">🏅 Badge Tracker</h1>

      {/* Segment Tabs */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        {segments.map((s) => (
          <Button key={s} variant={segment === s ? "default" : "outline"} onClick={() => setSegment(s)}>
            {s}
          </Button>
        ))}
      </div>

      {/* Member List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data[segment]?.map((member, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold">{member.name}</h2>
              <p className="text-sm">🏆 {member.badge}</p>
              <p className="text-sm">📅 {member.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Admin Add Form */}
      <div className="mt-10 border-t pt-6">
        <h2 className="text-2xl font-bold mb-4">➕ Add Member to {segment}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Member Name"
            value={newMember.name}
            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
          />
          <Input
            placeholder="Badge Name"
            value={newMember.badge}
            onChange={(e) => setNewMember({ ...newMember, badge: e.target.value })}
          />
        </div>
        <Button className="mt-4" onClick={handleAddMember}>Add Member</Button>
      </div>
    </div>
  );
}