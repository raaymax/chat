import {h } from 'preact';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  max-width: calc(100vw - 30px);
  flex-wrap: wrap;
`;

const Link = styled.div`
  flex: 0 0 300px;
  display: block;
  max-width: 300px;
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 3px;
  padding: 10px;  
  background-color: ${(props) => props.theme.backgroundColor};
  margin-bottom: 10px;
  margin-right: 10px;
  cursor: pointer;
  * {
    cusor: pointer;
  }  
  
  -- text should not be bigger than div and should be truncated
  div.text {
    width: 100%;
    height: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-wrap;
    
    
    
  
  }
  
  .image {
    width: 100%;
    height: 150px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(${(props) => props.image});
  }
  
  img {
    max-width: 100%;
    height: 150px;
  }
  &:hover {
    border-color: ${(props) => props.theme.borderColorHover};
  }
`;

export const LinkPreview = ({ link }) => (
  <Link className='link-preview' onClick={() => window.open(link.url, '_blank').focus()}
    image={link.images[0]}>
    {link.images?.length && <div className='image' />}
    <div className='text'>
      <h3>{link.siteName} - {link.title}</h3>
      <p>{link.description}</p>
    </div>
  </Link>
)

export const LinkPreviewList = ({links = []}) => (
  <Container>
    {links.map((link, key) => (
      <LinkPreview link={link} key={key} />
    ))}
  </Container>
)
