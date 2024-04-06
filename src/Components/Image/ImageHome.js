import React, { useState } from "react";
import styled from "styled-components";
import GenerateImageForm from "./GenerateImageForm";
import GeneratedImageCard from "./GeneratedImageCard";

const Container = styled.div`
  height: 100vh;
  overflow-y: scroll;
  background: #1d2026;
  padding: 30px 30px;
  padding-bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  @media (max-width: 768px) {
    padding: 6px 10px;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: fit-content;
  max-width: 1200px;
  gap: 8%;
  display: flex;
  justify-content: center;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

function ImageHome() {
  const [generateImageLoading, setGenerateImageLoading] = useState(false);
  const [post, setPost] = useState({
    name: "",
    prompt: "",
    photo: "",
  });
  return (
    <Container>
      <Wrapper>
        <GenerateImageForm
          post={post}
          setPost={setPost}
          setGenerateImageLoading={setGenerateImageLoading}
          generateImageLoading={generateImageLoading}
        />
        <GeneratedImageCard src={post?.photo} loading={generateImageLoading} />
      </Wrapper>
    </Container>
  );
}

export default ImageHome