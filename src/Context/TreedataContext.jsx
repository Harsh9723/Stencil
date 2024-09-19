import React, { createContext, useContext, useState } from 'react';

const TreeDataContext = createContext();

export const TreeDataProvider = ({ children }) => {
  const [treeData, setTreeData] = useState([]);
  const [relatedTree, setRelatedTree] = useState([]);


  const addLeafNode = (parentKey, ...newNodes) => {
    setTreeData((prevData) => {
      const addNodes = (nodes) => {
        return nodes.map((node) => {
          if (node.key === parentKey) {
            const existingKeys = new Set((node.children || []).map((child) => child.key));
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
            return node;
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
  
  const addLeafNodeToRelatedTree = (parentKey, ...newNodes) => {
    setRelatedTree((prevData) => {
      const addNodes = (nodes) => {
        return nodes.map((node) => {
          if (node.key === parentKey) {
            const existingKeys = new Set((node.children || []).map((child) => child.key));
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
            return node;
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

  const setInitialTreeData = (data) => {
    setTreeData(data);
  };

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
