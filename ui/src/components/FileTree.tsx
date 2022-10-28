import React from 'react';
import { Tree, Button } from 'antd';
import type { DataNode } from 'antd/es/tree';

import { getArtifact } from '../api/Api';

export interface Props {
    data: { [file: string]: number };
    wsid: string;
    className?: string;
}

export const FileTree = ({ data, wsid, className }: Props) => {
    /*
        converting this:
        {
            '/sqlite/test': 1650001,
            '/sqlite/train': 16440001,
            '/sqlite/val': 987001,
            '/logs/pass1': 165001,
            '/logs/pass2': 260001
        }
        to:
        {
            "logs": {
                "title": "logs",
                "children": {
                "pass1": {
                    "title": "pass1",
                    "children": {},
                    "size": 165001
                },
                "pass2": {
                    "title": "pass2",
                    "children": {},
                    "size": 260001
                }
                }
            },
            "sqlite": {
                "title": "sqlite",
                "children": {
                "test": {
                    "title": "test",
                    "children": {},
                    "size": 1650001
                },
                "train": {
                    "title": "train",
                    "children": {},
                    "size": 16440001
                },
                "val": {
                    "title": "val",
                    "children": {},
                    "size": 987001
                }
                }
            }
        }
    */
    type TreeDataAsDicType = {
        [name: string]: {
            title: string;
            fullPath: string;
            size?: number;
            children: TreeDataAsDicType;
        };
    };
    const treeDataAsDic: TreeDataAsDicType = {};
    Object.keys(data).forEach((k) => {
        const split = k.split('/').filter((v) => v.length);
        let curParent = treeDataAsDic;
        split.forEach((s, i) => {
            if (curParent[s] == null) {
                curParent[s] = { title: s, fullPath: k, children: {} };
            }
            if (i < split.length - 1) {
                curParent = curParent[s].children!;
            } else {
                curParent[s].size = data[k];
            }
        });
    });

    const toTree = (dic: TreeDataAsDicType): DataNode[] => {
        return Object.keys(dic).map((k) => {
            const obj = dic[k];
            return {
                title: obj.size ? (
                    <span>
                        <Button
                            type="link"
                            onClick={() => getArtifact(k, wsid, btoa(obj.fullPath))}>
                            {k}
                        </Button>{' '}
                        (
                        {(obj.size / 1000000).toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 0,
                        })}{' '}
                        MB)
                    </span>
                ) : (
                    k
                ),
                key: k,
                children: toTree(obj.children),
            };
        });
    };

    const treeData: DataNode[] = toTree(treeDataAsDic);

    return (
        <Tree
            className={className}
            selectable={false}
            defaultExpandAll={true}
            treeData={treeData}
        />
    );
};
