import { useParams } from "react-router-dom";
import QnaWrite from "../components/qna/QnaWrite";

const QnaPopupPage = ({ mode = "write" }) => {
  const params = useParams();
  return(
    <main>
      <QnaWrite mode={mode} 
                itemId={params.itemId}
                qnaId={params.qnaId}
      />
    </main>
  )
}
export default QnaPopupPage;