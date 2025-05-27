import { useEffect, useState } from "react"

const EmailTimer = ({ duration = 600 }) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [startTime] = useState(Date.now());

    useEffect(() => {
        const timer = setInterval(() => {
            const now = Date.now();
            const elapsed = Math.floor((now - startTime) / 1000);
            const remaining = duration - elapsed;
            
            if (remaining <= 0) {
                clearInterval(timer);
                setTimeLeft(0);
            } else {
                setTimeLeft(remaining);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);


    const formatTime = seconds => {
        const m = String(Math.floor(seconds / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${m}:${s}`;
    }

    return (
        <>
            <div>
                <span>{formatTime(timeLeft)}</span>
            </div>
        </>
    )
}

export default EmailTimer;