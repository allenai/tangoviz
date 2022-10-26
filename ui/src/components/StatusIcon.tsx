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
        case 'not started': {
            return <FieldTimeOutlined />;
        }
        case 'running': {
            return <LoadingOutlined />;
        }
        case 'completed': {
            return <Completed />;
        }
        case 'failed': {
            return <Failed />;
        }
        case 'uncacheable': {
            return <Uncacheable />;
        }
        default: {
            return <span></span>;
        }
    }
};

const Completed = styled(CheckSquareOutlined)`
    color: ${({ theme }) => theme.color.G6};
`;

const Failed = styled(WarningOutlined)`
    color: ${({ theme }) => theme.color.O6};
`;

const Uncacheable = styled(QuestionCircleOutlined)`
    color: ${({ theme }) => theme.color.R6};
`;
