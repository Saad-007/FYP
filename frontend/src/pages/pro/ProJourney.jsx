import { useState, useEffect } from "react";
import { Lock, Unlock, Play, BookOpen } from "lucide-react";
import RagTheoryModal from "./views/RagTheoryModal";

// Pro Tracks Data Structure
const TRACKS = {
  "Data Scientist": [
    {
      id: "zone1_data_wrangling",
      title: "1.1 Big Data & Vectorization",
      xp: 75,
      reqLevel: 1,
    },
    {
      id: "zone2_feature_eng",
      title: "1.2 Feature Engineering (PCA)",
      xp: 100,
      reqLevel: 2,
    },
    {
      id: "zone3_ensemble",
      title: "1.3 Ensemble Methods (XGBoost)",
      xp: 150,
      reqLevel: 3,
    },
  ],
  "ML Engineer": [
    {
      id: "zone4_cnn",
      title: "2.1 Deep Learning (CNNs)",
      xp: 100,
      reqLevel: 4,
    },
    {
      id: "zone5_api",
      title: "2.2 Model Serving (FastAPI)",
      xp: 150,
      reqLevel: 5,
    },
  ],
};

export default function ProJourney({ userId, onOpenWorkspace }) {
  const [progress, setProgress] = useState(null);
  const [completedZones, setCompletedZones] = useState([]);
  const [activeTrack, setActiveTrack] = useState("Data Scientist");
  const [activeTheoryZone, setActiveTheoryZone] = useState(null);
  const [theoryCompletedZones, setTheoryCompletedZones] = useState([]); // Temporary unlock before code execution

  useEffect(() => {
    // Backend se actual progress load karna
    fetch(`http://localhost:5000/api/workspace/progress/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProgress(data.progress);
          setCompletedZones(data.completedZones);
          setActiveTrack(data.progress.current_track || "Data Scientist");
        }
      });
  }, [userId]);

  if (!progress)
    return <div style={{ color: "#fff", padding: 20 }}>Loading Roadmap...</div>;

  const currentLevel = progress.level;

  return (
    <div
      style={{
        padding: "40px",
        background: "#0A0B0E",
        minHeight: "100vh",
        color: "#CDD6F4",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Header Stats */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid #1E2028",
          paddingBottom: 20,
          marginBottom: 30,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 28, color: "#fff" }}>
            Pro Learning Path
          </h1>
          <p style={{ margin: "5px 0 0", color: "#6C7086" }}>
            Master production-grade AI & Data Engineering
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <h2 style={{ margin: 0, color: "#4F8EF7" }}>Level {currentLevel}</h2>
          <span style={{ fontSize: 14, color: "#34D399" }}>
            {progress.total_xp} XP Earned
          </span>
        </div>
      </div>

      {/* Track Selector */}
      <div style={{ display: "flex", gap: 15, marginBottom: 30 }}>
        {Object.keys(TRACKS).map((track) => (
          <button
            key={track}
            onClick={() => setActiveTrack(track)}
            style={{
              padding: "10px 20px",
              background: activeTrack === track ? "#4F8EF7" : "transparent",
              border: `1px solid ${activeTrack === track ? "#4F8EF7" : "#1E2028"}`,
              color: activeTrack === track ? "#fff" : "#6C7086",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {track}
          </button>
        ))}
      </div>

      {/* Roadmap List */}
      <div style={{ display: "grid", gap: 15 }}>
        {TRACKS[activeTrack].map((zone) => {
          const isUnlocked = currentLevel >= zone.reqLevel;
          const isCompleted = completedZones.includes(zone.id);

          return (
            <div
              key={zone.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px",
                background: "#0D0F12",
                border: `1px solid ${isUnlocked ? "#313244" : "#181A21"}`,
                borderRadius: 12,
                opacity: isUnlocked ? 1 : 0.5,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                {isUnlocked ? (
                  <Unlock size={20} color="#4F8EF7" />
                ) : (
                  <Lock size={20} color="#6C7086" />
                )}
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 16,
                      color: isUnlocked ? "#fff" : "#6C7086",
                    }}
                  >
                    {zone.title}
                  </h3>
                  <span style={{ fontSize: 12, color: "#A78BFA" }}>
                    +{zone.xp} XP
                  </span>
                </div>
              </div>

              {isUnlocked && (
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => setActiveTheoryZone(zone)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "8px 16px",
                      background: "rgba(167,139,250,0.1)",
                      border: "1px solid #A78BFA",
                      borderRadius: 6,
                      color: "#A78BFA",
                      cursor: "pointer",
                    }}
                  >
                    <BookOpen size={14} /> AI Theory
                  </button>

                  <button
                    onClick={() => onOpenWorkspace(zone.id)}
                    disabled={
                      !isCompleted && !theoryCompletedZones.includes(zone.id)
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "8px 16px",
                      background: isCompleted
                        ? "#1E2028"
                        : theoryCompletedZones.includes(zone.id)
                          ? "#34D399"
                          : "#181A21",
                      border: "none",
                      borderRadius: 6,
                      color: isCompleted
                        ? "#6C7086"
                        : theoryCompletedZones.includes(zone.id)
                          ? "#000"
                          : "#313244",
                      cursor:
                        !isCompleted && !theoryCompletedZones.includes(zone.id)
                          ? "not-allowed"
                          : "pointer",
                      fontWeight: 600,
                    }}
                  >
                    {isCompleted ? (
                      "Completed"
                    ) : (
                      <>
                        <Play size={14} /> Open Sandbox
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
           {activeTheoryZone && (
          <RagTheoryModal
            zone={activeTheoryZone}
            onClose={() => setActiveTheoryZone(null)}
            onComplete={(zoneId) => {
              setTheoryCompletedZones((prev) => [...prev, zoneId]);
              setActiveTheoryZone(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
