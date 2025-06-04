const DateInput = ({ startDate, setStartDate, endDate, setEndDate }) => {
   return (
    <div className="date-input-group">
        <div className="date-item">
            <label>시작 날짜</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
        </div>
        <div className="date-item">
            <label>종료 날짜</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
    </div>  
  );
};

export default DateInput;