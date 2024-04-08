import { CircularProgress } from "@mui/material";
import React from "react";
import styled from "styled-components";
import { DownloadRounded } from "@mui/icons-material";
import { saveAs } from 'file-saver';

const Container = styled.div`
  flex: 1;
  min-height: 400px;
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;
  padding: 16px;
  flex-direction: column;
  border: 2px solid ${({ theme }) => theme.white};
  color: ${({ theme }) => theme.arrow + 80};
  border-radius: 20px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 24px;
  background: ${({ theme }) => theme.black + 50};
`;

const GeneratedImageCard = ({ src, loading }) => {
  return (
    <Container className="imgRightCard">
      {loading ? (
        <>
          <CircularProgress
            style={{ color: "inherit", width: "24px", height: "24px" }}
          />
          Generating Your Image ...
        </>
      ) : (
        <>
        {
          src && (
            <DownloadRounded
                  onClick={()=>saveAs(src, 'aiImage.jpg')}
            >
              Download Image
            </DownloadRounded>
            
          )
        }
          {src ? <Image src={src} /> : <>Write a prompt to generate image </>}
        </>
      )}
    </Container>
  );
};

export default GeneratedImageCard;