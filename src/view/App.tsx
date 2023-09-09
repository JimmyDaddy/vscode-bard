
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/InputBase';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";
import SendIcon from '@mui/icons-material/Send';
import Paper from '@mui/material/Paper';
import styles from './App.module.less';

function renderRow(props: ListChildComponentProps) {
  const { index, style } = props;

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemText primary={`Item ${index + 1}`} />
    </ListItem>
  );
}

function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setMessage(event.target.value);
  }

  function onCLick() {
    vscode.postMessage({ type: 'sendMessage', message });
  }

  window.addEventListener('message', (event) => {
    const message = event.data;
    if (message.type === 'showResponse') {
      setResponse(message.message);
    }
  });

  return (
    <div className={styles.container}>
      <h1>bard chat</h1>
      <Box
        sx={{ width: '100vw', height: '85vh' }}
      >
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              height={height}
              width={width}
              itemSize={46}
              itemCount={200}
              overscanCount={5}
            >
              {renderRow}
            </FixedSizeList>
          )}
        </AutoSizer>
      </Box>
      <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
      >
        <Input 
          id="message"
          placeholder="Ask bard here"
          onChange={onChange}
          className={styles.input}
          multiline
          required
        />
        <IconButton onClick={onCLick} color='primary'>
          <SendIcon />
        </IconButton>
      </Paper>
      <ReactMarkdown>{response || ''}</ReactMarkdown>
    </div>
  );
}
export default App;

