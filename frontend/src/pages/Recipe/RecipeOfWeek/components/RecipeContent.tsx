import React, { useState } from 'react';
import { motion } from "framer-motion";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { ChevronRight } from "lucide-react";
import { weeklyRecipes } from '../data';
import { ServicePreparationModal } from '@/pages/Recipe/RecipeOfWeek/components/ServicePreparationModal';

interface RecipeContentProps {
  contentPaddingLeft: string;
  contentPaddingRight: string;
}

export function RecipeContent({ contentPaddingLeft, contentPaddingRight }: RecipeContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {weeklyRecipes.map((week) => (
        <React.Fragment key={week.weekNumber}>
          {week.days.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className="relative flex items-center justify-center flex-none h-full min-w-screen"
              style={{
                width: "100vw",
                paddingLeft: contentPaddingLeft,
                paddingRight: contentPaddingRight,
              }}
            >
              {/* 배경 그라데이션 */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/40 to-transparent"></div>

              {/* 메인 콘텐츠 */}
              <div className="relative z-10 grid items-center w-full max-w-6xl gap-8 md:grid-cols-2">
                {/* 좌측: 정보 */}
                <div className="space-y-6 md:space-y-8">
                  {/* 주차 정보 */}
                  {dayIndex === 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                      className="mb-6 md:mb-8"
                    >
                      <p className="text-[#3b6c55] mb-2 text-sm md:text-base">{week.weekDate}</p>
                      <h2
                        className="mb-4 text-xl text-gray-900 whitespace-pre-line md:text-2xl"
                        style={{ lineHeight: 1.3 }}
                      >
                        {week.theme}
                      </h2>
                    </motion.div>
                  )}

                  {/* 요일 */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <p className="mb-2 text-sm text-gray-400 md:text-base">{day.dayEng}</p>
                    <h1
                      className="mb-4 text-5xl text-gray-900 md:text-6xl lg:text-7xl"
                      style={{ lineHeight: 1.1 }}
                    >
                      {day.day}
                    </h1>
                  </motion.div>

                  {/* 레시피 정보 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="space-y-4 md:space-y-6"
                  >
                    <div>
                      <h3 className="mb-2 text-lg text-gray-900 md:text-xl">{day.title}</h3>
                      <p className="text-sm text-gray-600 md:text-base">{day.description}</p>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-500 md:text-base">
                      <div className="flex items-center gap-2">
                        <span className="text-[#3b6c55]">조리시간</span>
                        <span>{day.cookTime}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleOpenModal}
                      className="group flex items-center gap-2 bg-[#3b6c55] text-white px-5 py-2.5 md:px-6 md:py-3 rounded-full hover:bg-[#2a5240] transition-all text-sm md:text-base"
                    >
                      <span>레시피 보기</span>
                      <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </motion.div>
                </div>

                {/* 우측: 이미지 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="relative order-first md:order-last" // 모바일에서 이미지가 위로 오도록
                >
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                    <ImageWithFallback
                      src={day.image}
                      alt={day.title}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* 이미지 위 장식 요소 */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-[#3b6c55]/10 -z-10"></div>
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-[#3b6c55]/5 -z-10"></div>
                </motion.div>
              </div>
            </div>
          ))}
        </React.Fragment>
      ))}
      {isModalOpen && <ServicePreparationModal onClose={handleCloseModal} />}
    </>
  );
}
