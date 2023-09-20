
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/InputBase';
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';
import List from 'react-virtualized/dist/commonjs/List';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import CellMeasurer, { CellMeasurerCache } from 'react-virtualized/dist/commonjs/CellMeasurer';

import { uid, debounce } from '../isomorphic/utils';
import { MSG } from '../isomorphic/consts';
import Conversation from './Conversation';

import styles from './App.module.less';

function App() {
  const [data, setData] = useState<BardMessage[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [latestWidth, setLatestWidth] = useState(0);
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(-1);
  const list = useRef<any>(null);
  const inputRef = useRef<any>(null);

  const _cache = new CellMeasurerCache({
    minHeight: 50,
  });

  const onChange = useCallback(
    debounce(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
        setCurrentInputIndex(-1);
      }, 
      200
    ), []);

  useEffect(() => {
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
    if (!inputHistory.includes(message) && message && typeof message === 'string' && message.trim().length > 0) {
      setInputHistory(inputHistory.concat(message));
    }
    setCurrentInputIndex(-1);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    vscode.postMessage({ 
      type: MSG.sendMessage, 
      message: {
        prompt: message,
        uid: msgUid,
      },
    });
  }

  const retry = () => {
    setLoading(true);
  };

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
          <Conversation
            index={index}
            style={style}
            data={data[index]}
            measure={measure}
            onRetry={retry}
          />
        )}
      </CellMeasurer>
    );
  };

  const messageHandler = useCallback((event: any) => {
    const msgData = event.data;
    if (msgData.type === MSG.showResponse) {
      let newNonTempData = data.filter(d => !d.isTemp);
      const responseData = JSON.parse(msgData.data);
      const existIndex = data.findIndex((v) => v.uid === responseData.uid);
      if (existIndex === -1) {
        newNonTempData = newNonTempData.concat([responseData]);
      } else {
        newNonTempData[existIndex] = responseData;
      }
      setData(newNonTempData);
      setLoading(false);
      setMessage('');  
      return;
    }

    if (msgData.type === MSG.deleteMessageSuccess) {
      setData(data.filter(d => d.uid !== JSON.parse(msgData.data).uid).concat([]));
      return;
    }

    if (msgData.type === MSG.initData) {
      const d = JSON.parse(msgData.data) || {};
      setData(d.conversations || []);
      setInputHistory(d.promptHistory || []);
    }
  }, [data]);

  useEffect(() => {
    window.addEventListener('message', messageHandler);
    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, [data]);

  const handleKeyDown = (event: any) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      onCLick();
      event.preventDefault();
    } else if (event.keyCode === 38) {
      const index = currentInputIndex === -1? inputHistory.length - 1 : currentInputIndex - 1;
      if (index >= 0 && inputHistory[index]) {
        setMessage(inputHistory[index]);
        if (inputRef.current) {
          inputRef.current.value = inputHistory[index];
        }
        setCurrentInputIndex(index);
      }
      event.preventDefault();
    } else if (event.keyCode === 40) {
      if (currentInputIndex === -1 || currentInputIndex === inputHistory.length - 1) {
        return;
      }
      const index = currentInputIndex + 1;
      if (index < inputHistory.length && inputHistory[index]) {
        setMessage(inputHistory[index]);
        if (inputRef.current) {
          inputRef.current.value = inputHistory[index];
        }
        setCurrentInputIndex(index);
      }
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
          defaultValue={message}
          onKeyDown={handleKeyDown}
          multiline
          inputRef={inputRef}
          disabled={loading}
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
