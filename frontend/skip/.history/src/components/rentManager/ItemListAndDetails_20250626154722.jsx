import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { rentIdAndNameApi, rentDetailApi } from "../../api/rentListApi";
import '../../css/itemList.css';
import caxios from "../../api/caxios";
import useCategoryOptions from "../../hooks/useCategoryOptions";
import { formatRentHour } from "../../utils/formatRentHour";
import { MousePointerClick } from "lucide-react";

const ItemListAndDetails = () => {
  const profile = useSelector(state => state.loginSlice);
  const navigate = useNavigate();

  const [rentShops, setRentShops] = useState([]);
  const [selectedRentId, setSelectedRentId] = useState(null);

  const [items, setItems] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [checkedDetails, setCheckedDetails] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalItemId, setModalItemId] = useState(null);
  const [modalItemCategory, setModalItemCategory] = useState(null);
  const { sizes, hours } = useCategoryOptions(modalItemCategory);

  const [newOptions, setNewOptions] = useState([{ rentHour: '', price: '' }]);
  const [sizeStockInputs, setSizeStockInputs] = useState({});

  const fetchCategoryMap = async () => {
    try {
      const res = await caxios.get("/api/enums/itemCategory");
      const map = {};
      res.data.forEach(c => map[c.code] = c.label);
      setCategoryMap(map);
    } catch (err) {
      console.error("카테고리 매핑 불러오기 실패", err);
    }
  };

  const fetchItems = () => {
    if (!selectedRentId) return;
    caxios.get(`/api/items/list/${selectedRentId}`)
      .then(res => {
        setItems(res.data);
        setCheckedDetails(new Set());
      })
      .catch(err => console.error("장비 목록 불러오기 실패", err));
  };

  useEffect(() => {
    if (profile.userId) {
      rentIdAndNameApi(profile.userId)
        .then(data => {
          setRentShops(data);
          if (data.length > 0) setSelectedRentId(data[0].rentId);
        })
        .catch(err => console.error("렌탈샵 목록 불러오기 실패", err));
    }
  }, [profile.userId]);

  useEffect(() => {
    if (selectedRentId) {
      fetchCategoryMap();
      fetchItems();
    }
  }, [selectedRentId]);

  const toggleCheck = (itemId, itemDetailId) => {
    const key = `${itemId}_${itemDetailId}`;
    setCheckedDetails(prev => {
      const newSet = new Set(prev);
      newSet.has(key) ? newSet.delete(key) : newSet.add(key);
      return newSet;
    });
  };

  const toggleAllCheck = (itemId, detailList=[]) => {
    setCheckedDetails(prev => {
      const newSet = new Set(prev);
      const allKeys = detailList.map(d => `${itemId}_${d.itemDetailId}`);
      if (allKeys.every(k => newSet.has(k))) {
        allKeys.forEach(k => newSet.delete(k));
      } else {
        allKeys.forEach(k => newSet.add(k));
      }
      return newSet;
    });
  };

  const deleteSelectedDetails = async () => {
    const count = checkedDetails.size;
    if (count === 0) return alert("삭제할 항목 선택하세요.");
    if (!window.confirm(`${count}개의 항목을 삭제하시겠습니까?`)) return;

    const payload = Array.from(checkedDetails).map(k => {
      const [itemId, itemDetailId] = k.split("_");
      return { itemId: +itemId, itemDetailId: +itemDetailId };
    });

    try {
      await caxios.patch("/api/items/delete", payload);
      alert("삭제 완료");
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("삭제 실패");
    }
  };

  // 모달 핸들러
  const openModal = (itemId, category) => {
    setModalItemId(itemId);
    setModalItemCategory(category);
    setNewOptions([{ rentHour: '', price: '' }]);
    setSizeStockInputs({});
    setIsModalOpen(true);
  };
  const closeModal = () => { setIsModalOpen(false); setModalItemId(null); setModalItemCategory(null); };

  const handleOptionChange = (idx, field, value) => {
    setNewOptions(prev => {
      const arr = [...prev];
      arr[idx][field] = value;
      return arr;
    });
  };

  const addEmptyTimePriceOption = () => {
    const base = newOptions[0];
    if (!base.rentHour || !base.price) return alert("시간/가격 입력해주세요");
    setNewOptions(prev => [{ rentHour: '', price: '' }, ...prev]);
  };

  const handleSizeStockChange = (size, field, value) => {
    setSizeStockInputs(prev => ({
      ...prev,
      [size]: { ...prev[size], [field]: value }
    }));
  };

  const handleModalSave = async () => {
    for (const o of newOptions) {
      if (!o.rentHour || !o.price) return alert("모든 옵션 입력해주세요");
    }
    let sizeStocks = Object.entries(sizeStockInputs)
      .filter(([k]) => k !== "selectedSize")
      .map(([size, stock]) => ({
        size: modalItemCategory === "LIFT_TICKET" ? null : size,
        totalQuantity: Number(stock.totalQuantity || 0),
        stockQuantity: Number(stock.stockQuantity || 0)
      }));
    for (const s of sizeStocks) {
      if (s.totalQuantity < s.stockQuantity) {
        return alert(`${s.size}: 총수량 < 재고수량 불가`);
      }
    }

    try {
      for (const o of newOptions) {
        await caxios.post(`/api/items/optionAdd/${modalItemId}`, {
          rentHour: Number(o.rentHour),
          price: Number(o.price),
          sizeStocks
        });
      }
      alert("옵션 저장 완료");
      closeModal();
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("옵션 저장 실패");
    }
  };

  const goToUpdate = (itemId) => {
    navigate(`/rentAdmin/item/update/${selectedRentId}/${itemId}`);
  };


  return (
    <div className="item-list-container">
      <h1 className="top-subject">장비 목록</h1>

      {/* 렌탈샵 드롭다운 */}
      {rentShops.length > 0 && (
        <div className="mb-4">
          <label htmlFor="rent-select" className="mr-2 font-semibold">가맹점 선택:</label>
          <select
            id="rent-select"
            className="border px-3 py-1 rounded"
            value={selectedRentId || ''}
            onChange={e => setSelectedRentId(Number(e.target.value))}
          >
            {rentShops.map(s => (
              <option key={s.rentId} value={s.rentId}>{s.name}</option>
            ))}
          </select>
        </div>
        )}

      {/* 카테고리 필터 */}
      {Object.keys(categoryMap).length > 0 && (
        <div className="category-buttons">
          <button
            className={`category-selected ${selectedCategory === null ? 'active' : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            전체보기
          </button>
          {Object.entries(categoryMap).map(([code, label]) => (
            <button
              key={code}
              className={`category-selected ${selectedCategory === code ? 'active' : ''}`}
              onClick={() => setSelectedCategory(code)}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      

      {/* 장비 목록 */}
      {(() => {
        // 조건에 따라 필터링
        const filteredItems = items.filter(i => !selectedCategory || i.category === selectedCategory);

        // 렌탈샵 없거나, 전체 장비가 비어 있거나, 필터된 장비가 비어 있으면 메시지 출력
        if (rentShops.length === 0 || items.length === 0 || filteredItems.length === 0) {
          return (
            <div className="sub-subject">
              <h2>등록된 장비가 없습니다.</h2>
            </div>
          );
        }
        
        // {(items.filter(i => !selectedCategory || i.category === selectedCategory)).map(item => (
        return filteredItems.map(item => (
          <div key={item.itemId} className="item-card">
            <h2 className="bottom-subject2">{item.name}</h2>
            <span>카테고리:</span> {categoryMap[item.category]}
            <img src={`${__APP_BASE__}${item.image}`} width="150" />
            <img src=item.image} width="150" />

            <ul className="button-list">
              <li><button onClick={() => openModal(item.itemId, item.category)} className="itemlist-add-option-btn">옵션 추가</button></li>
              <li><button onClick={() => goToUpdate(item.itemId)} className="itemlist-update-btn">수정</button></li>
              <li><button onClick={deleteSelectedDetails} className="itemlist-delete-selected-btn">선택 항목 삭제</button></li>
            </ul>

            <h4 className="bottom-subject4">상세 정보:</h4>
            <table className="table-list">
              <thead>
                <tr>
                  <th><button onClick={() => toggleAllCheck(item.itemId, item.detailList)} className="itemlist-all-selected-btn"><MousePointerClick /></button></th>
                  <th>시간</th><th>가격</th><th>사이즈</th><th>총수량</th><th>재고수량</th>
                </tr>
              </thead>
              <tbody>
                {(item.detailList ?? []).map(d => {
                  const key = `${item.itemId}_${d.itemDetailId}`;
                  return (
                    <tr key={key}>
                      <td>
                        <input
                          type="checkbox"
                          checked={checkedDetails.has(key)}
                          onChange={() => toggleCheck(item.itemId, d.itemDetailId)}
                        />
                      </td>
                      <td>{formatRentHour(d.rentHour)}</td>
                      <td>{d.price}원</td>
                      <td>{d.size}</td>
                      <td>{d.totalQuantity}</td>
                      <td>{d.stockQuantity}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))
      })()}

      {/* 등록 버튼 */}
      {rentShops.length > 0 ? (
        <div className="move-item">
          <button
            className="register-link"
            onClick={() => navigate(`/rentAdmin/item/insert/${selectedRentId}?category=${selectedCategory || ''}`)}
          >
            장비 추가하러 가기
          </button>
        </div>
        ) : (
        <div className="sub-subject">
          <h2>렌탈샵을 먼저 등록해주세요.</h2>
        </div>
      )}

      {/* 옵션 추가 모달 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-subject">옵션 추가</h2>

            {/* 시간/가격 조합 추가 */}
            <div className="modal-option-row">
              <div className="form-group">
                <label>시간 선택</label>
                <select
                  className="modal-hour-select"
                  value={newOptions[0].rentHour}
                  onChange={e => handleOptionChange(0, 'rentHour', e.target.value)}
                >
                  <option value="">시간 선택</option>
                  {hours.map(h => (
                    <option key={h} value={h}>{h}시간</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>가격</label>
                <input 
                  type="number" 
                  className="modal-price-input"
                  placeholder="가격을 입력하세요"
                  value={newOptions[0].price}
                  onChange={e => handleOptionChange(0, 'price', e.target.value)}
                />
              </div>

              <div className="form-group">
                <button
                  type="button"
                  onClick={addEmptyTimePriceOption}
                  disabled={modalItemCategory === "LIFT_TICKET"}
                  className="itemlist-modal-add-btn"
                >
                  옵션 추가
                </button>
              </div>
            </div>

            {/* 추가 옵션 리스트 */}
            {newOptions.length > 1 && (
              <div className="form-group">
                <label>추가된 옵션</label>
                <ul className="modal-optlist-ul"> 
                  {newOptions.slice(1).map((opt, idx) => (
                    <li key={idx} className="modal-optlist-li">
                      <span>{opt.rentHour}시간 - {opt.price}원</span>
                      <button 
                        onClick={() => setNewOptions(prev => prev.filter((_, i) => i !== idx + 1))}
                        disabled={modalItemCategory === "LIFT_TICKET"} 
                        className="itemlist-modal-del-btn"
                      >
                        삭제
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 사이즈/재고 입력 */}
            <div className="form-group">
              <label>사이즈 및 재고 관리</label>
              <table className="modal-opt-table">
                <thead className="modal-itemlist-thead">
                  <tr>
                    <th>사이즈</th>
                    <th>총수량</th>
                    <th>재고수량</th>
                  </tr>
                </thead>
                <tbody className="modal-itemlist-tbody">
                  <tr>
                    <td>
                      <select 
                        className="modal-size-select"
                        value={sizeStockInputs.selectedSize || ''}
                        onChange={e =>
                          setSizeStockInputs(prev => ({
                            ...prev,
                            selectedSize: e.target.value,
                            [e.target.value]: prev[e.target.value] || { totalQuantity: '', stockQuantity: '' }
                          }))
                        }
                      >
                        <option value="">사이즈 선택</option>
                        {sizes.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>
                      <input 
                        type="number" 
                        className="modal-totalqty-input"
                        placeholder="총수량"
                        value={sizeStockInputs[sizeStockInputs.selectedSize]?.totalQuantity || ''}
                        onChange={e => handleSizeStockChange(sizeStockInputs.selectedSize, 'totalQuantity', e.target.value)}
                        disabled={modalItemCategory !== "LIFT_TICKET" && !sizeStockInputs.selectedSize}
                      />
                    </td>
                    <td>
                      <input 
                        type="number" 
                        className="modal-stockqty-input"
                        placeholder="재고수량"
                        value={sizeStockInputs[sizeStockInputs.selectedSize]?.stockQuantity || ''}
                        onChange={e => handleSizeStockChange(sizeStockInputs.selectedSize, 'stockQuantity', e.target.value)}
                        disabled={modalItemCategory !== "LIFT_TICKET" && !sizeStockInputs.selectedSize}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="modal-actions">
              <button onClick={handleModalSave} className="option-save-btn">저장</button>
              <button onClick={closeModal} className="option-cancel-btn">취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemListAndDetails;
