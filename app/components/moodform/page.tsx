// app/components/EmotionForm.tsx

import { useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
);

const EmotionForm: React.FC = () => {
  const [text, setText] = useState("");
  const [emotions, setEmotions] = useState<{ [key: string]: number } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const myHeaders = new Headers();
      myHeaders.append("apikey", "C1LXNb1Nc6K1xlVwKkrib71yJYWe4c49"); // Replace with your API key

      const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({ text }),
      };

      const response = await fetch(
        "https://api.apilayer.com/text_to_emotion",
        requestOptions
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${errorText}`
        );
      }

      const result = await response.json();
      setEmotions(result);

      // Create a playlist based on the emotions
      const playlistResponse = await fetch("/api/createPlaylist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emotions: result }), // Send emotions data
      });

      if (!playlistResponse.ok) {
        const errorText = await playlistResponse.text();
        throw new Error(
          `HTTP error! Status: ${playlistResponse.status}, Message: ${errorText}`
        );
      }

      const playlistData = await playlistResponse.json();
      setPlaylistUrl(playlistData.playlistUrl);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to prepare data for the chart
  const getChartData = (emotions: { [key: string]: number }) => {
    const labels = Object.keys(emotions);
    const data = Object.values(emotions);

    return {
      labels,
      datasets: [
        {
          label: "Emotion Probability",
          data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)", // Red
            "rgba(54, 162, 235, 0.2)", // Blue
            "rgba(255, 206, 86, 0.2)", // Yellow
            "rgba(75, 192, 192, 0.2)", // Green
            "rgba(153, 102, 255, 0.2)", // Purple
            "rgba(255, 159, 64, 0.2)", // Orange
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            cols={40}
            placeholder="Tell us how you are feeling today"
            style={{
              width: "100%",
              border: "2px solid #0070f3",
              borderRadius: "4px",
              padding: "10px",
              boxSizing: "border-box",
              fontSize: "16px",
              resize: "none", // Prevent resizing
            }}
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            opacity: loading ? 0.6 : 1,
            marginTop: "10px",
          }}
        >
          {loading ? "Analyzing..." : "Analyze Emotions"}
        </button>
      </form>
      {emotions && (
        <div style={{ marginTop: "20px" }}>
          <h2>Emotion Summary</h2>
          <div style={{ maxWidth: "800px", margin: "auto" }}>
            <Pie
              data={getChartData(emotions)}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top" as const,
                  },
                  tooltip: {
                    callbacks: {
                      label: function (tooltipItem) {
                        return `${tooltipItem.label}: ${(
                          (tooltipItem.raw as number) * 100
                        ).toFixed(2)}%`;
                      },
                    },
                  },
                },
                maintainAspectRatio: false, // Allow custom size
              }}
            />
          </div>
        </div>
      )}
      {playlistUrl && (
        <div style={{ marginTop: "20px" }}>
          <h2>Generated Playlist</h2>
          <a
            href={playlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#0070f3",
              textDecoration: "none",
              fontSize: "18px",
            }}
          >
            Open your playlist
          </a>
        </div>
      )}
    </div>
  );
};

export default EmotionForm;
