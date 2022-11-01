import React, { useCallback } from 'react';
import ReactFlow, {
    Controls,
    ControlButton,
    Background,
    MiniMap,
    useNodesState,
    useEdgesState,
    Node,
    Edge,
    Position,
} from 'reactflow';
import {
    DeleteColumnOutlined ,
    DeleteRowOutlined ,
} from '@ant-design/icons';
import dagre from 'dagre';

import 'reactflow/dist/style.css';

const position = { x: 0, y: 0 };
const edgeType = 'smoothstep';
const edgeStyle = { strokeWidth: 4 };

const initialNodes = [
    {
        id: '1',
        type: 'input',
        data: { label: 'input' },
        position,
    },
    {
        id: '2',
        data: { label: 'node 2' },
        position,
    },
    {
        id: '2a',
        data: { label: 'node 2a' },
        position,
    },
    {
        id: '2b',
        data: { label: 'node 2b' },
        position,
    },
    {
        id: '2c',
        data: { label: 'node 2c' },
        position,
    },
    {
        id: '2d',
        data: { label: 'node 2d' },
        position,
    },
    {
        id: '3',
        data: { label: 'node 3' },
        position,
    },
    {
        id: '4',
        data: { label: 'node 4' },
        position,
    },
    {
        id: '5',
        data: { label: 'node 5' },
        position,
    },
    {
        id: '6',
        type: 'output',
        data: { label: 'output' },
        position,
    },
    { id: '7', type: 'output', data: { label: 'output' }, position },
];

const initialEdges = [
    { id: 'e12', source: '1', target: '2', type: edgeType, animated: true, style: edgeStyle },
    { id: 'e13', source: '1', target: '3', type: edgeType, animated: true, style: edgeStyle },
    { id: 'e22a', source: '2', target: '2a', type: edgeType, animated: true, style: edgeStyle },
    { id: 'e22b', source: '2', target: '2b', type: edgeType, animated: true, style: edgeStyle },
    { id: 'e22c', source: '2', target: '2c', type: edgeType, animated: true, style: edgeStyle },
    { id: 'e2c2d', source: '2c', target: '2d', type: edgeType, animated: true, style: edgeStyle },
    { id: 'e45', source: '4', target: '5', type: edgeType, animated: true, style: edgeStyle },
    { id: 'e56', source: '5', target: '6', type: edgeType, animated: true, style: edgeStyle },
    { id: 'e57', source: '5', target: '7', type: edgeType, animated: true, style: edgeStyle },
];

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node: Node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge: Edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node: Node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = (isHorizontal ? 'left' : 'top') as Position;
        node.sourcePosition = (isHorizontal ? 'right' : 'bottom') as Position;

        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };

        return node;
    });

    return { nodes, edges };
};

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    initialNodes,
    initialEdges
);

interface Props {
    workspaceId?: string;
    secondaryId?: string;
}

export const Flow = ({ workspaceId, secondaryId }: Props) => {
    const [nodes, setNodes] = useNodesState(layoutedNodes);
    const [edges, setEdges] = useEdgesState(layoutedEdges);

    const onLayout = useCallback(
        (direction: string) => {
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
                nodes,
                edges,
                direction
            );

            setNodes([...layoutedNodes]);
            setEdges([...layoutedEdges]);
        },
        [nodes, edges]
    );
    return (
        <div>
            <div style={{ width: '100%', height: '600px' }}>
                <ReactFlow nodes={nodes} edges={edges} fitView>
                    <Background />
                    <Controls showInteractive={false}>
                    <ControlButton onClick={() => onLayout('LR')}>
                        <DeleteRowOutlined  rotate={180}/>
                    </ControlButton>
                    <ControlButton onClick={() => onLayout('TB')}>
                        <DeleteColumnOutlined rotate={180}/>
                    </ControlButton>
                    </Controls>
                    <MiniMap />
                </ReactFlow>
            </div>
        </div>
    );
};
