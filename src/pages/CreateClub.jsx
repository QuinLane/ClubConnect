export async function createClub(data) {
  const res = await fetch("http://localhost:3001/api/clubs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
