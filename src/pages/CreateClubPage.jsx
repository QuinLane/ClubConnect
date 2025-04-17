import { useState } from 'react';

function CreateClubPage() {
  const [clubName, setClubName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call your backend API to create the club
    const res = await fetch('http://localhost:3001/api/clubs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clubName, description }),
    });

    if (res.ok) {
      alert('Club created!');
      setClubName('');
      setDescription('');
    } else {
      alert('Error creating club');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Create a New Club</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Club Name"
          value={clubName}
          onChange={(e) => setClubName(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <textarea
          placeholder="Club Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
          rows={4}
          required
        />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded">
          Create Club
        </button>
      </form>
    </div>
  );
}

export default CreateClubPage;
