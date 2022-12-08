import React from 'react';
import styled from 'styled-components';
import {
    FieldTimeOutlined,
    LoadingOutlined,
    CheckSquareOutlined,
    WarningOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons';

import type { Status } from '../api/Status';

export interface Props {
    status: Status;
}

export const StatusIcon = ({ status }: Props) => {
    switch (status) {
        case 'incomplete': {
            return (
                <Colored status={status}>
                    <FieldTimeOutlined />
                </Colored>
            );
        }
        case 'running': {
            return (
                <Colored status={status}>
                    <LoadingOutlined />
                </Colored>
            );
        }
        case 'completed': {
            return (
                <Colored status={status}>
                    <CheckSquareOutlined />
                </Colored>
            );
        }
        case 'failed': {
            return (
                <Colored status={status}>
                    <WarningOutlined />
                </Colored>
            );
        }
        case 'uncacheable': {
            return (
                <Colored status={status}>
                    <QuestionCircleOutlined />
                </Colored>
            );
        }
        default: {
            return <></>;
        }
    }
};

export const getColorIdFromStatus = (status?: Status): string => {
    switch (status) {
        case 'incomplete': {
            return 'O8';
        }
        case 'running': {
            return 'B6';
        }
        case 'completed': {
            return 'G8';
        }
        case 'failed': {
            return 'R8';
        }
        case 'uncacheable': {
            return 'N9';
        }
        default: {
            return 'N9';
        }
    }
};

export const StatusIconWithLabel = ({ status }: Props) => {
    return (
        <StatusContainer>
            <StatusIcon status={status} />
            {status}
        </StatusContainer>
    );
};

export const StatusContainer = styled.span`
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.sm};
    align-items: center;
`;

const Colored = styled.span<{ status: Status }>`
    color: ${({ theme, status }) => theme.color[getColorIdFromStatus(status)]};
`;
