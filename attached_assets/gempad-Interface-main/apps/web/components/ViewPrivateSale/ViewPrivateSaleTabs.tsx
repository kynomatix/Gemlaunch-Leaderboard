'use client';

import React from 'react';
import CustomTabPanel from '../CustomTabPanel/CustomTabPanel';
import TabLabel from '../TabLabel/TabLabel';

import { Box, Grid, Tabs, TextField, useMediaQuery } from '@mui/material';
import { a11yProps } from '@/utils/a11Props';
import MyPrivateSales from './MyPrivateSales';
import MyContribution from './MyContribution';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { SearchFormInput } from './types';
import AllPrivateSales from './AllPrivateSales';
import SelectFilter from '../SelectFilter/SelectFilter';
import { filterByOptions, sortByOptions } from './constants';
import debounce from 'lodash/debounce';

const filterWrapper = {
    width: { xs: '100%', sm: 'auto' },
    display: 'flex',
    alignItems: 'center',
    gap: '25px',
    flexWrap: { xs: 'wrap', sm: 'nowrap' },
};

const searchWrapper = {
    mt: '23px',
    display: 'flex',
    alignItems: { xs: 'flex-start', sm: 'center' },
    gap: '25px',
    flexDirection: { xs: 'column', sm: 'row' },
    mb: '30px',
};

const ViewPrivateSaleTabs = () => {
    const isMobile = useMediaQuery('(max-width:500px)');
    const [value, setValue] = React.useState(0);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState<string>();

    const { control, watch } = useForm<SearchFormInput>({
        mode: 'onChange',
        defaultValues: {
            filterBy: 0,
            sortBy: 0,
            searchTerm: undefined,
        },
    });

    const searchTerm = watch('searchTerm');
    const filterBy = watch('filterBy');
    const sortBy = watch('sortBy');

    React.useEffect(() => {
        const debounceSearch = debounce(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        debounceSearch();

        return () => {
            debounceSearch.cancel();
        };
    }, [searchTerm]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: '#ffffff25' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    centered
                    variant={isMobile ? 'scrollable' : 'standard'}
                >
                    <TabLabel label="All Private Sales" {...a11yProps(0)} />
                    <TabLabel label="My Private Sales" {...a11yProps(1)} />
                    <TabLabel label="My Contributions" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <form>
                <Box sx={searchWrapper}>
                    <Controller
                        name="searchTerm"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="text"
                                fullWidth
                                placeholder="Enter token symbol"
                                InputProps={{
                                    sx: { borderRadius: '25px', border: '1px solid #7D7D7D' },
                                }}
                            />
                        )}
                    />
                    <Box sx={filterWrapper}>
                        <SelectFilter
                            control={control}
                            label="Filter by"
                            name="filterBy"
                            options={filterByOptions}
                        />
                        <SelectFilter
                            control={control}
                            name="sortBy"
                            label="Sort by"
                            options={sortByOptions}
                        />
                    </Box>
                </Box>
            </form>
            <CustomTabPanel value={value} index={0}>
                <AllPrivateSales
                    searchTerm={debouncedSearchTerm}
                    filterBy={filterBy}
                    sortBy={sortBy}
                />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <MyPrivateSales
                    searchTerm={debouncedSearchTerm}
                    filterBy={filterBy}
                    sortBy={sortBy}
                />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <MyContribution
                    searchTerm={debouncedSearchTerm}
                    filterBy={filterBy}
                    sortBy={sortBy}
                />
            </CustomTabPanel>
        </>
    );
};

export default ViewPrivateSaleTabs;
