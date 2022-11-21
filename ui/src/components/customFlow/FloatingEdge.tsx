// from: https://reactflow.dev/docs/examples/edges/floating-edges/ and https://www.npmjs.com/package/@tisoap/react-flow-smart-edge

import React, { FC, useMemo, CSSProperties } from 'react';
import { EdgeProps, useStore, ReactFlowState } from 'reactflow';
import { BezierEdge } from 'react-flow-renderer';
import styled from 'styled-components';
import { getSmartEdge } from '@tisoap/react-flow-smart-edge';

import { getEdgeParams } from './utils';
import { RunStepInfo } from '../../api/Step';
import { getColorIdFromStatus } from '../StatusIcon';

const nodeSelector = (s: ReactFlowState) => s.nodeInternals;

export interface FloatingEdgeData {
    runStepInfo: RunStepInfo;
}

export const FloatingEdge: FC<EdgeProps<FloatingEdgeData>> = (props) => {
    const { id, source, target, data, style, markerStart, markerEnd } = props;

    const nodeInternals = useStore(nodeSelector);
    const sourceNode = useMemo(() => nodeInternals.get(source), [source, nodeInternals]);
    const targetNode = useMemo(() => nodeInternals.get(target), [target, nodeInternals]);
    if (!sourceNode || !targetNode) {
        return <BezierEdge {...props} />;
    }
    const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

    const nodes = [...nodeInternals.values()];
    const getSmartEdgeResponse = getSmartEdge({
        sourceX: sx,
        sourceY: sy,
        sourcePosition: sourcePos,
        targetPosition: targetPos,
        targetX: tx,
        targetY: ty,
        nodes,
        options: {
            nodePadding: 40,
            gridRatio: 10,
        },
    });
    if (getSmartEdgeResponse === null) {
        return <BezierEdge {...props} />;
    }
    const { svgPathString } = getSmartEdgeResponse;

    return (
        <g className="react-flow__connection">
            <ColorPath
                runStepInfo={data?.runStepInfo}
                id={id}
                className="react-flow__edge-path"
                d={svgPathString}
                markerEnd={markerEnd}
                markerStart={markerStart}
                style={style as CSSProperties}
            />
        </g>
    );
};

const ColorPath = styled.path<{ runStepInfo?: RunStepInfo }>`
    stroke: ${({ theme, runStepInfo }) =>
        theme.color[getColorIdFromStatus(runStepInfo?.status)]};
    stroke-width: 4;
`;
