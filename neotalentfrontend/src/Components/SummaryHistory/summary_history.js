import React, { useEffect, useState } from "react";
import PocketBase from "pocketbase";
import "./summary_history.scss";

const pb = new PocketBase(process.env.REACT_APP_POCKETBASE_EP);
pb.autoCancellation(false);

function SummaryHistory({ userId }) {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!userId) return;

    async function fetchSummariesAsAdmin() {
      try {
        await pb.admins.authWithPassword(
          process.env.REACT_APP_POCKETBASE_EMAIL || "admin@example.com",
          process.env.REACT_APP_POCKETBASE_PASSWORD || "supersecret"
        );

        const result = await pb.collection("summaries").getFullList({
          filter: `user="${userId}"`,
          sort: "-created",
        });

        setSummaries(result);
      } catch (err) {
        console.error("Error fetching summaries:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSummariesAsAdmin();
  }, [userId]);

  const filteredSummaries = summaries.filter((s) =>
    s.summary_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="SummaryHistory">
      <div className="SummaryContainer">
        <input
          type="text"
          placeholder="Search summaries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="SummarySearch"
        />

        {loading && <p>Loading summaries...</p>}
        {!loading && filteredSummaries.length === 0 && (
          <p>No summaries found.</p>
        )}

        {!loading &&
          filteredSummaries.map((summary) => (
            <div key={summary.id} className="SummaryCard">
              <p>{summary.summary_text}</p>
              <small>{new Date(summary.created).toLocaleString()}</small>
            </div>
          ))}
      </div>
    </div>
  );
}

export default SummaryHistory;
