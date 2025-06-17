import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface Props {
    label: string;
    properties: string[];
}

export default function ViewPoolSelect({ label, properties }: Props) {
    const [property, setValue] = React.useState(properties[0]);

    const handleChange = (event: SelectChangeEvent) => {
        setValue(event.target.value as string);
    };

    return (
        <Box sx={{ minWidth: 120, width: '100%' }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label" sx={{ color: '#ffffff' }}>
                    {label}
                </InputLabel>
                <Select
                    MenuProps={{
                        disableScrollLock: true,
                    }}
                    fullWidth
                    sx={{
                        width: '100%',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#22CDA6',
                        },
                        '.MuiSvgIcon-root ': {
                            fill: 'white !important',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                        },
                        '& .SelectOptionsDropDown::placeholder': {
                            color: 'red',
                        },
                    }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={property}
                    label={label}
                    onChange={handleChange}
                >
                    {properties.map((item, idx) => (
                        <MenuItem key={idx} value={item}>
                            {item}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}
