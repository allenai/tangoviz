import React from 'react';
import { CaretRightOutlined, LoadingOutlined, WarningOutlined } from '@ant-design/icons';
import { Alert } from 'antd';

import { getCompliment } from '../api/compliments';

interface Props {
    dataType: string;
    loading?: boolean;
    error?: Error;
}

export const LoadingOrError = ({ dataType, loading, error }: Props) => {
    return (
        <>
            {loading ? (
                <Alert
                    type="warning"
                    message={
                        <span>
                            <LoadingOutlined /> Loading {dataType}... <CaretRightOutlined />{' '}
                            {getCompliment()}
                        </span>
                    }
                />
            ) : null}
            {error ? (
                <Alert
                    type="error"
                    message={
                        <span>
                            <WarningOutlined /> Error Loading {dataType}: {error.message}
                        </span>
                    }
                />
            ) : null}
        </>
    );
};
