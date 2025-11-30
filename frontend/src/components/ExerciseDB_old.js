import React, { useState } from "react";
import axios from "axios";
import "./ExerciseDB.css";

const ExercisePage = () => {
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [exercises, setExercises] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [exercisesPerPage] = useState(10);

  const handleMuscleChange = (e) => {
    setSelectedMuscle(e.target.value);
  };

  const handleSearch = async () => {
    if (!selectedMuscle) {
      alert("Please select a muscle group");
      return;
    }

    try {
      // Fetch all exercises and filter by category
      let allExercises = [];
      let url = `https://wger.de/api/v2/exercise/?limit=100`;
      let hasMore = true;
      
      while (hasMore) {
        const response = await axios.get(url);
        allExercises = [...allExercises, ...response.data.results];
        
        if (response.data.next) {
          url = response.data.next;
        } else {
          hasMore = false;
        }
      }
      
      // Filter by selected category
      const filtered = allExercises.filter(ex => ex.category == selectedMuscle);
      
      if (filtered.length === 0) {
        alert("No exercises found for this category");
        setExercises([]);
        return;
      }
      
      console.log(`Found ${filtered.length} exercises for category ${selectedMuscle}`);
      setExercises(filtered);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching exercises:", error.message);
      alert("Failed to fetch exercises: " + error.message);
    }
  };

  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = exercises.slice(
    indexOfFirstExercise,
    indexOfLastExercise
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div>
        <h2>Search For A Perfect Exercise</h2>
      <div className="select-container">
        <select value={selectedMuscle} onChange={handleMuscleChange}>
          <option value="">Select A Category</option>
          <option value="1">Abs</option>
          <option value="2">Arms</option>
          <option value="3">Back</option>
          <option value="4">Calves</option>
          <option value="5">Chest</option>
          <option value="6">Glutes</option>
          <option value="7">Legs</option>
          <option value="8">Shoulders</option>
          <option value="9">Cardio</option>
          <option value="10">Stretching</option>
        </select>
        <button onClick={handleSearch} className="mx-3">Search</button>
      </div>
      {currentExercises.length > 0 ? (
        <div className="exercise-container">
          {currentExercises.map((exercise, index) => (
            <div key={exercise.id || index} className="exercise-card">
              <h3>Exercise #{exercise.id}</h3>
              <div className="gif-container">
                <div className="exercise-placeholder">
                  <p><strong>ID:</strong> {exercise.id}</p>
                  <p><strong>Category:</strong> {exercise.category}</p>
                  <p><strong>Equipment:</strong> {exercise.equipment?.length || 0}</p>
                  <p><strong>Muscles:</strong> {exercise.muscles?.length || 0}</p>
                </div>
              </div>
            </div>
        ))}
        </div>
      ) : (
        <h3>Exercises and demonstrations will be displayed here.</h3>
      )}
      {exercises.length > exercisesPerPage && (
        <div className="pagination">
          {Array.from({
            length: Math.ceil(exercises.length / exercisesPerPage),
          }).map((_, index) => (
            <button key={index} onClick={() => paginate(index + 1)}>
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExercisePage;