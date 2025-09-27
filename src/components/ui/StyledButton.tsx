import React from "react";
import styled from "styled-components";

interface StyledButtonProps {
  text: string;
  onClick?: () => void;
}

const StyledButton: React.FC<StyledButtonProps> = ({ text, onClick }) => {
  return (
    <Wrapper>
      <button type="button" className="button" onClick={onClick}>
        <span className="fold" />
        <div className="points_wrapper">
          {Array.from({ length: 10 }).map((_, i) => (
            <i key={i} className="point" />
          ))}
        </div>
        <span className="inner">{text}</span>
      </button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .button {
    --h-button: 48px;
    --w-button: 140px;
    --round: 0.75rem;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    cursor: pointer;
    background: radial-gradient(
        65.28% 65.28% at 50% 100%,
        rgba(223, 113, 255, 0.8) 0%,
        rgba(223, 113, 255, 0) 100%
      ),
      linear-gradient(0deg, #7a5af8, #7a5af8);
    border-radius: var(--round);
    border: none;
    padding: 12px 24px;
    color: white;
    font-weight: 500;
    transition: transform 0.2s ease;
  }

  .button:active {
    transform: scale(0.95);
  }

  .fold {
    z-index: 1;
    position: absolute;
    top: 0;
    right: 0;
    height: 1rem;
    width: 1rem;
    display: inline-block;
    background: radial-gradient(
      100% 75% at 55%,
      rgba(223, 113, 255, 0.8) 0%,
      rgba(223, 113, 255, 0) 100%
    );
    border-bottom-left-radius: 0.5rem;
    border-top-right-radius: var(--round);
    transition: all 0.5s ease;
  }

  .button:hover .fold {
    margin-top: -1rem;
    margin-right: -1rem;
  }

  .points_wrapper {
    overflow: hidden;
    width: 100%;
    height: 100%;
    pointer-events: none;
    position: absolute;
    z-index: 0;
  }

  .points_wrapper .point {
    bottom: -10px;
    position: absolute;
    width: 2px;
    height: 2px;
    background-color: white;
    border-radius: 9999px;
    animation: floating-points infinite ease-in-out;
  }

  .points_wrapper .point:nth-child(1) {
    left: 10%;
    animation-duration: 2.35s;
    animation-delay: 0.2s;
  }
  .points_wrapper .point:nth-child(2) {
    left: 30%;
    animation-duration: 2.5s;
    animation-delay: 0.5s;
  }
  .points_wrapper .point:nth-child(3) {
    left: 25%;
    animation-duration: 2.2s;
    animation-delay: 0.1s;
  }
  .points_wrapper .point:nth-child(4) {
    left: 44%;
    animation-duration: 2.05s;
  }
  .points_wrapper .point:nth-child(5) {
    left: 50%;
    animation-duration: 1.9s;
  }
  .points_wrapper .point:nth-child(6) {
    left: 75%;
    animation-duration: 1.5s;
    animation-delay: 1.5s;
  }
  .points_wrapper .point:nth-child(7) {
    left: 88%;
    animation-duration: 2.2s;
    animation-delay: 0.2s;
  }
  .points_wrapper .point:nth-child(8) {
    left: 58%;
    animation-duration: 2.25s;
    animation-delay: 0.2s;
  }
  .points_wrapper .point:nth-child(9) {
    left: 98%;
    animation-duration: 2.6s;
    animation-delay: 0.1s;
  }
  .points_wrapper .point:nth-child(10) {
    left: 65%;
    animation-duration: 2.5s;
    animation-delay: 0.2s;
  }

  @keyframes floating-points {
    0% {
      transform: translateY(0);
      opacity: 1;
    }
    85% {
      opacity: 0;
    }
    100% {
      transform: translateY(-55px);
      opacity: 0;
    }
  }

  .inner {
    position: relative;
    z-index: 1;
  }
`;

export default StyledButton;
