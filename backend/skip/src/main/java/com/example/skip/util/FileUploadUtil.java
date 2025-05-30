package com.example.skip.util;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
@RequiredArgsConstructor
public class FileUploadUtil {

    private final FileUtil fileUtil;

    //파일 수정 시 새로운 파일을 반환하거나, 파일이 없으면 기존 파일을 반환하는 메소드
    public String uploadFileAndUpdateUrl(MultipartFile file, String currentFile, String directory){
        if(file != null && !file.isEmpty()){  //새로운 파일이 있을 경우
            // 기존 파일이 있으면 삭제
            if (currentFile != null && !currentFile.isEmpty() && !"undefined".equalsIgnoreCase(currentFile)) {
                try {
                    System.out.println("기존파일 ===============> "+currentFile);
                    fileUtil.deleteFile(currentFile);  // 기존 파일 삭제
                } catch (Exception e) {
                    e.printStackTrace();  // 파일 삭제 실패 시 로그에 기록
                }
            }
            // 새로운 파일 업로드
            return fileUtil.uploadFile(file, directory);
        }

        // 파일이 없으면 기존 파일 그대로 반환
        return currentFile;
    }

}
