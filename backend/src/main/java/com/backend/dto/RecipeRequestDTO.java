package com.backend.dto;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeRequestDTO {

    @Size(max = 100)
    @NotNull
    private String rcpNm; // 레시피명

    @Size(max = 50)
    private String rcpWay2; // 조리 방법 분류

    @Size(max = 50)
    private String rcpPat2; // 음식 종류 분류

    private String rcpPartsDtls; // 재료 상세 정보

    @Size(max = 200)
    private String hashTag; // 해시태그

    private String rcpNaTip; // 나트륨 저감 팁

    @Size(max = 255)
    private String attFileNoMain; // 메인 이미지 파일 경로

    @Size(max = 255)
    private String attFileNoMk; // 보조 이미지 파일 경로

    @Size(max = 50)
    private String infoEng; // 열량 (info_eng)

    @Size(max = 50)
    private String infoCar; // 탄수화물 (info_car)

    @Size(max = 50)
    private String infoPro; // 단백질 (info_pro)

    @Size(max = 50)
    private String infoFat; // 지방 (info_fat)

    @Size(max = 50)
    private String infoNa; // 나트륨 (info_na)

    @Size(max = 50)
    private String infoWgt; // 1회 제공량 및 단위 (info_wgt)

    // 조리 단계 (manual01 ~ manual20)
    private String manual01;
    private String manual02;
    private String manual03;
    private String manual04;
    private String manual05;
    private String manual06;
    private String manual07;
    private String manual08;
    private String manual09;
    private String manual10;
    private String manual11;
    private String manual12;
    private String manual13;
    private String manual14;
    private String manual15;
    private String manual16;
    private String manual17;
    private String manual18;
    private String manual19;
    private String manual20;

    // 조리 단계 이미지 URL (manualImg01 ~ manualImg20)
    @Size(max = 255)
    private String manualImg01;
    @Size(max = 255)
    private String manualImg02;
    @Size(max = 255)
    private String manualImg03;
    @Size(max = 255)
    private String manualImg04;
    @Size(max = 255)
    private String manualImg05;
    @Size(max = 255)
    private String manualImg06;
    @Size(max = 255)
    private String manualImg07;
    @Size(max = 255)
    private String manualImg08;
    @Size(max = 255)
    private String manualImg09;
    @Size(max = 255)
    private String manualImg10;
    @Size(max = 255)
    private String manualImg11;
    @Size(max = 255)
    private String manualImg12;
    @Size(max = 255)
    private String manualImg13;
    @Size(max = 255)
    private String manualImg14;
    @Size(max = 255)
    private String manualImg15;
    @Size(max = 255)
    private String manualImg16;
    @Size(max = 255)
    private String manualImg17;
    @Size(max = 255)
    private String manualImg18;
    @Size(max = 255)
    private String manualImg19;
    @Size(max = 255)
    private String manualImg20;
}