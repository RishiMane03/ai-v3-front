import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import Button from "./ImageButton";
import TextInput from "./Textinput";
import { AutoAwesome } from "@mui/icons-material";
import axios from "axios";
import './GenerateImageForm.css'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
// import VariableContext from '../../Content/VariableContext';

  const Form = styled.div`
    flex: 1;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 9%;
    justify-content: center;
  `;
  const Top = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
  `;
  const Title = styled.div`
    font-size: 28px;
    font-weight: 500;
    color: ${({ theme }) => theme.text_primary};
  `;
  const Desc = styled.div`
    font-size: 17px;
    font-weight: 400;
    color: ${({ theme }) => theme.text_secondary};
  `;
  const Body = styled.div`
    display: flex;
    flex-direction: column;
    gap: 18px;
    font-size: 12px;
    font-weight: 400;
    color: ${({ theme }) => theme.text_secondary};
  `;
  const Actions = styled.div`
    flex: 1;
    display: flex;
    gap: 8px;
  `;

  const GenerateImageForm = ({
    post,
    setPost,
    setGenerateImageLoading,
    generateImageLoading,
  }) => {

  const [error, setError] = useState("");
  // const { userInfo } = useContext(VariableContext);
  const navigate = useNavigate()
  const BackendURL = process.env.REACT_APP_BACKEND_URL

  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])

   // check Token is present
   function getCookie(cookieName) {
    // Split the cookie string into individual cookies
    let cookies = document.cookie.split(';');
  
    // Iterate through the cookies to find the one with the specified name
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      // Check if this cookie starts with the name we're looking for
      if (cookie.indexOf(cookieName + '=') === 0) {
        // If found, return the value of the cookie
        return cookie.substring(cookieName.length + 1);
      }
    }
    // If cookie not found, return null
    return null;
  }

  const generateImageFun = async () => {
    setGenerateImageLoading(true);

    try {
      const response = await axios.post(`https://ai-v3-back.onrender.com/genImg`, { prompt: post.prompt })
      console.log('image url: ',response.data.aiImageURL);
      setGenerateImageLoading(false);
      setPost({
        ...post,
        photo: `${response?.data?.aiImageURL}`,
      });
    } catch (error) {
        console.log(error);
        setGenerateImageLoading(false);
    }
  };


  return (
    <Form className="imgForm">
      <Top>
        <Title>Lets Generate Image With Prompt</Title>
        <Desc>
          Image Genie: Granting Your Funny Wishes!
        </Desc>
      </Top>
      <Body>
        <TextInput
          placeholder="Write a detailed prompt about the image . . . "
          name="name"
          rows="8"
          textArea
          value={post.prompt}
          handelChange={(e) => setPost({ ...post, prompt: e.target.value })}
        />
        {error && <div style={{ color: "red" }}>{error}</div>}
      </Body>
      <Actions>
        <Button
          text="Generate Image"
          flex
          leftIcon={<AutoAwesome />}
          isLoading={generateImageLoading}
          isDisabled={post.prompt === ""}
          onClick={() => generateImageFun()}
        />
      </Actions>
    </Form>
  );
};

export default GenerateImageForm;