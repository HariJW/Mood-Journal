import { Link } from "react-router-dom";
import "./MoodSelectorPage.css";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
function MoodSelectorPage() {
  const [date, setDate] = useState(new Date());
  const moodOptions = [
    { emoji: "😄", label: "Happy" },
    { emoji: "😠", label: "Angry" },
    { emoji: "😐", label: "Neutral" },
    { emoji: "😌", label: "Relaxed" },
    { emoji: "😔", label: "Sad" },
  ];

  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      const apiKey = import.meta.env.VITE_APP_WEATHER_API_KEY; // 🔑 Replace with your OpenWeather API key
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      try {
        const res = await axios.get(url);
        const weather = res.data;
        const temp = Math.round(weather.main.temp);
        const icon = weather.weather[0].icon;

        setWeatherData({
          temp: `${temp}°C`,
          iconUrl: `https://openweathermap.org/img/wn/${icon}.png`,
        });
      } catch (error) {
        console.error("Weather fetch failed", error);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  const handleMoodClick = (mood) => {
    setSelectedMood(mood.label);
  };

  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleSave = () => {
    if (!selectedMood || note.trim() === "") {
      window.alert("⚠️ Please select a mood and write a note.");
      return;
    }

    const newEntry = {
      date: formattedDate,
      mood: selectedMood,
      emoji: moodOptions.find((m) => m.label === selectedMood)?.emoji,
      note: note.trim(),
      temp: weatherData?.temp || "N/A",
    };

    let savedData = JSON.parse(localStorage.getItem("moodEntries")) || [];

    const existingIndex = savedData.findIndex(
      (entry) => entry.date === formattedDate
    );

    if (existingIndex !== -1) {
      savedData[existingIndex] = newEntry;
    } else {
      savedData.push(newEntry);
    }
    localStorage.setItem("moodEntries", JSON.stringify(savedData));

    window.alert("✅ Mood saved successfully!");
    setSelectedMood(null);
    setNote("");
  };

  return (
    <div className="mood-selector-page">
      <div className="mood-selector-page-content">
        <div className="top-bar">
          <h2 className="top-bar-title">MoodMate</h2>
          <Link to="/notes" className="topbar-link">
            All Notes
          </Link>

          {weatherData && (
            <div className="weather">
              <img
                src={weatherData.iconUrl}
                alt="weather"
                className="weather-icon"
              />
              <span className="weather-temp">{weatherData.temp}</span>
            </div>
          )}
        </div>
        <div className="mood-selector-page-main">
          <div className="mood-selector-section">
            <h2 className="current-date">{formattedDate}</h2>
            <h4 className="mood-selector-text">How are you feeling today?</h4>
            <div className="mood-options">
              {moodOptions.map((mood) => (
                <button
                  key={mood.label}
                  className={`mood-btn ${
                    selectedMood === mood.label ? "selected" : ""
                  }`}
                  onClick={() => handleMoodClick(mood)}
                >
                  {mood.emoji}
                </button>
              ))}
            </div>
            <textarea
              className="mood-selector-textarea"
              placeholder="Write your thoughts..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={20}
            />
            <button onClick={handleSave} className="save-btn">
              Save
            </button>
          </div>
          <div className="calender-section">
            <Calendar
              onChange={setDate}
              value={date}
              className="custom-calendar"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MoodSelectorPage;
