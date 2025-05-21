package com.example.skip.util;

import com.example.skip.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
@RequiredArgsConstructor
public class FileUploadUtil {

    private final FileService fileService;

    //파일 수정시 새로운파일 반환하거나, 파일이 없으면 기존 파일 반환하는 메소드
    public String uploadFileAndUpdateUrl(MultipartFile file, String currentFile, String directory){
        if(file !=null && !file.isEmpty()){  //새로운 파일이 있을경우
            return fileService.uploadFile(file,directory);
        }

        //파일이 없으면 기존 파일 그대로 반환
        return currentFile;
    }
}
