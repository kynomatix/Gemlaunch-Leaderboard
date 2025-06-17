import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Controller } from 'react-hook-form';
import { selecStyles } from '../ViewPrivateSale/constants';
import { SelectProps } from '../ViewPrivateSale/types';

const SelectFilter = ({ label, options, control, name }: SelectProps) => {
    return (
        <Box sx={{ minWidth: 120, width: '100%' }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label" sx={{ color: '#ffffff' }}>
                    {label}
                </InputLabel>
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            fullWidth
                            sx={selecStyles}
                            labelId="demo-simple-select-label"
                            label={label}
                            MenuProps={{
                                disableScrollLock: true,
                            }}
                        >
                            {options.map((x) => (
                                <MenuItem key={x.id} value={x.val}>
                                    {x.lab}
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                />
            </FormControl>
        </Box>
    );
};

export default SelectFilter;
