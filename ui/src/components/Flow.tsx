import React, { useCallback } from 'react';
import ReactFlow, {
    Controls,
    Background,
    MiniMap,
    useNodesState,
    useEdgesState,
    Node,
    Edge,
    Position,
} from 'reactflow';
import dagre from 'dagre';

import 'reactflow/dist/style.css';

import { CustomNode, CustomNodeData } from './customFlow/CustomNode';
import { FloatingEdge, FloatingEdgeData } from './customFlow/FloatingEdge';
import { RunStepSummary } from '../api/Step';

type MyNode = Node<CustomNodeData>;
type MyEdge = Edge<FloatingEdgeData>;

enum Orientation {
    LR = 'LR',
    TB = 'TB',
}

const nodeTypes = {
    customNode: CustomNode,
};

const edgeTypes = {
    floatingEdge: FloatingEdge,
};

const origin = { x: 0, y: 0 };
const pad = 50;
const nodeWidth = 300 + pad;
const nodeHeight = 50 + pad;
const nodeWidthExp = 300 + pad;
const nodeHeightExp = 300 + pad;

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: MyNode[], edges: MyEdge[], direction = Orientation.LR) => {
    const isHorizontal = direction === Orientation.LR;
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node: MyNode) => {
        dagreGraph.setNode(node.id, {
            width: node.data.isExpanded ? nodeWidthExp : nodeWidth,
            height: node.data.isExpanded ? nodeHeightExp : nodeHeight,
        });
    });

    edges.forEach((edge: MyEdge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node: MyNode) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = isHorizontal ? Position.Left : Position.Top;
        node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        node.position = {
            x: nodeWithPosition.x - (node.data.isExpanded ? nodeWidthExp : nodeWidth) / 2,
            y: nodeWithPosition.y - (node.data.isExpanded ? nodeHeightExp : nodeHeight) / 2,
        };

        return node;
    });

    return { nodes, edges };
};

interface Props {
    runStepSummaries: RunStepSummary[];
}

export const Flow = ({ runStepSummaries }: Props) => {
    const onExpand = (d: CustomNodeData) => {
        d.isExpanded = !d.isExpanded;
        onLayout(Orientation.LR); // todo: if we put back orientation, this need to be fixed
    };

    const initialNodes: MyNode[] = runStepSummaries.map((d) => {
        return {
            id: d.id,
            type: 'customNode',
            data: { runStepSummary: d, onExpand: onExpand },
            position: origin,
        };
    });
    const runStepSummaryDict: { [id: string]: RunStepSummary } = {};

    runStepSummaries.forEach((step) => {
        runStepSummaryDict[step.id] = step;
    });

    const initialEdges: MyEdge[] = [];
    runStepSummaries.forEach((step) => {
        step.dependencies.forEach((dep) => {
            initialEdges.push({
                id: `${step.id}_${dep}`,
                source: dep,
                target: step.id,
                type: 'floatingEdge',
                animated: true,
                data: { runStepSummary: runStepSummaryDict[dep] },
            });
        });
    });

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        initialNodes,
        initialEdges
    );

    const [nodes, setNodes] = useNodesState(layoutedNodes);
    const [edges, setEdges] = useEdgesState(layoutedEdges);

    const onLayout = useCallback(
        (direction: Orientation) => {
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
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    fitView
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}>
                    <Background />
                    <Controls showInteractive={false}>
                        {/* TODO: if we put this back, we ned to fix layout swap issues
                        <ControlButton onClick={() => onLayout(Orientation.LR)}>
                            <DeleteRowOutlined rotate={180} />
                        </ControlButton>
                        <ControlButton onClick={() => onLayout(Orientation.TB)}>
                            <DeleteColumnOutlined rotate={180} />
                        </ControlButton> */}
                    </Controls>
                    <MiniMap />
                </ReactFlow>
            </div>
        </div>
    );
};
