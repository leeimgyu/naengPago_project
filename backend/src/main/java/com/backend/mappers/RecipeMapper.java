package com.backend.mappers;

import com.backend.dto.CookingStepDTO;
import com.backend.dto.RecipeRequestDTO;
import com.backend.dto.UnifiedRecipeDTO;
import com.backend.dto.recipeApi.RecipeApi;
import com.backend.entity.Recipes;
import com.backend.entity.User;
import lombok.extern.slf4j.Slf4j;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


@Slf4j
public class RecipeMapper {

  // RecipeRequestDTO를 Recipes 엔티티로 변환합니다.
  public static Recipes toEntity(RecipeRequestDTO requestDTO) {
    return Recipes.builder()
        .rcpNm(requestDTO.getRcpNm())
        .rcpWay2(requestDTO.getRcpWay2())
        .rcpPat2(requestDTO.getRcpPat2())
        .rcpPartsDtls(requestDTO.getRcpPartsDtls())
        .hashTag(requestDTO.getHashTag())
        .rcpNaTip(requestDTO.getRcpNaTip())
        .attFileNoMain(requestDTO.getAttFileNoMain())
        .attFileNoMk(requestDTO.getAttFileNoMk())
        .infoEng(requestDTO.getInfoEng())
        .infoCar(requestDTO.getInfoCar())
        .infoPro(requestDTO.getInfoPro())
        .infoFat(requestDTO.getInfoFat())
        .infoNa(requestDTO.getInfoNa())
        .infoWgt(requestDTO.getInfoWgt())
        .manual01(requestDTO.getManual01())
        .manual02(requestDTO.getManual02())
        .manual03(requestDTO.getManual03())
        .manual04(requestDTO.getManual04())
        .manual05(requestDTO.getManual05())
        .manual06(requestDTO.getManual06())
        .manual07(requestDTO.getManual07())
        .manual08(requestDTO.getManual08())
        .manual09(requestDTO.getManual09())
        .manual10(requestDTO.getManual10())
        .manual11(requestDTO.getManual11())
        .manual12(requestDTO.getManual12())
        .manual13(requestDTO.getManual13())
        .manual14(requestDTO.getManual14())
        .manual15(requestDTO.getManual15())
        .manual16(requestDTO.getManual16())
        .manual17(requestDTO.getManual17())
        .manual18(requestDTO.getManual18())
        .manual19(requestDTO.getManual19())
        .manual20(requestDTO.getManual20())
        .manualImg01(requestDTO.getManualImg01())
        .manualImg02(requestDTO.getManualImg02())
        .manualImg03(requestDTO.getManualImg03())
        .manualImg04(requestDTO.getManualImg04())
        .manualImg05(requestDTO.getManualImg05())
        .manualImg06(requestDTO.getManualImg06())
        .manualImg07(requestDTO.getManualImg07())
        .manualImg08(requestDTO.getManualImg08())
        .manualImg09(requestDTO.getManualImg09())
        .manualImg10(requestDTO.getManualImg10())
        .manualImg11(requestDTO.getManualImg11())
        .manualImg12(requestDTO.getManualImg12())
        .manualImg13(requestDTO.getManualImg13())
        .manualImg14(requestDTO.getManualImg14())
        .manualImg15(requestDTO.getManualImg15())
        .manualImg16(requestDTO.getManualImg16())
        .manualImg17(requestDTO.getManualImg17())
        .manualImg18(requestDTO.getManualImg18())
        .manualImg19(requestDTO.getManualImg19())
        .manualImg20(requestDTO.getManualImg20())
        .build();
  }

  // RecipeApi DTO를 Recipes 엔티티로 변환합니다. (OpenAPI 데이터용)
  public static Recipes toEntity(RecipeApi recipeApi) {
    return Recipes.builder()
        .rcpNm(recipeApi.getRcpNm())
        .rcpWay2(recipeApi.getRcpWay2())
        .rcpPat2(recipeApi.getRcpPat2())
        .rcpPartsDtls(recipeApi.getRcpPartsDtls())
        .hashTag(recipeApi.getHashTag())
        .rcpNaTip(recipeApi.getRcpNaTip())
        .attFileNoMain(recipeApi.getAttFileNoMain())
        .attFileNoMk(recipeApi.getAttFileNoMk())
        .infoEng(recipeApi.getInfoEng())
        .infoCar(recipeApi.getInfoCar())
        .infoPro(recipeApi.getInfoPro())
        .infoFat(recipeApi.getInfoFat())
        .infoNa(recipeApi.getInfoNa())
        .infoWgt(recipeApi.getInfoWgt())
        .manual01(recipeApi.getManual01())
        .manual02(recipeApi.getManual02())
        .manual03(recipeApi.getManual03())
        .manual04(recipeApi.getManual04())
        .manual05(recipeApi.getManual05())
        .manual06(recipeApi.getManual06())
        .manual07(recipeApi.getManual07())
        .manual08(recipeApi.getManual08())
        .manual09(recipeApi.getManual09())
        .manual10(recipeApi.getManual10())
        .manual11(recipeApi.getManual11())
        .manual12(recipeApi.getManual12())
        .manual13(recipeApi.getManual13())
        .manual14(recipeApi.getManual14())
        .manual15(recipeApi.getManual15())
        .manual16(recipeApi.getManual16())
        .manual17(recipeApi.getManual17())
        .manual18(recipeApi.getManual18())
        .manual19(recipeApi.getManual19())
        .manual20(recipeApi.getManual20())
        .manualImg01(recipeApi.getManualImg01())
        .manualImg02(recipeApi.getManualImg02())
        .manualImg03(recipeApi.getManualImg03())
        .manualImg04(recipeApi.getManualImg04())
        .manualImg05(recipeApi.getManualImg05())
        .manualImg06(recipeApi.getManualImg06())
        .manualImg07(recipeApi.getManualImg07())
        .manualImg08(recipeApi.getManualImg08())
        .manualImg09(recipeApi.getManualImg09())
        .manualImg10(recipeApi.getManualImg10())
        .manualImg11(recipeApi.getManualImg11())
        .manualImg12(recipeApi.getManualImg12())
        .manualImg13(recipeApi.getManualImg13())
        .manualImg14(recipeApi.getManualImg14())
        .manualImg15(recipeApi.getManualImg15())
        .manualImg16(recipeApi.getManualImg16())
        .manualImg17(recipeApi.getManualImg17())
        .manualImg18(recipeApi.getManualImg18())
        .manualImg19(recipeApi.getManualImg19())
        .manualImg20(recipeApi.getManualImg20())
        .build();
  }

