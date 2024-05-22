import { FC, useCallback, useMemo, useState } from "react";
import { MessageCircleMore } from "lucide-react";
import {
  Background,
  Controls,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  Node,
} from "reactflow";
import MessageNode from "./components/MessageNode";
import Modal from "./components/Modal";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const App: FC = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  let [isOpen, setIsOpen] = useState(false);

  const nodeTypes = useMemo(() => ({ messageNode: MessageNode }), []);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  const onChangeNodeValue = useCallback((id: string, value: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, value } } : node
      )
    );
  }, []);

  const handleSubmit = useCallback(() => {
    const connectedNodeIds = new Set(
      edges.flatMap((edge) => [edge.source, edge.target])
    );
    const unconnectedNodes = nodes.filter(
      (node) => !connectedNodeIds.has(node.id)
    );

    if (unconnectedNodes.length > 0) {
      setIsOpen(true);
      return;
    }

    console.log("edges", edges);
    console.log("nodes", nodes);
  }, [edges, nodes]);

  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", "MessageNode");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const nodeType = e.dataTransfer.getData("text/plain");
      if (nodeType === "MessageNode") {
        const newNode: Node = {
          id: (nodes.length + 1).toString(),
          type: "messageNode",
          data: { value: "", onChange: onChangeNodeValue },
          position: { x: e.clientX, y: e.clientY },
        };
        setNodes((nds) => [...nds, newNode]);
      }
    },
    [nodes, onChangeNodeValue]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col font-inter">
      <header className="border-b p-2 px-4 flex items-center justify-end">
        <button
          onClick={handleSubmit}
          className="p-2 px-4 border-2 rounded-md text-sm font-medium text-blue-600 border-blue-600"
        >
          Save changes
        </button>
      </header>
      <main
        className="flex-1 flex"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <section className="flex-1">
          <ReactFlow
            style={{ height: "100%", width: "100%" }}
            nodes={nodes}
            onNodesChange={onNodesChange}
            edges={edges}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            onConnect={onConnect}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </section>
        <section className="w-[360px] border-l p-2 px-4">
          <div
            className="border-2 border-blue-600 p-2 px-4 text-sm rounded-md text-blue-600 flex flex-col gap-1 items-center w-[12rem] cursor-pointer"
            draggable
            onDragStart={handleDragStart}
          >
            <MessageCircleMore className="h-4 w-4" /> <span>Message</span>
          </div>
        </section>
      </main>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default App;
