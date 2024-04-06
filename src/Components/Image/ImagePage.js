import React from 'react'
import ImageHome from './ImageHome';
import NavBar from '../NavBar/NavBar'
import styled, { ThemeProvider } from "styled-components";

const darkTheme = {
  bg: "#15171E",
  bgLight: "#1C1E27",
  bgDark: "#15171E",
  primary: "#007AFF",
  secondary: "#9747FF",
  navbar: "#1C1E27",
  arrow: "#AFAFB5",
  menu_primary_text: "#F2F3F4",
  menu_secondary_text: "#b1b2b3",
  text_primary: "#F2F3F4",
  text_secondary: "#b1b2b3",
  card: "#1C1E27",
  card_light: "#191924",
  disabled: "#b1b2b3",
  shadow: "#00000060",
  white: "#FFFFFF",
  black: "#000000",
  green: "#12ff75",
  yellow: "#ffcc00",
  red: "#ef5350",
  orange: "#F7AD63",
};

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  overflow-x: hidden;
  overflow-y: hidden;
  transition: all 0.2s ease;
`;

const ImageWrapper = styled.div`
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 3;
`;


function ImagePage() {
  return (
    <div>
      <ThemeProvider theme={darkTheme}>
      <ImageContainer>
        <ImageWrapper>
            <NavBar/>
            <ImageHome />
        </ImageWrapper>
      </ImageContainer>
    </ThemeProvider>
    </div>
  )
}

export default ImagePage