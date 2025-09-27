import { useTheme } from "next-themes";
import React from "react";
import styled from "styled-components";

interface FancyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const FancyButton: React.FC<FancyButtonProps> = ({ children, onClick }) => {
  const { theme } = useTheme();

  return (
    <StyledWrapper $theme={theme}>
      <div className="btn" onClick={onClick}>
        <span data-text={children}>{children}</span>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ $theme?: string }>`
  position: relative;
  display: inline-block;

  .btn {
    background: transparent;
    border: 1px solid ${({ $theme }) => ($theme === "dark" ? "white" : "black")};
    outline: none;
    padding: 8px 28px; /* smaller padding */
    height: 48px; /* smaller height */
    border-radius: 100px;
    overflow: hidden;
    transform: scaleX(1);
    transition: transform 0.5s cubic-bezier(0.4, 0, 0, 1),
      border-color 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: relative;
  }

  .btn:hover {
    animation: animate-scaleX 0.6s cubic-bezier(0.4, 0, 0, 1);
    background: transparent;
  }

  .btn::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    background: ${({ $theme }) => ($theme === "dark" ? "white" : "black")};
    transition: transform 0.5s cubic-bezier(0.4, 0, 0, 1),
      border-radius 0.5s cubic-bezier(0.4, 0, 0, 1), background 0.3s ease;
    width: 100%;
    height: 100%;
    border-radius: 50% 50% 0 0;
    transform: translateY(100%);
    z-index: 0;
  }

  .btn:hover::after {
    transform: translateY(0%);
    border-radius: 0;
  }

  .btn span {
    font-size: 16px;
    font-weight: 500;
    overflow: hidden;
    position: relative;
    z-index: 2;
    color: ${({ $theme }) => ($theme === "dark" ? "white" : "black")};
  }

  .btn span:after {
    width: 100%;
    height: 100%;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0, 1);
    content: attr(data-text);
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 50%;
    bottom: 0;
    z-index: 1;
    transform: translate(-50%, 100%);
    color: ${({ $theme }) => ($theme === "dark" ? "black" : "white")};
  }

  .btn:hover span:after {
    transform: translate(-50%, 0);
  }

  .btn:focus {
    outline: none;
  }

  @keyframes animate-scaleX {
    0% {
      transform: scaleX(1);
    }
    50% {
      transform: scaleX(1.05);
    }
    100% {
      transform: scaleX(1);
    }
  }
`;

export default FancyButton;