  public static UnifiedRecipeDTO fromEntity(Recipes recipes) {
    String source = "db";
    String recipeId = recipes.getId() != null ? recipes.getId().toString() : null;

    String authorName = "운영자";
    String nickName = null;
    Integer userId = null;

    if (recipes.getUser() != null) {
      User user = recipes.getUser();
      authorName = user.getUsername();
      nickName = user.getUsername();
      userId = user.getUserId();
    }

    return UnifiedRecipeDTO.builder()
        .id(recipeId)
        .dbId(recipes.getId() != null ? Long.valueOf(recipes.getId()) : null)
        .source(source)
        .title(recipes.getRcpNm())
        .imageUrl(recipes.getAttFileNoMain())
        .description(createDescriptionFromRecipes(recipes))
        .ingredients(recipes.getRcpPartsDtls())
        .instructions(null)
        .cookingSteps(createCookingStepsFromRecipes(recipes))
        .rcpPat2(recipes.getRcpPat2())
        .rcpWay2(recipes.getRcpWay2())
        .infoWgt(recipes.getInfoWgt())
        .likeCount(recipes.getLikeCount())
        .viewCount(recipes.getViewCount())
        .userId(userId)
        .author(authorName)
        .nickName(nickName)
        .build();
  }

  private static String createDescriptionFromRecipes(Recipes recipes) {
    return recipes.getRcpNaTip();
  }

  private static List<CookingStepDTO> createCookingStepsFromRecipes(Recipes recipes) {
    List<CookingStepDTO> steps = new ArrayList<>();
    for (int i = 1; i <= 20; i++) {
      try {
        Method getManualTextMethod = Recipes.class.getMethod("getManual" + String.format("%02d", i));
        String manualText = (String) getManualTextMethod.invoke(recipes);

        Method getManualImageUrlMethod = Recipes.class.getMethod("getManualImg" + String.format("%02d", i));
        String manualImageUrl = (String) getManualImageUrlMethod.invoke(recipes);

        if (manualText != null && !manualText.trim().isEmpty()) {
          steps.add(CookingStepDTO.builder()
              .step(i)
              .description(manualText)
              .imageUrl(manualImageUrl)
              .build());
        }
      } catch (NoSuchMethodException e) {
        break;
      } catch (Exception e) {
        log.warn(">>> [RecipeMapper] Recipes에서 조리 단계 파싱 중 예외 발생: {}", e.getMessage());
        break;
      }
    }
    return steps;
  }

  // RecipeViewDTO에서 호출할 수 있도록 public으로 변경
  public static Integer parseCookingTimeFromInfoWgt(String infoWgt) {
    if (infoWgt != null) {
      Matcher matcher = Pattern.compile("(\\d+)\\s*(분|min)").matcher(infoWgt);
      if (matcher.find()) {
        try {
          return Integer.parseInt(matcher.group(1));
        } catch (NumberFormatException e) {
          log.warn(">>> [RecipeMapper] 조리 시간 파싱 중 NumberFormatException 발생: {}", infoWgt);
        }
      }
    }
    return null;
  }

  // 일관성을 위해 public으로 변경
  public static Integer parseServingsFromInfoWgt(String infoWgt) {
    if (infoWgt != null) {
      Matcher matcher = Pattern.compile("(\\d+)\\s*(인분|servings)").matcher(infoWgt);
      if (matcher.find()) {
        try {
          return Integer.parseInt(matcher.group(1));
        } catch (NumberFormatException e) {
          log.warn(">>> [RecipeMapper] 제공량 파싱 중 NumberFormatException 발생: {}", infoWgt);
        }
      }
    }
    return null;
  }
}