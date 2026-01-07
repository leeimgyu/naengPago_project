/**
 * History Timeline Component
 * @description 연혁을 타임라인 형식으로 표시
 */

import React from "react";
import styles from "./HistoryTimeline.module.css";

// 이미지 import
import planImage from "@/assets/image/about/plan.jpg";
import teamImage from "@/assets/image/about/team.jpg";
import plan2Image from "@/assets/image/about/plan2.jpg";
import betaImage from "@/assets/image/about/beta.jpg";
import testImage from "@/assets/image/about/test.jpg";
import manypeopleImage from "@/assets/image/about/manypeople.jpg";

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  description: string;
  imagePath: string;
  imageAlt: string;
  position: "left" | "right";
}

const timelineData: TimelineEvent[] = [
  {
    id: 1,
    date: "2025.10",
    title: "냉파고 서비스 기획 시작",
    description:
      "스마트한 식생활 솔루션을 위한 냉파고 프로젝트가 시작되었습니다. 음식물 쓰레기 감소와 AI 기반 레시피 추천이라는 비전을 가지고 초기 기획을 진행했습니다.",
    imagePath: planImage,
    imageAlt: "냉파고 기획 시작",
    position: "right",
  },
  {
    id: 2,
    date: "2025.10",
    title: "초기 팀 구성 완료",
    description:
      "다양한 분야의 전문가들이 모여 냉파고 팀을 구성했습니다. 개발, 디자인, 마케팅 전문가들이 하나의 목표를 향해 첫 발걸음을 내딛었습니다.",
    imagePath: teamImage,
    imageAlt: "초기 팀 구성",
    position: "left",
  },
  {
    id: 3,
    date: "2025.11",
    title: "AI 레시피 추천 엔진 개발 착수",
    description:
      "딥러닝 기반의 재료 인식 및 레시피 추천 알고리즘 개발을 시작했습니다. 수천 개의 레시피 데이터를 학습하여 최적의 추천 시스템을 구축했습니다.",
    imagePath: plan2Image,
    imageAlt: "AI 엔진 개발",
    position: "right",
  },
  {
    id: 4,
    date: "2025.11",
    title: "베타 테스트 참여자 모집",
    description:
      "실제 사용자들의 피드백을 받기 위한 베타 테스트를 시작했습니다. 100명의 초기 사용자들과 함께 서비스를 개선해나갔습니다.",
    imagePath: betaImage,
    imageAlt: "베타 테스트",
    position: "left",
  },
  {
    id: 5,
    date: "2025.12",
    title: "웹 서비스 정식 출시",
    description:
      "드디어 냉파고 웹 서비스가 정식으로 출시되었습니다. 사용자 친화적인 인터페이스와 강력한 AI 기능으로 많은 관심을 받았습니다.",
    imagePath: testImage,
    imageAlt: "서비스 출시",
    position: "right",
  },
  {
    id: 6,
    date: "2025.12",
    title: "초기 사용자 1,000명 달성",
    description:
      "출시 한 달 만에 1,000명의 사용자를 확보하며 성공적인 시작을 알렸습니다. 긍정적인 리뷰와 활발한 커뮤니티 활동이 이어졌습니다.",
    imagePath: manypeopleImage,
    imageAlt: "1000명 달성",
    position: "left",
  },
];

const HistoryTimeline: React.FC = () => {
  return (
    <section className={styles.timelineSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>2025년 주요 성과</h2>
          <p className={styles.sectionSubtitle}>
            냉파고의 시작과 성장의 발자취
          </p>
        </div>

        <div className={styles.timeline}>
          {/* 중앙 세로선 */}
          <div className={styles.timelineLine}></div>

          {/* 타임라인 이벤트 */}
          {timelineData.map((event, index) => (
            <div
              key={event.id}
              className={`${styles.timelineItem} ${
                event.position === "left" ? styles.left : styles.right
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* 타임라인 점 */}
              <div className={styles.timelineDot}>
                <div className={styles.dotInner}></div>
              </div>

              {/* 콘텐츠 카드 */}
              <div className={styles.timelineCard}>
                <div className={styles.cardDate}>{event.date}</div>

                <div className={styles.cardContent}>
                  <div className={styles.imageWrapper}>
                    <img
                      src={event.imagePath}
                      alt={event.imageAlt}
                      className={styles.eventImage}
                    />
                  </div>

                  <div className={styles.textContent}>
                    <h3 className={styles.eventTitle}>{event.title}</h3>
                    <p className={styles.eventDescription}>
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HistoryTimeline;
