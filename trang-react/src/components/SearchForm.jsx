import { useState } from "react";

function SearchForm({ onSearch }) {
  const [inputId, setInputId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputId.trim()) {
      alert("Vui lòng nhập mã sinh viên");
      return;
    }
    onSearch(inputId);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <input
        type="text"
        value={inputId}
        placeholder="Nhập mã sinh viên..."
        onChange={(e) => setInputId(e.target.value)}
      />
      <button type="submit">Tra cứu</button>
    </form>
  );
}

export default SearchForm;
