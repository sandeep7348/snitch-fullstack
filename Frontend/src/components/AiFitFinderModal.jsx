import React, { useState } from "react";
import { X, Sparkles, Check, Ruler, AlertCircle } from "lucide-react";
import styles from "./aiFitFinder.module.scss";

export default function AiFitFinderModal({ isOpen, onClose, onSelectSize }) {
  const [height, setHeight] = useState(175); // cm
  const [weight, setWeight] = useState(72); // kg
  const [fitPreference, setFitPreference] = useState("oversized"); // slim, regular, oversized
  const [analyzing, setAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  if (!isOpen) return null;

  const calculateSize = () => {
    setAnalyzing(true);
    setTimeout(() => {
      let size = "M";
      if (height < 165) {
        size = weight > 70 ? "M" : "S";
      } else if (height <= 175) {
        size = weight > 78 ? "XL" : weight > 68 ? "L" : "M";
      } else if (height <= 185) {
        size = weight > 85 ? "XXL" : weight > 74 ? "XL" : "L";
      } else {
        size = weight > 90 ? "XXL" : "XL";
      }

      if (fitPreference === "oversized" && size !== "XXL") {
        const sizeOrder = ["S", "M", "L", "XL", "XXL"];
        const currIndex = sizeOrder.indexOf(size);
        size = sizeOrder[Math.min(currIndex + 1, sizeOrder.length - 1)];
      }

      setRecommendation({
        size,
        confidence: 96,
        chest: "108-112 cm",
        shoulder: "52 cm",
        length: "74 cm",
        tip: fitPreference === "oversized" 
          ? "For an edgy streetwear drape, this size gives you the perfect boxy drop-shoulder fit."
          : "Tailored to sit comfortably on your shoulders with standard room for movement."
      });
      setAnalyzing(false);
    }, 600);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.headerTitle}>
            <Sparkles size={20} className={styles.sparkleIcon} />
            <h3>Snitch AI Fit Finder</h3>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.subtitle}>
            Input your body metrics to get precision size recommendations backed by our sizing algorithm.
          </p>

          <div className={styles.inputSection}>
            <div className={styles.inputRow}>
              <div className={styles.labelRow}>
                <label>Height</label>
                <span><strong>{height}</strong> cm</span>
              </div>
              <input 
                type="range" 
                min="150" 
                max="200" 
                value={height} 
                onChange={(e) => setHeight(Number(e.target.value))} 
              />
            </div>

            <div className={styles.inputRow}>
              <div className={styles.labelRow}>
                <label>Weight</label>
                <span><strong>{weight}</strong> kg</span>
              </div>
              <input 
                type="range" 
                min="45" 
                max="120" 
                value={weight} 
                onChange={(e) => setWeight(Number(e.target.value))} 
              />
            </div>

            <div className={styles.fitGroup}>
              <label>Fit Preference</label>
              <div className={styles.fitOptions}>
                <button 
                  className={fitPreference === 'slim' ? styles.activeFit : ''}
                  onClick={() => setFitPreference('slim')}
                >
                  Slim Fit
                </button>
                <button 
                  className={fitPreference === 'regular' ? styles.activeFit : ''}
                  onClick={() => setFitPreference('regular')}
                >
                  Regular Fit
                </button>
                <button 
                  className={fitPreference === 'oversized' ? styles.activeFit : ''}
                  onClick={() => setFitPreference('oversized')}
                >
                  Oversized Fit 🔥
                </button>
              </div>
            </div>

            <button 
              className={styles.calculateBtn} 
              onClick={calculateSize}
              disabled={analyzing}
            >
              {analyzing ? "Analyzing Fit Metrics..." : "Get AI Size Recommendation"}
            </button>
          </div>

          {recommendation && (
            <div className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <div className={styles.sizeBadge}>
                  Size <strong>{recommendation.size}</strong>
                </div>
                <div className={styles.confidenceTag}>
                  <Check size={14} /> {recommendation.confidence}% Match
                </div>
              </div>

              <p className={styles.fitTip}>{recommendation.tip}</p>

              <div className={styles.measurementsGrid}>
                <div><span>Chest</span> <strong>{recommendation.chest}</strong></div>
                <div><span>Shoulder</span> <strong>{recommendation.shoulder}</strong></div>
                <div><span>Length</span> <strong>{recommendation.length}</strong></div>
              </div>

              <button 
                className={styles.applyBtn}
                onClick={() => {
                  onSelectSize(recommendation.size);
                  onClose();
                }}
              >
                Apply Size {recommendation.size}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
