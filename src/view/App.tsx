
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Input from '@mui/material/InputBase';
import Select from '@mui/material/NativeSelect';
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesomeSharp';
import DeleteIcon from '@mui/icons-material/Delete';
import List from 'react-virtualized/dist/commonjs/List';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import CellMeasurer, { CellMeasurerCache } from 'react-virtualized/dist/commonjs/CellMeasurer';
import { grey } from '@mui/material/colors';

import logger from '../isomorphic/logger';
import { uid } from '../isomorphic/utils';
import { MSG } from '../isomorphic/consts';

import styles from './App.module.less';

function Row(props: {
  index: number,
  style: any,
  data: BardMessage,
  measure: any,
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

  const handleCHange = (event: any) => {
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
        <div
          className={styles.person}
        >
          <Avatar sx={{ width: 30, height: 30 }}>
            <AccountCircleIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <span className={styles.name}>You</span>
          <div
            className={`${styles.deleteContainer} ${deleteHover? '' : styles.hidden}`} 
          >
            <IconButton aria-label="delete" size="small" onClick={deleteMsg}>
              <DeleteIcon fontSize="inherit" sx={{ color: grey['A700'] }} />
            </IconButton>
          </div>
        </div>
        <div className={styles.content}>
          <ReactMarkdown>{curData.ask || ''}</ReactMarkdown>
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
                  onChange={handleCHange}
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
          <ReactMarkdown key={`${index}response`}>{`${response?.response || ''}`}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [data, setData] = useState<BardMessage[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [latestWidth, setLatestWidth] = useState(0);
  const list = useRef<any>(null);

  const _cache = new CellMeasurerCache({
    minHeight: 50,
  });

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setMessage(event.target.value);
  }

  useEffect(() => {
    logger.debug(data, 'data changed');
    list.current?.recomputeRowHeights();
    list.current?.scrollToRow(data.length);
  }, [data]);

  function onCLick() {
    if (!message) {
      return;
    }
    setLoading(true);
    const msgUid = uid();
    setData(data.concat({
      uid: msgUid,
      ask: message,
      responses: [{
        response: 'Thinking....',
        prompt: message,
      }],
      isTemp: true,
    }));
    vscode.postMessage({ 
      type: 'sendMessage', 
      message: {
        prompt: message,
        uid: msgUid,
      },
    });
  }

  const renderRow = ({ index, key, style, parent }: any) => {
    return (
      <CellMeasurer
        cache={_cache}
        columnIndex={0}
        key={key}
        rowIndex={index}
        parent={parent}
      >
        {({ measure }) => (
          <Row
            index={index}
            style={style}
            data={data[index]}
            measure={measure}
          />
        )}
      </CellMeasurer>
    );
  };

  window.addEventListener('message', (event) => {
    const msgData = event.data;
    logger.debug(msgData, event, 'msgData');
    if (msgData.type === MSG.showResponse) {
      setData(data.filter(d => !d.isTemp).concat(JSON.parse(msgData.data)));
      setLoading(false);
      setMessage('');
      return;
    }

    if (msgData.type === MSG.deleteMessageSuccess) {
      setData(data.filter(d => d.uid !== JSON.parse(msgData.data).uid).concat([]));
      return;
    }

    if (msgData.type === MSG.initData) {
      setData(JSON.parse(msgData.data));
    }
  });

  const handleKeyDown = (event: any) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      onCLick();
      event.preventDefault();
    }
  };

  return (
    <div className={styles.container}>
      <Box
        sx={{ height: '94vh' }}
      >
        <AutoSizer>
          {({ height, width }) => {
            if (latestWidth && latestWidth !== width) {
              _cache.clearAll();
              list.current?.recomputeRowHeights();
            }
            setLatestWidth(width);
            return (
              <List
                deferredMeasurementCache={_cache}
                height={height}
                overscanRowCount={10}
                rowCount={data.length}
                rowHeight={_cache.rowHeight}
                rowRenderer={renderRow}
                width={width}
                ref={list}
              />
            );
          }}
        </AutoSizer>
      </Box>
      <div className={styles.inputContainer}>
        <Input 
          id="message"
          placeholder="Ask bard here"
          onChange={onChange}
          className={styles.input}
          value={message}
          onKeyDown={handleKeyDown}
          multiline
        />
        <IconButton onClick={onCLick} disabled={loading} >
          {
            loading ? <CircularProgress size={24} color='inherit'/> : <SendIcon />
          }
        </IconButton>
      </div>
    </div>
  );
}
export default App;

