import React, { useRef } from 'react';
import { Box, TextField } from '@mui/material';

interface CellProps {
  value: number;
  isInitial: boolean;
  hasError: boolean;
  sameValue: boolean;
  highlight: boolean;
  onTextFieldChange: (newValue: string) => void;
  borderRight: string;
  borderBottom: string;
  isSelectedCell: boolean;
  setSelectedCell: () => void;
}

const Cell: React.FC<CellProps> = ({
  value,
  isInitial,
  hasError,
  sameValue,
  highlight,
  onTextFieldChange,
  borderRight,
  borderBottom,
  isSelectedCell,
  setSelectedCell
}) => {
  const textFieldRef = useRef<HTMLInputElement | null>(null);

  return (
    <Box
      onClick={() => {
        setSelectedCell()
        if (textFieldRef.current) {
          textFieldRef.current.focus()
        }
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        border: '1px solid #ccc',
        boxSizing: 'border-box',
        backgroundColor:
          hasError ? '#f2c3b9' : 
          sameValue ? '#CACACA' :
          isSelectedCell ? '#CACACA' :
          highlight ? '#EEE' :
          'white',

        '& input': {
          textAlign: 'center',
          padding: 0,
          width: '100%',
          height: '100%',
          fontSize: isInitial ? '120%' : 'inherit',
          fontWeight: isInitial ? 'bold' : 'inherit',
        },

        transition: 'background-color 0.3s ease', // Smooth transition for background color change
        borderRight,
        borderBottom,
        cursor: 'pointer',
      }}
    >
      <TextField
        inputRef={textFieldRef}
        variant="standard"
        value={value !== 0 ? value : ''}
        onChange={(e) => onTextFieldChange(e.target.value)}
        slotProps={{
          input: { disableUnderline: true },
          htmlInput: { maxLength: 1, disabled: isInitial }
        }}
        sx={{
          cursor: 'pointer',
          pointerEvents: 'none'
        }}
      />
    </Box>
  );
};

export default Cell;
