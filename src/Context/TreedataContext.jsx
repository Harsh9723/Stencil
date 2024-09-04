import React, { createContext, useContext, useState } from 'react';

const TreeDataContext = createContext();

export const TreeDataProvider = ({ children }) => {
  const [treeData, setTreeData] = useState([]);
  const [relatedDevice, setRelatedDevice] = useState([]);

  const addLeafNode = (parentKey, ...newNodes) => {
    setTreeData((prevData) => {
      const addNodes = (nodes) => {
        return nodes.map((node) => {
          if (node.key === parentKey) {
            // Check for duplicate leaf nodes by key
            const existingKeys = new Set((node.children || []).map((child) => child.key));
            const uniqueNewNodes = newNodes.filter((newNode) => !existingKeys.has(newNode.key));

            return {
              ...node,
              children: [
                ...(node.children || []),
                ...uniqueNewNodes,
              ],
            };
          } else if (node.children) {
            return {
              ...node,
              children: addNodes(node.children),
            };
          }
          return node;
        });
      };

      return addNodes(prevData);
    });
  };

  // Function to set initial data
  const setInitialTreeData = (data) => {
    setTreeData(data);
  };

  return (
    <TreeDataContext.Provider value={{ treeData, setTreeData, addLeafNode, setInitialTreeData }}>
      {children}
    </TreeDataContext.Provider>
  );
};

// Hook to use context
export const useTreeData = () => useContext(TreeDataContext);
  