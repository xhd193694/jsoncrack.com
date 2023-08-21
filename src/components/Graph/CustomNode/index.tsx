import React from "react";
import dynamic from "next/dynamic";
import { NodeProps } from "reaflow";
import useGraph from "src/store/useGraph";
import useModal from "src/store/useModal";
import { NodeData } from "src/types/models";
import { ObjectNode } from "./ObjectNode";
import { TextNode } from "./TextNode";

const Node = dynamic(() => import("reaflow").then(r => r.Node), {
  ssr: false,
});

export interface CustomNodeProps {
  node: NodeData;
  x: number;
  y: number;
  hasCollapse?: boolean;
}

const rootProps = {
  rx: 50,
  ry: 50,
};

const CustomNodeWrapper = (nodeProps: NodeProps<NodeData["data"]>) => {
  const data = nodeProps.properties.data;
  const setSelectedNode = useGraph(state => state.setSelectedNode);
  const setVisible = useModal(state => state.setVisible);

  const handleNodeClick = React.useCallback(
    (_: React.MouseEvent<SVGGElement, MouseEvent>, data: NodeData) => {
      if (setSelectedNode) setSelectedNode(data);
      setVisible("node")(true);
    },
    [setSelectedNode, setVisible]
  );

  return (
    <Node
      {...nodeProps}
      {...(data?.isEmpty && rootProps)}
      onClick={handleNodeClick as any}
      animated={false}
      label={null as any}
    >
      {({ node, x, y }) => {
        if (Array.isArray(nodeProps.properties.text)) {
          if (data?.isEmpty) return null;
          return <ObjectNode node={node as NodeData} x={x} y={y} />;
        }

        return <TextNode node={node as NodeData} hasCollapse={!!data?.childrenCount} x={x} y={y} />;
      }}
    </Node>
  );
};

export const CustomNode = React.memo(CustomNodeWrapper);
