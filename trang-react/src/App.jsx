import { useState, useEffect } from "react";
import SearchForm from "./components/SearchForm";
import ResultTable from "./components/ResultTable";
import LoadingIndicator from "./components/LoadingIndicator";
import "./App.css";

function App() {
  const [studentId, setStudentId] = useState("");
  const [student, setStudent] = useState(null);
  const [results, setResults] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = (id) => {
    setStudentId(id.trim());
  };

  useEffect(() => {
    if (!studentId) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      setStudent(null);
      setResults([]);
      setCourses([]);

      try {
        const svRes = await fetch("/sinhvien.json");
        const svData = await svRes.json();

        const hpRes = await fetch("/hocphan.json");
        const hpData = await hpRes.json();

        const kqRes = await fetch("/ketqua.json");
        const kqData = await kqRes.json();

        const student = svData.find((sv) => sv.sid === studentId);
        if (!student) throw new Error("Không tìm thấy sinh viên");

        const resultList = kqData.filter((kq) => kq.sid === studentId);
        if (resultList.length === 0)
          throw new Error("Không có kết quả học tập");

        const usedCourseIds = [...new Set(resultList.map((r) => r.cid))];
        const courseList = hpData.filter((hp) =>
          usedCourseIds.includes(hp.cid)
        );

        await new Promise((resolve) => setTimeout(resolve, 5000));

        setStudent(student);
        setResults(resultList);
        setCourses(courseList);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  return (
    <div className="container">
      <h1>Trang tra cứu kết quả học tập</h1>

      <SearchForm onSearch={handleSearch} />

      {isLoading && <LoadingIndicator />}
      {error && <p className="error">Lỗi: {error}</p>}

      {student && (
        <ResultTable student={student} results={results} courses={courses} />
      )}
    </div>
  );
}

export default App;
