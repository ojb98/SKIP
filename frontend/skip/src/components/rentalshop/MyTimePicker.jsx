import { useEffect, useRef, useState } from "react";

const MyTimePicker = ({ setStartTime, startTime }) => {
  const [hour, setHour] = useState(null);
  const [minute, setMinute] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [displayedTime, setDisplayedTime] = useState(null);

  const pickerRef = useRef(null);

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  const minutes = ["00", "30"];

  const handleSelectToggle = () => {
    setShowPicker((prev) => !prev);
    setHour(null);                  
    setMinute(null);
  };

  // 시 선택 핸들러
  const handleHourChange = (e) => {
    const selectedHour = e.target.value;
    setHour(selectedHour);

    if (selectedHour !== "" && minute !== null) {
      const newTime = `${selectedHour}:${minute}`;
      setDisplayedTime(newTime);
      setStartTime(newTime);
      setShowPicker(false);
    }
  };

  // 분 선택 핸들러
  const handleMinuteChange = (e) => {
    const selectedMinute = e.target.value;
    setMinute(selectedMinute);

    if (hour !== null && selectedMinute !== "") {
      const newTime = `${hour}:${selectedMinute}`;
      setDisplayedTime(newTime);
      setStartTime(newTime);
      setShowPicker(false);
    }
  };

  const formattedTime = displayedTime || "대여 시간을 선택해주세요.";

  // 초기화
  useEffect(() => {
    if (startTime === "") {
      setDisplayedTime(null);
      setHour(null);
      setMinute(null);
    }
  }, [startTime]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  return(
    <div ref={pickerRef}>
      <button onClick={handleSelectToggle} className="w-[100%] text-left pl-[5px]">
        {formattedTime}
      </button>

      {showPicker && (
        <div className="flex gap-2.5 mt-2.5 p-2.5 bg-white border border-gray-300 rounded-[6px]">
          {/* 시 선택 */}
          <div className="flex-1 flex items-center gap-2.5">
            <label>시</label>
            <select
              value={hour ?? ""}
              onChange={handleHourChange}
              className="text-[18px] overflow-y-scroll"
            >
              <option value="" disabled>--</option>
              {hours.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          {/* 분 선택 */}
          <div className="flex-1 flex items-center gap-2.5">
            <label>분</label>
            <select
              value={minute ?? ""}
              onChange={handleMinuteChange}
              className="text-[18px]"
            >
              <option value="" disabled>--</option>
              {minutes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTimePicker;