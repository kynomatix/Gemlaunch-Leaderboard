'use client';

import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import images from '@/public/assets/images/images';
import { Status } from '../ExploreAirdrops/StatusChip';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import LoadingTabs from './LoadingTabs';
import LaunchPadsTabs from './LaunchPadTabs';
import { useGetAllLaunchpads } from '@/hooks/useGetAllLaunchpads';
import { GET_ALL_LAUNCHPADS } from './query';
import { OperationVariables, useQuery } from '@apollo/client';
import { QueryData, SearchFormInput } from './types';
import { Tabs, TextField } from '@mui/material';
import TabLabel from '../TabLabel/TabLabel';
import AllLaunchpads from './AllLaunchpads';
import { Controller, useForm } from 'react-hook-form';
import debounce from 'lodash/debounce';
import CustomTabPanel from '../CustomTabPanel/CustomTabPanel';
import SelectFilter from '../SelectFilter/SelectFilter';
import { a11yProps } from '@/utils/a11Props';
import { filterByOptions, sortByOptions } from './constant';
import MyLaunchpads from './MyLaunchpads';

const filterWrapper = {
    width: { xs: '100%', sm: 'auto' },
    display: 'flex',
    alignItems: 'center',
    gap: '25px',
    flexWrap: { xs: 'wrap', sm: 'nowrap' },
};

const searchWrapper = {
    mt: '20px',
    display: 'flex',
    alignItems: { xs: 'flex-start', sm: 'center' },
    gap: '25px',
    flexDirection: { xs: 'column', sm: 'row' },
};

export default function ViewPoolTabs() {
    const [value, setValue] = React.useState(0);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState<string>();

    const isMobile = useMediaQuery('(max-width:500px)');
    const { chainId } = useActiveChainId();

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

        // cleanup function to prevent memory leaks
        return () => {
            debounceSearch.cancel();
        };
    }, [searchTerm]);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
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
                    <TabLabel label="All Launchpads" {...a11yProps(0)} />
                    <TabLabel label="My Launchpads" {...a11yProps(1)} />
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
                <AllLaunchpads
                    searchTerm={debouncedSearchTerm}
                    filterBy={filterBy}
                    sortBy={sortBy}
                />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <MyLaunchpads
                    searchTerm={debouncedSearchTerm}
                    filterBy={filterBy}
                    sortBy={sortBy}
                />
            </CustomTabPanel>
        </>
    );
}
