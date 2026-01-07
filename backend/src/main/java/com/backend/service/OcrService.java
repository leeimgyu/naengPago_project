package com.backend.service;

import com.backend.dto.Ingredient;
import com.backend.dto.ReceiptOcrResult;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

public interface OcrService {

  Mono<ReceiptOcrResult> performOcr(MultipartFile imageFile);
  ReceiptOcrResult buildReceiptOcrResult(List<Ingredient> ingredients);

}
