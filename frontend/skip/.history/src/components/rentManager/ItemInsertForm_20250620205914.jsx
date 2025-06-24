import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useCategoryOptions from "../../hooks/useCategoryOptions";
import '../../css/itemInsertForm.css';
import caxios from "../../api/caxios";
import { useSelector } from "react-redux";
import { rentIdAndNameApi, rentNameApi } from "../../api/rentListApi";

const ItemInsertForm = () => {
  const { rentId: rentIdParam } = useParams();
  const { userId } = useSelector((state) => state.loginSlice);
  const [rentShops, setRentShops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    rentId: rentIdParam || "",
    name: "",
    category: "",
  });
  const [timePrices, setTimePrices] = useState([{ rentHour: "", price: "" }]);
  const [commonSizeStocks, setCommonSizeStocks] = useState([{ size: "", quantity: "" }]);
  const fileRef = useRef();
  const [selectedShopName, setSelectedShopName] = useState("");
  const selectedOptions = useCategoryOptions(formData.category);

  useEffect(() => {
    if (rentIdParam) {
      rentNameApi(rentIdParam)
        .then(name => setSelectedShopName(name))
        .catch(err => {
          console.error("렌탈샵 이름 조회 실패", err);
          setSelectedShopName("이름 불러오기 실패");
        });
    } else {
      rentIdAndNameApi(userId)
        .then(data => setRentShops(data))
        .catch(err => {
          console.error("렌탈샵 목록 불러오기 실패", err);
          setRentShops([]);
        });
    }
  }, [rentIdParam, userId]);

  useEffect(() => {
    caxios.get("/api/enums/itemCategory")
      .then(res => setCategories(res.data))
      .catch(err => {
        console.error("카테고리 불러오기 실패", err);
        setCategories([]);
      });
  }, []);

  const handleFormChange = e => {
    const { name, value } = e.target;

    // 카테고리 변경 감지
    if (name === "category" && value === "LIFT_TICKET") {
      // LIFT_TICKET이면 timePrices, commonSizeStocks를 1개로 맞춤
      setTimePrices(current => current.slice(0, 1));
      setCommonSizeStocks(current => current.slice(0, 1));
    }

    setFormData(data => ({ ...data, [name]: value }));
  };

  const handleTimePriceChange = (idx, e) => {
    const { name, value } = e.target;
    setTimePrices(list => {
      const copy = [...list];
      copy[idx][name] = value;
      return copy;
    });
  };
  const addTimePrice = () => setTimePrices(list => [...list, { rentHour: "", price: "" }]);
  const removeTimePrice = idx => setTimePrices(list => list.filter((_, i) => i !== idx));

  const handleSizeStockChange = (idx, field, val) => {
    setCommonSizeStocks(list => {
      const copy = [...list];
      copy[idx][field] = val;
      return copy;
    });
  };
  const addSizeStock = () => setCommonSizeStocks(list => [...list, { size: "", quantity: "" }]);
  const removeSizeStock = idx => setCommonSizeStocks(list => list.filter((_, i) => i !== idx));

  const handleSubmit = e => {
    e.preventDefault();

     // LIFT_TICKET이면 강제로 1개로 맞추기
    if (formData.category === "LIFT_TICKET") {
      if (timePrices.length > 1) setTimePrices(timePrices.slice(0, 1));
      if (commonSizeStocks.length > 1) setCommonSizeStocks(commonSizeStocks.slice(0, 1));
    }

    if (!formData.rentId) {
      alert("렌탈샵을 선택해주세요.");
      return;
    }
    if (!formData.name || !formData.category) {
      alert("장비명과 카테고리를 입력하세요.");
      return;
    }
    const imageInput = fileRef.current;
    if (!imageInput || imageInput.files.length === 0) {
      alert("이미지는 필수입니다.");
      return;
    }
    if (timePrices.some(tp => !tp.rentHour || !tp.price)) {
      alert("모든 대여 시간/가격 정보를 입력하세요.");
      return;
    }
    if (formData.category !== "LIFT_TICKET" && commonSizeStocks.some(s => !s.size || !s.quantity)) {
      alert("모든 사이즈/수량 정보를 입력하세요.");
      return;
    }

    const details = timePrices.map(tp => ({
      rentHour: tp.rentHour,
      price: tp.price,
      sizeStockList: commonSizeStocks.map(s => {
        const q = Math.max(0, parseInt(s.quantity) || 0);
        return { size: s.size, totalQuantity: q, stockQuantity: q };
      })
    }));

    const requestDTO = {
      ...formData,
      detailList: details
    };

    const submitData = new FormData();
    submitData.append("itemRequest", new Blob([JSON.stringify(requestDTO)], { type: "application/json" }));
    submitData.append("image", fileRef.current.files[0]);

    caxios.post("/api/items", submitData, {
      headers: { "Content-Type": "multipart/form-data" }
    }).then(res => {
      alert("장비 등록 완료!");
      setFormData({ rentId: rentIdParam || "", name: "", category: "" });
      setTimePrices([{ rentHour: "", price: "" }]);
      setCommonSizeStocks([{ size: "", quantity: "" }]);
      fileRef.current.value = null;
    }).catch(err => {
      console.error("장비등록 실패", err);
      alert("장비등록에 실패했습니다.");
    });
  };

  return (
    <div className="item-detail-wrapper">
      <div className="top-subject">장비 등록</div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label><span className="required-asterisk">*</span>상호명</label>
          {rentIdParam ? (
            <select name="rentId" value={formData.rentId} disabled>
              <option value={formData.rentId}>{selectedShopName}</option>
            </select>
          ) : (
            <select name="rentId" value={formData.rentId} onChange={handleFormChange} required>
              <option value="">렌탈샵 선택</option>
              {rentShops.map(s => (
                <option key={s.rentId} value={s.rentId}>{s.name}</option>
              ))}
            </select>
          )}
        </div>
        <div className="form-group">
          <label><span className="required-asterisk">*</span>카테고리</label>
          <select name="category" value={formData.category} onChange={handleFormChange} required>
            <option value="">카테고리를 선택하세요</option>
            {categories.map(c => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label><span className="required-asterisk">*</span>장비명</label>
          <input type="text" name="name" value={formData.name} onChange={handleFormChange} placeholder="장비명" required />
        </div>
        <div className="form-group">
          <label><span className="required-asterisk">*</span>이미지</label>
          <input type="file" ref={fileRef} accept="image/*" required />
        </div>
        <div className="sub-subject">대여 옵션</div>
        {timePrices.map((tp, i) => (
          <div key={i} className="form-inline-row">
            <select name="rentHour" value={tp.rentHour} onChange={e => handleTimePriceChange(i, e)}>
              <option value="">시간 선택</option>
              {selectedOptions.hours.map(h => (
                <option key={h} value={h}>{h === 8760 ? "1년" : `${h}시간`}</option>
              ))}
            </select>
            <input type="number" name="price" value={tp.price} onChange={e => handleTimePriceChange(i, e)} placeholder="가격" />
            <button type="button" className="item-delete-btn" onClick={() => removeTimePrice(i)} disabled={formData.category === "LIFT_TICKET"}>삭제</button>
          </div>
        ))}
        <button type="button" className="item-add-btn" onClick={addTimePrice} disabled={formData.category === "LIFT_TICKET"}>+ 시간 추가</button>
        <div className="sub-subject">사이즈 / 수량</div>
        <table className="item-table">
          <thead className="item-insert-thead">
            <tr><th>사이즈</th><th>수량</th><th>삭제</th></tr>
          </thead>
          <tbody className="item-insert-tbody">
            {commonSizeStocks.map((s, i) => (
              <tr key={i}>
                <td>
                  <select value={s.size} onChange={e => handleSizeStockChange(i, "size", e.target.value)}>
                    <option value="">사이즈 선택</option>
                    {selectedOptions.sizes.map(sz => (
                      <option key={sz} value={sz}>{sz}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <input type="number" value={s.quantity} onChange={e => handleSizeStockChange(i, "quantity", e.target.value)} required />
                </td>
                <td>
                  <button type="button" className="item-delete-btn" onClick={() => removeSizeStock(i)} disabled={formData.category === "LIFT_TICKET"}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="item-size-add-btn" onClick={addSizeStock} disabled={formData.category === "LIFT_TICKET"}>+ 사이즈 추가</button>
        <div className->
          <button type="submit" className="item-insert-btn">장비 등록</button>
        </div>
      </form>
    </div>
  );
};

export default ItemInsertForm;
