import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import codeTheme from 'react-syntax-highlighter/dist/esm/styles/prism/material-dark';
import cls from 'classnames';
import { CodeProps } from 'react-markdown/lib/ast-to-react';
import CopyToClipboard from 'react-copy-to-clipboard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import { grey } from '@mui/material/colors';

import { MSG, MSG_LEVEL } from '../isomorphic/consts';
import styles from './CodeBlock.module.less';

export default function CodeBlock(props: CodeProps) {
  const [copyHover, setCopyHover] = useState(false);
  const { node, inline, className, children, ...rests } = props;
  const match = /language-(\w+)/.exec(className || '') || 'shell';
  return !inline && match ? (
    <div
      className={styles.codeBlockContainer}
      onMouseOver={() => {
        setCopyHover(true);
      }}
      onMouseLeave={() => {
        setCopyHover(false);
      }}
    >
      <SyntaxHighlighter
        {...rests}
        children={String(children).replace(/\n$/, '')}
        style={codeTheme}
        language={match[1]}
        PreTag="div"
      />
      <CopyToClipboard
        text={String(children).replace(/\n$/, '')}
        onCopy={() => {
          vscode.postMessage({
            type: MSG.showInfo,
            message: {
              message: 'Copied to clipboard',
              level: MSG_LEVEL.info,
            }
          });
        }}
      >
        <IconButton  
          aria-label="copy"
          size="small"
          className={cls(styles.contentCopyIBtn, copyHover ? styles.show : '')}
        >
          <ContentCopyIcon fontSize="inherit" sx={{ color: grey['A700'] }} />
        </IconButton>
      </CopyToClipboard>
    </div>
  ) : (
    <div className={cls(styles.normalCode, String(children).split('\n').length > 1? styles.multiline : '')}>
      <code {...rests} className={className}>
        {children}
      </code>
    </div>
  );
}
