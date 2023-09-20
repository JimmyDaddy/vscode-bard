import React, { useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesomeSharp';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplayIcon from '@mui/icons-material/Replay';
import Select from '@mui/material/NativeSelect';
import ReactMarkdown from 'react-markdown';
import { grey } from '@mui/material/colors';

import styles from "./Conversation.module.less";
import { MSG } from "../isomorphic/consts";
import CodeBlock from './CodeBlock';

export default function Conversation(props: {
  index: number,
  style: any,
  data: BardMessage,
  measure: any,
  onRetry: any,
}) {
  const { index, data: curData } = props;
  const [response, setResponse] = useState<BardResponse | undefined>(curData?.responses?.[0]);
  const [deleteHover, setDeleteHover] = useState(false);
  if (!curData) {
    return null;
  }

  useEffect(() => {
    props.measure?.();
  }, []);

  useEffect(() => {
    setResponse(curData.responses?.[0]);
  }, [curData]);

  useEffect(() => {
    props.measure?.();
  }, [response]);

  const handleChange = (event: any) => {
    const value = event?.target?.value as string;
    const response = curData?.responses?.find((response: BardResponse) => response.prompt === value);
    if (response) {
      setResponse(response);
    }
  };

  function deleteMsg() {
    vscode.postMessage({ 
      type: MSG.deleteMessage, 
      message: {
        uid: curData.uid,
      },
    });
  }

  function retry() {
    props.onRetry?.();
    vscode.postMessage({ 
      type: MSG.sendMessage, 
      message: {
        prompt: curData.ask,
        uid: curData.uid,
      },
    });

    setResponse({
      prompt: curData.ask as string,
      response: 'Thinking....',
    });
  }

  return (
    <div key={index} className={styles.conversationContainer} style={props.style}>
      <div
        className={styles.contentContainer}
        onMouseOver={() => {
          setDeleteHover(true);
        }}
        onMouseLeave={() => {
          setDeleteHover(false);
        }}
      >
        <div className={styles.person}>
          <Avatar sx={{ width: 30, height: 30 }}>
            <AccountCircleIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <span className={styles.name}>You</span>
          <div
            className={`${styles.deleteContainer} ${deleteHover? '' : styles.hidden}`} 
          >
            <IconButton aria-label="delete" size="small" onClick={retry}>
              <ReplayIcon fontSize="inherit" sx={{ color: grey['A700'] }} />
            </IconButton>
            <IconButton aria-label="delete" size="small" onClick={deleteMsg}>
              <DeleteIcon fontSize="inherit" sx={{ color: grey['A700'] }} />
            </IconButton>
          </div>
        </div>
        <div className={styles.content}>
          <ReactMarkdown>
            {curData.ask || ''}
          </ReactMarkdown>
        </div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.person}>
          <Avatar sx={{ width: 30, height: 30 }}>
            <AutoAwesomeIcon />
          </Avatar>
          <span className={styles.name}>Bard</span>
          {
            curData.responses?.length !== undefined && curData.responses?.length > 1 && (
              <div className={styles.promptSelectContainer}>
                <Select
                  id={`prompt-selector-${index}`}
                  value={response?.prompt}
                  onChange={handleChange}
                  variant='standard'
                  className={styles.promptSelectRoot}
                  classes={{
                    standard: styles.promptSelect,
                  }}
                >
                  {curData.responses?.map((response: BardResponse, index: number) => (
                    <option
                      key={`${response.prompt}${index}response`}
                      value={response.prompt}
                    >
                      {response.prompt}
                    </option>
                  ))}
                </Select>
            </div>
            )
          }
        </div>
        <div className={styles.responseContainer}>
          <ReactMarkdown
            key={`${index}response`}
            children={`${response?.response || ''}`}
            components={{
              code(props) {
                return <CodeBlock {...props }/>;
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
