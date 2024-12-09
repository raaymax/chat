import styled from 'styled-components';
import { Button } from '../atoms/Button';
import { useRouteError } from 'react-router-dom';
import { ApiError } from '../../core';
import { PageNotFoundError } from '../errors';

const Container = styled.div`
  color: ${({ theme }) => theme.Text};
  width: 100%;
  height: 100%;
  min-height: 600px;
  overflow: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 36px;

  .image {
    flex: 0 0 400px;
    position: relative;
    height: 400px;
    img{
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%) translateX(-20px);
    }
  }
  .title {
    color: #FFF;
    text-align: center;
    leading-trim: both;
    text-edge: cap;
    font-size: 128px;
    font-style: normal;
    font-weight: 400;
    line-height: 128px;
  }
  .message {
    color: ${({ theme }) => theme.Text};
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 150% */
  }
  .action {
    text-align: center;
    margin: 24px 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .retry-button {
    margin: auto;
    padding: 11px 32px;
  }
  .back-button {
    margin: auto;
    padding: 11px 32px;
  }

  .spacer {
    flex: 1;
  }

`;

type ErrorPageProps = {
  title?: string;
  debug?: any;
  buttons?: ('retry' | 'back')[];
}

export const ErrorPage = ({title, debug, buttons=['back']}: ErrorPageProps) => {
  return (
    <Container>
      <div className="image">
        <img src="/error.svg" alt='' />
      </div>

      <div className="spacer" />

      <div className="title">
        {title ?? 'Oops!'}
      </div>

      <div className="message">
        That means something went wrong,<br />
        would you like to take a step back?
      </div>

      <div className="action">
        {buttons?.includes('retry') 
          && <Button className="retry-button" onClick={() => document.location.reload()}>Try again</Button>}
        {buttons?.includes('back') 
          && <Button className="back-button" type="primary" onClick={() => window.history.back()}>Take me back</Button>}
      </div>
      <div className="spacer" />
      {debug && <div className="debug-info">
        <pre>
          {JSON.stringify(debug, null, 2)}
        </pre>
      </div>}
    </Container>
  );
}

export const ErrorPageS = () => {
  let error = useRouteError();
  if (error instanceof PageNotFoundError) {
    return <ErrorPage 
      title="404"
      buttons={['back']} />;
  }
    
  if (error instanceof ApiError) {
    if(error.status === 404) {
      return <ErrorPage 
        title="404" 
        buttons={['retry']} />;
    }
    return <ErrorPage 
      title={error.status.toString()}
      debug={{
        message: error.message,
        url: error.url,
        stack: error.stack,
        payload: error.payload
      }} 
      buttons={['retry', 'back']} />;
  }
  if (error instanceof Error) {
    return <ErrorPage 
      debug={{
        message: error.message,
        stack: error.stack
      }} 
      buttons={['back']} />;
  }
  return <ErrorPage buttons={['back']}/>;
}
