import React from 'react';
import styled from 'styled-components';
import { HomeOutlined, RightOutlined } from '@ant-design/icons';

interface Props {
    workspaceId?: string;
    secondaryId?: string;
}

export const Breadcrumb = ({ workspaceId, secondaryId }: Props) => {
    if (!workspaceId) {
        return <></>;
    }
    return (
        <Container>
            <a href={`/`}>
                <HomeOutlined />
            </a>
            <span>
                {' '}
                <RightOutlined />{' '}
            </span>
            {secondaryId ? (
                <>
                    <a href={`/workspace/${workspaceId}`}>{atob(workspaceId)}</a>
                    <span>
                        {' '}
                        <RightOutlined />{' '}
                    </span>
                    {atob(secondaryId)}
                </>
            ) : (
                <span>{atob(workspaceId)}</span>
            )}
        </Container>
    );
};

const Container = styled.span`
    font-size: ${({ theme }) => theme.typography.h4.fontSize};
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.xs};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;
