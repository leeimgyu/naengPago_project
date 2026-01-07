package com.backend.service.impl;

import com.backend.client.OcrClient;
import com.backend.dto.Ingredient;
import com.backend.dto.ReceiptOcrResult;
import com.backend.service.OcrService;
import java.util.Collections;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@RequiredArgsConstructor
public class OcrServiceImpl implements OcrService {

  private final OcrClient ocrClient;

  @Override
  public Mono<ReceiptOcrResult> performOcr(MultipartFile imageFile) {
    return ocrClient.analyzeReceiptImage(imageFile)
        .map(this::buildReceiptOcrResult)
        .onErrorResume(e -> {
          log.error("Error during OCR processing: ", e.getMessage());
          return Mono.just(buildReceiptOcrResult(Collections.emptyList()));
        });
  }

  @Override
  public ReceiptOcrResult buildReceiptOcrResult(List<Ingredient> ingredients) {
    if (ingredients == null) {
      ingredients = Collections.emptyList();
    }
    return ReceiptOcrResult.builder()
        .ingredients(ingredients)
        // The new flow does not populate these fields, so we set them to empty or null.
        .products(Collections.emptyList())
        .boundingBoxes(Collections.emptyList())
        .extractedText(null)
        .totalPaymentPrice(null)
        .build();
  }
}
