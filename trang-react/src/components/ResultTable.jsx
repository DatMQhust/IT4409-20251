function ResultTable({ student, results, courses }) {
  return (
    <div id="result">
      <h2>Thông tin sinh viên</h2>
      <p>Họ tên: {student.name}</p>
      <p>MSSV: {student.sid}</p>
      <p>Ngày sinh: {new Date(student.dob).toLocaleDateString("vi-VN")}</p>

      <h3>Kết quả học tập</h3>
      <table>
        <thead>
          <tr>
            <th>Mã học phần</th>
            <th>Tên học phần</th>
            <th>Số tín chỉ</th>
            <th>Học kỳ</th>
            <th>Điểm số</th>
            <th>Điểm chữ</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => {
            const c = courses.find((x) => x.cid === r.cid);
            return (
              <tr key={r.cid + r.term}>
                <td>{c.cid}</td>
                <td>{c.name}</td>
                <td>{c.credits}</td>
                <td>{r.term}</td>
                <td>{r.score}</td>
                <td>{r.scoreInAplat}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ResultTable;
