import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import '../../css/rentInsertForm.css';

const ItemInsertForm=()=>{

    const {rentId} = useParams;

    const [categories, setCategories]=useState([]);
    const [formData, setFormData]=useState({
        //초기값 세팅해주기
        rentId:rentId,
        name:"",
        size:"",
        totalQuantity:"",
        stockQuantity:"",
        category:"",
        rentHour:"",
        price:""
    });


    const fileRef = useRef();

    useEffect(()=>{
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/enums/itemCategory');
                console.log("카테고리 데이터: ", response.data);
                setCategories(response.data);
            } catch (error) {
                console.error("카테고리 불러오기 실패==>", error);
                setCategories([]);
            }
        };

        fetchCategories();
    },[]);


    const handleChange=(e)=>{
        const {name,value} = e.target;

        setFormData({
            ...formData,
            [name] : value
        })
    }


    const handleSubmit=()=>{

    }

    return(
        <div className="form-container">
            <h1>장비 등록</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input type="hidden" id="rentId" name="rentId" value={formData.rentId} />

                <div className="form-group">
                    <label htmlFor="category">카테고리</label>
                    <select name="category" id="category" value={formData.category} onChange={handleChange}>
                        <option value="">카테고리를 선택하세요</option>
                        {
                            categories.map((cat,index) => (
                                <option key={index} value={cat.code}>
                                {cat.label}
                                </option>
                            ))
                        }
                    </select>
                </div>
            
                <div className="form-group">
                    <label htmlFor="name">장비명</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="일반의류 or 고급의류" required />
                </div>

                <div className="form-group">
                    <label htmlFor="image1">이미지</label>
                    <input type="file" id="image" name="image" ref={fileRef} accept="image/*" />
                </div>

                {/* select으로 하기 */}
                <div className="form-group">
                    <label htmlFor="size">사이즈</label>
                    <select>
                        <option>

                        </option> 
                    </select>
                    <input type="text" id="size" name="size" value={formData.name} onChange={handleChange} placeholder="S / M / S" required />
                </div>

                <div className="form-group">
                    <label htmlFor="totalQuantity">총 장비 수량</label>
                    <input type="number" id="totalQuantity" name="totalQuantity" value={formData.totalQuantity} onChange={handleChange} placeholder="숫자만 입력하세요" required />
                </div>

                {/* select으로 하기 */}
                <div className="form-group">
                    <label htmlFor="totalQuantity">대여시간</label>
                    <select>
                        <option>

                        </option>
                    </select>
                    {/* <input type="number" id="totalQuantity" name="totalQuantity" value={formData.totalQuantity} onChange={handleChange} placeholder="숫자만 입력하세요" required /> */}
                </div>
                
                <div className="form-group">
                    <label htmlFor="price">가격</label>
                    <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} placeholder="숫자만 입력하세요" required />
                </div>
                

                <button type="submit">등록</button>

            </form>

        </div>
    )
}
export default ItemInsertForm;