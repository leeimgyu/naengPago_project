package com.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "recipes")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recipes extends BasicEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "rcp_seq", nullable = false)
  private Integer id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id")
  private User user;

  @Size(max = 100)
  @NotNull
  @Column(name = "rcp_nm", nullable = false, length = 100)
  private String rcpNm;

  @Size(max = 50)
  @Column(name = "rcp_way2", length = 50)
  private String rcpWay2;

  @Size(max = 50)
  @Column(name = "rcp_pat2", length = 50)
  private String rcpPat2;

  @Column(name = "rcp_parts_dtls", length = Integer.MAX_VALUE)
  private String rcpPartsDtls;

  @Size(max = 200)
  @Column(name = "hash_tag", length = 200)
  private String hashTag;

  @Column(name = "rcp_na_tip", length = Integer.MAX_VALUE)
  private String rcpNaTip;

  @Size(max = 255)
  @Column(name = "att_file_no_main")
  private String attFileNoMain;

  @Size(max = 255)
  @Column(name = "att_file_no_mk")
  private String attFileNoMk;

  @Size(max = 50)
  @Column(name = "info_eng", length = 50)
  private String infoEng;

  @Size(max = 50)
  @Column(name = "info_car", length = 50)
  private String infoCar;

  @Size(max = 50)
  @Column(name = "info_pro", length = 50)
  private String infoPro;

  @Size(max = 50)
  @Column(name = "info_fat", length = 50)
  private String infoFat;

  @Size(max = 50)
  @Column(name = "info_na", length = 50)
  private String infoNa;

  @Size(max = 50)
  @Column(name = "info_wgt", length = 50)
  private String infoWgt;

  @Column(name = "view_count", nullable = false)
  @Builder.Default
  private Integer viewCount = 0;

  @Column(name = "like_count", nullable = false)
  @Builder.Default
  private Integer likeCount = 0;

  @Column(name = "manual01", length = Integer.MAX_VALUE)
  private String manual01;

  @Column(name = "manual02", length = Integer.MAX_VALUE)
  private String manual02;

  @Column(name = "manual03", length = Integer.MAX_VALUE)
  private String manual03;

  @Column(name = "manual04", length = Integer.MAX_VALUE)
  private String manual04;

  @Column(name = "manual05", length = Integer.MAX_VALUE)
  private String manual05;

  @Column(name = "manual06", length = Integer.MAX_VALUE)
  private String manual06;

  @Column(name = "manual07", length = Integer.MAX_VALUE)
  private String manual07;

  @Column(name = "manual08", length = Integer.MAX_VALUE)
  private String manual08;

  @Column(name = "manual09", length = Integer.MAX_VALUE)
  private String manual09;

  @Column(name = "manual10", length = Integer.MAX_VALUE)
  private String manual10;

  @Column(name = "manual11", length = Integer.MAX_VALUE)
  private String manual11;

  @Column(name = "manual12", length = Integer.MAX_VALUE)
  private String manual12;

  @Column(name = "manual13", length = Integer.MAX_VALUE)
  private String manual13;

  @Column(name = "manual14", length = Integer.MAX_VALUE)
  private String manual14;

  @Column(name = "manual15", length = Integer.MAX_VALUE)
  private String manual15;

  @Column(name = "manual16", length = Integer.MAX_VALUE)
  private String manual16;

  @Column(name = "manual17", length = Integer.MAX_VALUE)
  private String manual17;

  @Column(name = "manual18", length = Integer.MAX_VALUE)
  private String manual18;

  @Column(name = "manual19", length = Integer.MAX_VALUE)
  private String manual19;

  @Column(name = "manual20", length = Integer.MAX_VALUE)
  private String manual20;

  @Size(max = 255)
  @Column(name = "manual_img01")
  private String manualImg01;

  @Size(max = 255)
  @Column(name = "manual_img02")
  private String manualImg02;

  @Size(max = 255)
  @Column(name = "manual_img03")
  private String manualImg03;

  @Size(max = 255)
  @Column(name = "manual_img04")
  private String manualImg04;

  @Size(max = 255)
  @Column(name = "manual_img05")
  private String manualImg05;

  @Size(max = 255)
  @Column(name = "manual_img06")
  private String manualImg06;

  @Size(max = 255)
  @Column(name = "manual_img07")
  private String manualImg07;

  @Size(max = 255)
  @Column(name = "manual_img08")
  private String manualImg08;

  @Size(max = 255)
  @Column(name = "manual_img09")
  private String manualImg09;

  @Size(max = 255)
  @Column(name = "manual_img10")
  private String manualImg10;

  @Size(max = 255)
  @Column(name = "manual_img11")
  private String manualImg11;

  @Size(max = 255)
  @Column(name = "manual_img12")
  private String manualImg12;

  @Size(max = 255)
  @Column(name = "manual_img13")
  private String manualImg13;

  @Size(max = 255)
  @Column(name = "manual_img14")
  private String manualImg14;

  @Size(max = 255)
  @Column(name = "manual_img15")
  private String manualImg15;

  @Size(max = 255)
  @Column(name = "manual_img16")
  private String manualImg16;

  @Size(max = 255)
  @Column(name = "manual_img17")
  private String manualImg17;

  @Size(max = 255)
  @Column(name = "manual_img18")
  private String manualImg18;

  @Size(max = 255)
  @Column(name = "manual_img19")
  private String manualImg19;

  @Size(max = 255)
  @Column(name = "manual_img20")
  private String manualImg20;

}
