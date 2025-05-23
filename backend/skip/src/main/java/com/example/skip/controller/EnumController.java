package com.example.skip.controller;

import com.example.skip.enumeration.ItemCategory;
import com.example.skip.enumeration.RentCategory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/api/enums")
@CrossOrigin(origins = "http://localhost:5173")
public class EnumController {

    @GetMapping("/rentCategory")
    public ResponseEntity<List<Map<String,String>>> getRentCategory(){
        //enum값 배열로 가져오기
        RentCategory[] categoryNames = RentCategory.values();

        //리스트로 만들기
        List<Map<String,String>> list = new ArrayList<>();
        for(RentCategory category: categoryNames){
            // {"code": "SKI", "label": "스키"} 로 변환
            Map<String,String> map = new HashMap<>();
            map.put("code",category.name());
            map.put("label",category.getDisplayName());

            //리스트에 추가
            list.add(map);
        }
        System.out.println("rent-categoryList===> "+ list);

        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("/itemCategory")
    public ResponseEntity<List<Map<String,String>>> getItemCategory() {
        //enum값 배열로 가져오기
        ItemCategory[] categoryNames = ItemCategory.values();

        //리스트로 만들기
        List<Map<String, String>> list = new ArrayList<>();
        for (ItemCategory category : categoryNames) {
            Map<String, String> map = new HashMap<>();
            map.put("code", category.name());
            map.put("label", category.getDisplayName());

            //리스트에 추가
            list.add(map);
        }
        System.out.println("Item-categoryList===> " + list);

        return new ResponseEntity<>(list, HttpStatus.OK);
    }
}
