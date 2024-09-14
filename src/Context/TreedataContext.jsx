import React, { createContext, useContext, useState } from 'react';

const TreeDataContext = createContext();

export const TreeDataProvider = ({ children }) => {
  const [treeData, setTreeData] = useState([]);
  const [relatedTree, setRelatedTree] = useState([]);

  // Function to add leaf node to treeData
  const addLeafNode = (parentKey, ...newNodes) => {
    setTreeData((prevData) => {
      const addNodes = (nodes) => {
        return nodes.map((node) => {
          if (node.key === parentKey) {
            const existingKeys = new Set((node.children || []).map((child) => child.key));
            // Filter out the new nodes that are already added (prevent recursion)
            const uniqueNewNodes = newNodes.filter((newNode) => !existingKeys.has(newNode.key));
  
            if (uniqueNewNodes.length > 0) {
              return {
                ...node,
                children: [
                  ...(node.children || []),
                  ...uniqueNewNodes,  // Add new unique nodes only once
                ],
              };
            }
            // If no unique nodes, return the node as-is
            return node;
          } else if (node.children) {
            return {
              ...node,
              children: addNodes(node.children), // Recursively check children
            };
          }
          return node;
        });
      };
  
      return addNodes(prevData);
    });
  };
  
  const addLeafNodeToRelatedTree = (parentKey, ...newNodes) => {
    setRelatedTree((prevData) => {
      const addNodes = (nodes) => {
        return nodes.map((node) => {
          if (node.key === parentKey) {
            const existingKeys = new Set((node.children || []).map((child) => child.key));
            // Filter out the new nodes that are already added (prevent recursion)
            const uniqueNewNodes = newNodes.filter((newNode) => !existingKeys.has(newNode.key));
  
            if (uniqueNewNodes.length > 0) {
              return {
                ...node,
                children: [
                  ...(node.children || []),
                  ...uniqueNewNodes, 
                ],
              };
            }
            // If no unique nodes, return the node as-is
            return node;
          } else if (node.children) {
            return {
              ...node,
              children: addNodes(node.children), // Recursively check children
            };
          }
          return node;
        });
      };
  
      return addNodes(prevData);
    });
  };
  

  // Function to set initial data for treeData
  const setInitialTreeData = (data) => {
    setTreeData(data);
  };

  // Function to set initial data for relatedTree
  const setInitialRelatedTreeData = (data) => {
    setRelatedTree(data);
  };

  return (
    <TreeDataContext.Provider value={{
      treeData,
      setTreeData,
      addLeafNode,
      setInitialTreeData,
      relatedTree,
      setRelatedTree,
      addLeafNodeToRelatedTree,
      setInitialRelatedTreeData,
    }}>
      {children}
    </TreeDataContext.Provider>
  );
};

// Hook to use context
export const useTreeData = () => useContext(TreeDataContext);
