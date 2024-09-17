import { NestedSetNode } from '@/nestedsets'

const treeData = {
  title: "CEO",
  left: 0,
  right: 13,
  depth: 0,
  detail: { name: "John Doe", age: 50, username: "jdoe" }, // User detail for CEO
  children: [
    {
      title: "Manager 1",
      detail: { name: "Alice Smith", age: 40, username: "asmith" }, // User detail for Manager 1
      // children: [
      //   { 
      //     title: "Employee 1", 
      //     left: 2, 
      //     right: 3, 
      //     depth: 2,
      //     detail: { name: "Bob Brown", age: 30, username: "bbrown" } // User detail for Employee 1
      //   },
      //   { 
      //     title: "Employee 2", 
      //     left: 4, 
      //     right: 5, 
      //     depth: 2,
      //     detail: { name: "Charlie White", age: 28, username: "cwhite" } // User detail for Employee 2
      //   }
      // ]
    },
    {
      title: "Manager 3",
      detail: { name: "Alice Smith", age: 40, username: "asmith" }, // User detail for Manager 1
      children: []
    },
    {
      title: "Manager 2",
      detail: { name: "David Green", age: 45, username: "dgreen" }, // User detail for Manager 2
      // children: [
      //   { 
      //     title: "Employee 3", 
      //     left: 8, 
      //     right: 9, 
      //     depth: 2,
      //     detail: { name: "Eva Black", age: 26, username: "eblack" } // User detail for Employee 3
      //   },
      //   { 
      //     title: "Employee 4", 
      //     left: 10, 
      //     right: 11, 
      //     depth: 2,
      //     detail: { name: "Frank Grey", age: 32, username: "fgrey" } // User detail for Employee 4
      //   }
      // ]
    }
  ]
};

const rootNode = NestedSetNode.getTree(treeData);
console.log(rootNode);

// const someNode = rootNode.children[1].children[0];
// console.log(someNode.getParent());
