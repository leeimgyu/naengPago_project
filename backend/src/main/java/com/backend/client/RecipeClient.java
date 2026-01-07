package com.backend.client;

import com.backend.dto.recipeApi.RecipeResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class
RecipeClient {

    private final WebClient webClient;
    private final String apiKey;

    public RecipeClient(WebClient.Builder webClientBuilder, @Value("${recipe.api.base-url}") String baseUrl,  @Value("${recipe.api.key}") String apiKey) {
        this.webClient = webClientBuilder.baseUrl(baseUrl).build();
        this.apiKey = apiKey;
    }

  public Mono<RecipeResponse> fetchRecipes(int startIdx, int endIdx) {
    return webClient.get()
        .uri("/{apiKey}/COOKRCP01/json/{startIdx}/{endIdx}", apiKey, startIdx, endIdx)
        .retrieve()
        .bodyToMono(RecipeResponse.class);
  }

  public Mono<RecipeResponse> fetchRecipes(int startIdx, int endIdx, String RCP_NM) {
      RCP_NM = RCP_NM.replaceAll(" ", "");
      String recipe = "/RCP_NM=" + RCP_NM;
    return webClient.get()
        .uri("/{apiKey}/COOKRCP01/json/{startIdx}/{endIdx}" + recipe, apiKey, startIdx, endIdx)
        .retrieve()
        .bodyToMono(RecipeResponse.class);
  }

    public Mono<RecipeResponse> fetchRecipeBySeq(String rcpSeq) {
        String filter = "/RCP_SEQ=" + rcpSeq;
        return webClient.get()
            .uri("/{apiKey}/COOKRCP01/json/1/1" + filter, apiKey)
            .retrieve()
            .bodyToMono(RecipeResponse.class);
    }
}
