import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMediaQuery } from "react-responsive";
import { flavorlists } from "../constants";

const FlavorSlider = () => {
  const isTabletOrBelow = useMediaQuery({ maxWidth: 1024 });
  // useMediaQuery returns a boolean, true if the condition is met, false otherwise

  useGSAP(() => {
    // scrollAmount 改成函式而非固定數字：mount 當下量到的 .flavor-section.scrollWidth
    // 有時會不準（曾實測在 Firefox 出現間歇性錯誤，原因未完全查明），若寫死成數字，
    // 量錯了就永遠錯下去。搭配下面 scrollTrigger 的 invalidateOnRefresh: true，
    // 每次 ScrollTrigger.refresh() 觸發（例如所有圖片/字型載入完成、視窗 resize 等）
    // 都會重新呼叫這個函式、重新量測，讓計算結果有機會自我修正。
    const getScrollAmount = () => {
      return document.querySelector('.flavor-section').scrollWidth - window.innerWidth + 100;
    }
    

    // 用垂直捲動觸發 x 位移，偽造橫向捲動效果：捲動時把 .flavor-section 整個往左推，
    // 搭配 pin 讓區塊固定在畫面上直到推完，全程其實還是原生的垂直捲動在驅動，不是真的橫向捲動。
    if (!isTabletOrBelow) {
      gsap.to(".flavor-section", {
        x: () => -getScrollAmount(),
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: ".flavor-section",
          start: "2% top",
          end: () => `+=${getScrollAmount()}`,
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
          // markers: true,
        },
      });
    }

  }, { dependencies: [isTabletOrBelow], revertOnUpdate: true });

  return (
    <div className="slider-wrapper">
      <div className="flavors">
        {flavorlists.map((flavor) => (
          <div
            key={flavor.name}
            className={`relative z-30 lg:w-[50vw] w-96 lg:h-[70vh] md:w-[90vw] md:h-[50vh] h-80 flex-none ${flavor.rotation}`}
          >
            <img
              src={`/images/${flavor.color}-bg.svg`}
              alt={`${flavor.name} background`}
              className="absolute bottom-0"
            />
            <img
              src={`/images/${flavor.color}-drink.webp`}
              alt={flavor.name}
              className="drinks"
            />
            <img
              src={`/images/${flavor.color}-elements.webp`}
              alt={`${flavor.name} elements`}
              className="elements"
            />

            <h1>{flavor.name}</h1>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FlavorSlider
